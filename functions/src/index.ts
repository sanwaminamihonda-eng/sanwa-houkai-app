import { onCall, HttpsError } from "firebase-functions/v2/https";
import { VertexAI } from "@google-cloud/vertexai";
import * as admin from "firebase-admin";
import { Pool } from "pg";
import * as path from "path";
import PDFDocument from "pdfkit";

const PROJECT_ID = "sanwa-houkai-app";
const LOCATION = "asia-northeast1";
const MODEL_ID = "gemini-2.5-flash-preview-05-20";
const BUCKET_NAME = `${PROJECT_ID}-reports`;

// Firebase Admin SDK初期化
admin.initializeApp();

// Cloud SQL接続設定
const pool = new Pool({
  host: `/cloudsql/${PROJECT_ID}:${LOCATION}:sanwa-houkai-db`,
  database: "fdcdb",
  user: "firebasedataconnect",
  // IAM認証を使用
});

const storage = admin.storage();

// フォントパス
const FONT_PATH = path.join(__dirname, "../fonts/ipaexg.ttf");

// ========== 特記事項AI生成 ==========

interface ServiceItem {
  id: string;
  name: string;
}

interface ServiceContent {
  typeId: string;
  typeName: string;
  items: ServiceItem[];
}

interface Vitals {
  pulse?: number;
  bloodPressureHigh?: number;
  bloodPressureLow?: number;
}

interface GenerateNotesRequest {
  clientName: string;
  visitDate: string;
  visitReason?: string;
  services: ServiceContent[];
  vitals?: Vitals;
  additionalContext?: string;
}

export const generateVisitNotes = onCall<GenerateNotesRequest>(
  {
    region: LOCATION,
    cors: true,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "認証が必要です");
    }

    const { clientName, visitDate, visitReason, services, vitals, additionalContext } =
      request.data;

    if (!clientName || !services || services.length === 0) {
      throw new HttpsError(
        "invalid-argument",
        "利用者名とサービス内容は必須です"
      );
    }

    const vertexAI = new VertexAI({
      project: PROJECT_ID,
      location: LOCATION,
    });

    const generativeModel = vertexAI.getGenerativeModel({
      model: MODEL_ID,
      generationConfig: {
        maxOutputTokens: 512,
        temperature: 0.7,
      },
    });

    const servicesSummary = services
      .map((s) => `${s.typeName}: ${s.items.map((i) => i.name).join("、")}`)
      .join("\n");

    let vitalsSummary = "";
    if (vitals) {
      const parts: string[] = [];
      if (vitals.pulse) parts.push(`脈拍${vitals.pulse}bpm`);
      if (vitals.bloodPressureHigh && vitals.bloodPressureLow) {
        parts.push(`血圧${vitals.bloodPressureHigh}/${vitals.bloodPressureLow}mmHg`);
      }
      if (parts.length > 0) {
        vitalsSummary = `バイタル: ${parts.join("、")}`;
      }
    }

    const prompt = `あなたは訪問介護の記録作成を支援するアシスタントです。
以下の訪問情報をもとに、簡潔で専門的な特記事項を生成してください。

【訪問情報】
利用者: ${clientName}様
訪問日: ${visitDate}
${visitReason ? `訪問理由: ${visitReason}` : ""}
${vitalsSummary}

【実施サービス】
${servicesSummary}

${additionalContext ? `【補足情報】\n${additionalContext}` : ""}

【指示】
- 2〜4文程度で簡潔にまとめてください
- 利用者の状態や変化、気づいた点を含めてください
- 専門的かつ客観的な表現を使用してください
- 「〜でした」「〜しました」などの敬体で記述してください
- 特記事項のテキストのみを出力し、説明や前置きは不要です`;

    try {
      const result = await generativeModel.generateContent(prompt);
      const response = result.response;
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new HttpsError("internal", "AIからの応答が空でした");
      }

      return {
        notes: text.trim(),
        aiGenerated: true,
      };
    } catch (error) {
      console.error("Vertex AI error:", error);
      throw new HttpsError(
        "internal",
        "AI生成中にエラーが発生しました"
      );
    }
  }
);

// ========== 実施報告書PDF生成 ==========

interface GenerateReportRequest {
  clientId: string;
  staffId: string;
  targetYear: number;
  targetMonth: number;
  generateAiSummary: boolean;
}

interface VisitRecord {
  id: string;
  visit_date: Date;
  start_time: string;
  end_time: string;
  vitals: { pulse?: number; bp_high?: number; bp_low?: number } | null;
  services: { physical?: string[]; daily_life?: string[]; independence?: string[] } | null;
  notes: string | null;
  staff_name: string;
}

interface ClientInfo {
  id: string;
  name: string;
  care_level_name: string | null;
}

export const generateReport = onCall<GenerateReportRequest>(
  {
    region: LOCATION,
    cors: true,
    memory: "512MiB",
    timeoutSeconds: 120,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "認証が必要です");
    }

    const { clientId, staffId, targetYear, targetMonth, generateAiSummary } = request.data;

    if (!clientId || !staffId || !targetYear || !targetMonth) {
      throw new HttpsError("invalid-argument", "必須パラメータが不足しています");
    }

    try {
      // 1. 利用者情報取得
      const clientResult = await pool.query<ClientInfo>(
        `SELECT c.id, c.name, cl.name as care_level_name
         FROM clients c
         LEFT JOIN care_levels cl ON c.care_level_id = cl.id
         WHERE c.id = $1`,
        [clientId]
      );

      if (clientResult.rows.length === 0) {
        throw new HttpsError("not-found", "利用者が見つかりません");
      }

      const client = clientResult.rows[0];

      // 2. 対象月の訪問記録取得
      const startDate = new Date(targetYear, targetMonth - 1, 1);
      const endDate = new Date(targetYear, targetMonth, 0);

      const recordsResult = await pool.query<VisitRecord>(
        `SELECT vr.id, vr.visit_date, vr.start_time::text, vr.end_time::text,
                vr.vitals, vr.services, vr.notes, s.name as staff_name
         FROM visit_records vr
         JOIN staff s ON vr.staff_id = s.id
         WHERE vr.client_id = $1
           AND vr.visit_date >= $2
           AND vr.visit_date <= $3
         ORDER BY vr.visit_date, vr.start_time`,
        [clientId, startDate, endDate]
      );

      const records = recordsResult.rows;

      // 3. AI要約生成（オプション）
      let summary = "";
      if (generateAiSummary && records.length > 0) {
        summary = await generateMonthlySummary(client.name, targetYear, targetMonth, records);
      }

      // 4. PDF生成
      const pdfBuffer = await generatePdfBuffer(client, targetYear, targetMonth, records, summary);

      // 5. Cloud Storageにアップロード
      const reportId = `${clientId}_${targetYear}_${String(targetMonth).padStart(2, "0")}`;
      const fileName = `report_${targetYear}${String(targetMonth).padStart(2, "0")}.pdf`;
      const filePath = `reports/${reportId}/${fileName}`;

      const bucket = storage.bucket(BUCKET_NAME);
      const gcsFile = bucket.file(filePath);

      await gcsFile.save(pdfBuffer, {
        contentType: "application/pdf",
        metadata: {
          clientId,
          targetYear: String(targetYear),
          targetMonth: String(targetMonth),
        },
      });

      // 6. 署名付きURL生成（7日間有効）
      const [signedUrl] = await gcsFile.getSignedUrl({
        action: "read",
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      });

      // 7. reportsテーブルに保存/更新（明示的UPSERT）
      const pdfUrl = `gs://${BUCKET_NAME}/${filePath}`;

      // 既存レコードを確認
      const existingReport = await pool.query(
        `SELECT id FROM reports WHERE client_id = $1 AND target_year = $2 AND target_month = $3`,
        [clientId, targetYear, targetMonth]
      );

      if (existingReport.rows.length > 0) {
        // 更新
        await pool.query(
          `UPDATE reports SET summary = $1, ai_generated = $2, pdf_url = $3, pdf_generated = true, updated_at = NOW()
           WHERE client_id = $4 AND target_year = $5 AND target_month = $6`,
          [summary, generateAiSummary, pdfUrl, clientId, targetYear, targetMonth]
        );
      } else {
        // 新規作成
        await pool.query(
          `INSERT INTO reports (id, client_id, staff_id, target_year, target_month, summary, ai_generated, pdf_url, pdf_generated)
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, true)`,
          [clientId, staffId, targetYear, targetMonth, summary, generateAiSummary, pdfUrl]
        );
      }

      return {
        success: true,
        pdfUrl: signedUrl,
        recordCount: records.length,
      };
    } catch (error) {
      console.error("Report generation error:", error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError("internal", "報告書生成中にエラーが発生しました");
    }
  }
);

// AI月次要約生成
async function generateMonthlySummary(
  clientName: string,
  year: number,
  month: number,
  records: VisitRecord[]
): Promise<string> {
  const vertexAI = new VertexAI({
    project: PROJECT_ID,
    location: LOCATION,
  });

  const generativeModel = vertexAI.getGenerativeModel({
    model: MODEL_ID,
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.7,
    },
  });

  const allNotes = records
    .filter((r) => r.notes)
    .map((r) => `${formatDate(r.visit_date)}: ${r.notes}`)
    .join("\n");

  const vitalsSummary = records
    .filter((r) => r.vitals)
    .map((r) => {
      const v = r.vitals!;
      const parts: string[] = [];
      if (v.pulse) parts.push(`脈拍${v.pulse}`);
      if (v.bp_high && v.bp_low) parts.push(`血圧${v.bp_high}/${v.bp_low}`);
      return parts.length > 0 ? `${formatDate(r.visit_date)}: ${parts.join(", ")}` : null;
    })
    .filter(Boolean)
    .join("\n");

  const prompt = `あなたは訪問介護の月次報告書作成を支援するアシスタントです。
以下は${year}年${month}月の訪問記録です。1ヶ月間の利用者の状況を要約してください。

【利用者】${clientName}様
【訪問回数】${records.length}回

【特記事項の記録】
${allNotes || "（記録なし）"}

【バイタル推移】
${vitalsSummary || "（記録なし）"}

【指示】
- 3〜5文程度で月間の状況をまとめてください
- 利用者の状態変化やトレンドに注目してください
- 専門的かつ客観的な表現を使用してください
- 「〜でした」「〜しました」などの敬体で記述してください
- 要約テキストのみを出力し、説明や前置きは不要です`;

  try {
    const result = await generativeModel.generateContent(prompt);
    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    return text?.trim() || "";
  } catch (error) {
    console.error("AI summary generation error:", error);
    return "";
  }
}

// PDF生成
async function generatePdfBuffer(
  client: ClientInfo,
  year: number,
  month: number,
  records: VisitRecord[],
  summary: string
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // 日本語フォント登録
    doc.registerFont("Japanese", FONT_PATH);
    doc.font("Japanese");

    // タイトル
    doc.fontSize(18).text("訪問介護サービス実施報告書", { align: "center" });
    doc.moveDown();

    // 基本情報
    doc.fontSize(12);
    doc.text(`利用者名: ${client.name}`);
    doc.text(`要介護度: ${client.care_level_name || "未設定"}`);
    doc.text(`対象期間: ${year}年${month}月`);
    doc.text(`訪問回数: ${records.length}回`);
    doc.moveDown();

    // 訪問実績一覧
    doc.fontSize(14).text("【訪問実績一覧】");
    doc.moveDown(0.5);

    if (records.length === 0) {
      doc.fontSize(10).text("対象期間の訪問記録はありません。");
    } else {
      // テーブルヘッダー
      doc.fontSize(10);
      const tableTop = doc.y;
      const colWidths = [60, 80, 60, 280];
      const headers = ["日付", "時間", "担当", "サービス内容"];

      let x = 50;
      headers.forEach((header, i) => {
        doc.text(header, x, tableTop, { width: colWidths[i] });
        x += colWidths[i];
      });

      doc.moveTo(50, tableTop + 15).lineTo(545, tableTop + 15).stroke();

      // テーブル行
      let y = tableTop + 20;
      for (const record of records) {
        if (y > 750) {
          doc.addPage();
          y = 50;
        }

        const services = formatServices(record.services);
        const date = formatDate(record.visit_date);
        const time = `${formatTime(record.start_time)}-${formatTime(record.end_time)}`;

        x = 50;
        doc.text(date, x, y, { width: colWidths[0] });
        x += colWidths[0];
        doc.text(time, x, y, { width: colWidths[1] });
        x += colWidths[1];
        doc.text(record.staff_name, x, y, { width: colWidths[2] });
        x += colWidths[2];
        doc.text(services, x, y, { width: colWidths[3] });

        y += 20;
      }
    }

    doc.moveDown(2);

    // バイタル記録
    const vitalsRecords = records.filter((r) => r.vitals && (r.vitals.pulse || r.vitals.bp_high));
    if (vitalsRecords.length > 0) {
      doc.fontSize(14).text("【バイタル記録】");
      doc.moveDown(0.5);
      doc.fontSize(10);

      for (const record of vitalsRecords) {
        const v = record.vitals!;
        const parts: string[] = [];
        if (v.pulse) parts.push(`脈拍: ${v.pulse}bpm`);
        if (v.bp_high && v.bp_low) parts.push(`血圧: ${v.bp_high}/${v.bp_low}mmHg`);
        doc.text(`${formatDate(record.visit_date)}: ${parts.join("  ")}`);
      }
      doc.moveDown();
    }

    // 生活状況・特記事項
    doc.fontSize(14).text("【生活状況・特記事項】");
    doc.moveDown(0.5);
    doc.fontSize(10);

    if (summary) {
      doc.text(summary);
    } else {
      // 個別の特記事項を列挙
      const notesRecords = records.filter((r) => r.notes);
      if (notesRecords.length > 0) {
        for (const record of notesRecords) {
          doc.text(`${formatDate(record.visit_date)}: ${record.notes}`);
        }
      } else {
        doc.text("特記事項なし");
      }
    }

    // フッター
    doc.moveDown(2);
    doc.fontSize(8).text(`作成日: ${new Date().toLocaleDateString("ja-JP")}`, { align: "right" });

    doc.end();
  });
}

// ヘルパー関数
function formatDate(date: Date): string {
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatTime(time: string): string {
  // "HH:MM:SS" -> "HH:MM"
  return time.substring(0, 5);
}

function formatServices(
  services: { physical?: string[]; daily_life?: string[]; independence?: string[] } | null
): string {
  if (!services) return "";

  const parts: string[] = [];
  if (services.physical?.length) {
    parts.push(`身体: ${services.physical.join(",")}`);
  }
  if (services.daily_life?.length) {
    parts.push(`生活: ${services.daily_life.join(",")}`);
  }
  if (services.independence?.length) {
    parts.push(`自立: ${services.independence.join(",")}`);
  }
  return parts.join(" / ");
}
