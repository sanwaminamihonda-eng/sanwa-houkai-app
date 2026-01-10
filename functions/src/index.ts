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

// ========== 訪問介護計画書PDF生成 ==========

interface Goal {
  content: string;
  startDate?: string;
  endDate?: string;
}

interface GenerateCarePlanRequest {
  carePlanId?: string;  // 既存の計画書ID（更新時）
  clientId: string;
  staffId: string;
  currentSituation: string;
  familyWishes: string;
  mainSupport: string;
  longTermGoals: Goal[];
  shortTermGoals: Goal[];
}

interface CarePlanClientInfo {
  id: string;
  name: string;
  birth_date: Date | null;
  gender: string | null;
  care_level_name: string | null;
  address_prefecture: string | null;
  address_city: string | null;
}

export const generateCarePlan = onCall<GenerateCarePlanRequest>(
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

    const {
      carePlanId,
      clientId,
      staffId,
      currentSituation,
      familyWishes,
      mainSupport,
      longTermGoals,
      shortTermGoals,
    } = request.data;

    if (!clientId || !staffId) {
      throw new HttpsError("invalid-argument", "利用者IDと作成者IDは必須です");
    }

    try {
      // 1. 利用者情報取得
      const clientResult = await pool.query<CarePlanClientInfo>(
        `SELECT c.id, c.name, c.birth_date, c.gender,
                c.address_prefecture, c.address_city,
                cl.name as care_level_name
         FROM clients c
         LEFT JOIN care_levels cl ON c.care_level_id = cl.id
         WHERE c.id = $1`,
        [clientId]
      );

      if (clientResult.rows.length === 0) {
        throw new HttpsError("not-found", "利用者が見つかりません");
      }

      const client = clientResult.rows[0];

      // 2. PDF生成
      const pdfBuffer = await generateCarePlanPdfBuffer(
        client,
        currentSituation,
        familyWishes,
        mainSupport,
        longTermGoals,
        shortTermGoals
      );

      // 3. Cloud Storageにアップロード
      const timestamp = Date.now();
      const fileName = `careplan_${timestamp}.pdf`;
      const filePath = `careplans/${clientId}/${fileName}`;

      const bucket = storage.bucket(BUCKET_NAME);
      const gcsFile = bucket.file(filePath);

      await gcsFile.save(pdfBuffer, {
        contentType: "application/pdf",
        metadata: {
          clientId,
          staffId,
          createdAt: new Date().toISOString(),
        },
      });

      // 4. 署名付きURL生成（7日間有効）
      const [signedUrl] = await gcsFile.getSignedUrl({
        action: "read",
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      });

      const pdfUrl = `gs://${BUCKET_NAME}/${filePath}`;

      // 5. care_plansテーブルに保存/更新
      if (carePlanId) {
        // 既存の計画書を更新
        await pool.query(
          `UPDATE care_plans SET
             current_situation = $1,
             family_wishes = $2,
             main_support = $3,
             long_term_goals = $4,
             short_term_goals = $5,
             pdf_url = $6,
             updated_at = NOW()
           WHERE id = $7`,
          [
            currentSituation,
            familyWishes,
            mainSupport,
            JSON.stringify(longTermGoals),
            JSON.stringify(shortTermGoals),
            pdfUrl,
            carePlanId,
          ]
        );
      } else {
        // 新規作成
        await pool.query(
          `INSERT INTO care_plans (id, client_id, staff_id, current_situation, family_wishes, main_support, long_term_goals, short_term_goals, pdf_url)
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            clientId,
            staffId,
            currentSituation,
            familyWishes,
            mainSupport,
            JSON.stringify(longTermGoals),
            JSON.stringify(shortTermGoals),
            pdfUrl,
          ]
        );
      }

      return {
        success: true,
        pdfUrl: signedUrl,
      };
    } catch (error) {
      console.error("Care plan generation error:", error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError("internal", "計画書生成中にエラーが発生しました");
    }
  }
);

// 計画書PDF生成
async function generateCarePlanPdfBuffer(
  client: CarePlanClientInfo,
  currentSituation: string,
  familyWishes: string,
  mainSupport: string,
  longTermGoals: Goal[],
  shortTermGoals: Goal[]
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 40, bottom: 40, left: 50, right: 50 },
    });

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // 日本語フォント登録
    doc.registerFont("Japanese", FONT_PATH);
    doc.font("Japanese");

    // タイトル
    doc.fontSize(18).text("訪問介護計画書", { align: "center" });
    doc.moveDown(0.5);

    // 作成日
    doc.fontSize(10).text(`作成日: ${new Date().toLocaleDateString("ja-JP")}`, { align: "right" });
    doc.moveDown();

    // 基本情報セクション
    doc.fontSize(12);
    const basicInfoY = doc.y;

    // 左列
    doc.text(`利用者名: ${client.name}`, 50, basicInfoY);
    if (client.birth_date) {
      const birthDate = new Date(client.birth_date);
      const age = calculateAge(birthDate);
      doc.text(`生年月日: ${formatFullDate(birthDate)} (${age}歳)`, 50);
    }
    doc.text(`性別: ${client.gender || "未設定"}`, 50);

    // 右列
    doc.text(`要介護度: ${client.care_level_name || "未設定"}`, 300, basicInfoY);
    if (client.address_prefecture || client.address_city) {
      doc.text(`住所: ${client.address_prefecture || ""}${client.address_city || ""}`, 300);
    }

    doc.moveDown(2);

    // 区切り線
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown();

    // 利用者の生活現状
    doc.fontSize(12).text("【利用者の生活現状】", { underline: false });
    doc.moveDown(0.3);
    doc.fontSize(10);
    drawTextBox(doc, currentSituation || "（未入力）", 50, doc.y, 495, 60);
    doc.moveDown(0.5);

    // 利用者及び家族の意向・希望
    doc.fontSize(12).text("【利用者及び家族の意向・希望】");
    doc.moveDown(0.3);
    doc.fontSize(10);
    drawTextBox(doc, familyWishes || "（未入力）", 50, doc.y, 495, 60);
    doc.moveDown(0.5);

    // 主な支援内容
    doc.fontSize(12).text("【主な支援内容】");
    doc.moveDown(0.3);
    doc.fontSize(10);
    drawTextBox(doc, mainSupport || "（未入力）", 50, doc.y, 495, 60);
    doc.moveDown(0.5);

    // ページ確認・追加
    if (doc.y > 600) {
      doc.addPage();
    }

    // 長期目標
    doc.fontSize(12).text("【長期目標】");
    doc.moveDown(0.3);
    doc.fontSize(10);

    if (longTermGoals && longTermGoals.length > 0) {
      longTermGoals.forEach((goal, index) => {
        const goalText = goal.content || "（未入力）";
        const dateRange = formatGoalDateRange(goal.startDate, goal.endDate);
        doc.text(`${index + 1}. ${goalText}`);
        if (dateRange) {
          doc.fontSize(9).text(`   期間: ${dateRange}`, { indent: 20 });
          doc.fontSize(10);
        }
        doc.moveDown(0.3);
      });
    } else {
      doc.text("（未設定）");
    }
    doc.moveDown(0.5);

    // 短期目標
    doc.fontSize(12).text("【短期目標】");
    doc.moveDown(0.3);
    doc.fontSize(10);

    if (shortTermGoals && shortTermGoals.length > 0) {
      shortTermGoals.forEach((goal, index) => {
        const goalText = goal.content || "（未入力）";
        const dateRange = formatGoalDateRange(goal.startDate, goal.endDate);
        doc.text(`${index + 1}. ${goalText}`);
        if (dateRange) {
          doc.fontSize(9).text(`   期間: ${dateRange}`, { indent: 20 });
          doc.fontSize(10);
        }
        doc.moveDown(0.3);
      });
    } else {
      doc.text("（未設定）");
    }

    // フッター
    doc.moveDown(2);
    doc.fontSize(8).text("※この計画書は利用者の状態に応じて随時見直しを行います。", { align: "center" });

    doc.end();
  });
}

// テキストボックス描画（枠線付き）
function drawTextBox(
  doc: InstanceType<typeof PDFDocument>,
  text: string,
  x: number,
  y: number,
  width: number,
  minHeight: number
): void {
  const textHeight = doc.heightOfString(text, { width: width - 10 });
  const boxHeight = Math.max(minHeight, textHeight + 10);

  doc.rect(x, y, width, boxHeight).stroke();
  doc.text(text, x + 5, y + 5, { width: width - 10 });
  doc.y = y + boxHeight + 5;
}

// 年齢計算
function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// 完全な日付フォーマット
function formatFullDate(date: Date): string {
  const d = new Date(date);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

// 目標期間フォーマット
function formatGoalDateRange(startDate?: string, endDate?: string): string {
  if (!startDate && !endDate) return "";

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  };

  if (startDate && endDate) {
    return `${formatDate(startDate)} 〜 ${formatDate(endDate)}`;
  } else if (startDate) {
    return `${formatDate(startDate)} 〜`;
  } else if (endDate) {
    return `〜 ${formatDate(endDate)}`;
  }
  return "";
}

// ========== デモデータリセット ==========

const DEMO_FACILITY_ID = "00000000-0000-0000-0000-000000000001";

export const resetDemoData = onCall(
  {
    region: LOCATION,
    cors: true,
    memory: "512MiB",
    timeoutSeconds: 120,
  },
  async () => {
    // 認証不要（デモ用）
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. デモデータ削除（外部キー制約の順序で）
      // 訪問記録を削除
      await client.query(
        `DELETE FROM visit_records WHERE client_id IN (SELECT id FROM clients WHERE facility_id = $1)`,
        [DEMO_FACILITY_ID]
      );

      // スケジュールを削除
      await client.query(
        `DELETE FROM schedules WHERE facility_id = $1`,
        [DEMO_FACILITY_ID]
      );

      // 実施報告書を削除
      await client.query(
        `DELETE FROM reports WHERE client_id IN (SELECT id FROM clients WHERE facility_id = $1)`,
        [DEMO_FACILITY_ID]
      );

      // ケアプランを削除
      await client.query(
        `DELETE FROM care_plans WHERE client_id IN (SELECT id FROM clients WHERE facility_id = $1)`,
        [DEMO_FACILITY_ID]
      );

      // 利用者を削除
      await client.query(
        `DELETE FROM clients WHERE facility_id = $1`,
        [DEMO_FACILITY_ID]
      );

      // 職員を削除
      await client.query(
        `DELETE FROM staff WHERE facility_id = $1`,
        [DEMO_FACILITY_ID]
      );

      // サービス項目を削除
      await client.query(
        `DELETE FROM service_items WHERE service_type_id IN (SELECT id FROM service_types WHERE facility_id = $1)`,
        [DEMO_FACILITY_ID]
      );

      // サービス種類を削除
      await client.query(
        `DELETE FROM service_types WHERE facility_id = $1`,
        [DEMO_FACILITY_ID]
      );

      // 事業所を削除
      await client.query(
        `DELETE FROM facilities WHERE id = $1`,
        [DEMO_FACILITY_ID]
      );

      // 2. シードデータ挿入

      // 要介護度マスタ（存在しない場合のみ）
      await client.query(`
        INSERT INTO care_levels (id, name, sort_order) VALUES
          ('00000000-0000-0000-0000-000000000201', '要支援1', 1),
          ('00000000-0000-0000-0000-000000000202', '要支援2', 2),
          ('00000000-0000-0000-0000-000000000203', '要介護1', 3),
          ('00000000-0000-0000-0000-000000000204', '要介護2', 4),
          ('00000000-0000-0000-0000-000000000205', '要介護3', 5),
          ('00000000-0000-0000-0000-000000000206', '要介護4', 6),
          ('00000000-0000-0000-0000-000000000207', '要介護5', 7)
        ON CONFLICT (id) DO NOTHING
      `);

      // 訪問理由マスタ（存在しない場合のみ）
      await client.query(`
        INSERT INTO visit_reasons (id, name, sort_order) VALUES
          ('00000000-0000-0000-0000-000000000301', '通常訪問', 1),
          ('00000000-0000-0000-0000-000000000302', '緊急訪問', 2),
          ('00000000-0000-0000-0000-000000000303', '初回訪問', 3),
          ('00000000-0000-0000-0000-000000000304', 'サービス担当者会議', 4),
          ('00000000-0000-0000-0000-000000000305', 'その他', 5)
        ON CONFLICT (id) DO NOTHING
      `);

      // 事業所
      await client.query(`
        INSERT INTO facilities (id, name, address, phone, created_at, updated_at) VALUES
          ($1, 'デモ訪問介護ステーション', '東京都千代田区丸の内1-1-1', '03-1234-5678', NOW(), NOW())
      `, [DEMO_FACILITY_ID]);

      // サービス種類
      await client.query(`
        INSERT INTO service_types (id, facility_id, code, name, category, color, sort_order) VALUES
          ('00000000-0000-0000-0000-000000000501', $1, 'SH', '身体介護', '身体介護', '#4CAF50', 1),
          ('00000000-0000-0000-0000-000000000502', $1, 'SE', '生活援助', '生活援助', '#2196F3', 2),
          ('00000000-0000-0000-0000-000000000503', $1, 'JR', '自立支援', '自立支援', '#FF9800', 3),
          ('00000000-0000-0000-0000-000000000504', $1, 'YS', '夜間対応', '夜間対応', '#9C27B0', 4),
          ('00000000-0000-0000-0000-000000000505', $1, 'TK', '特定行為', '特定行為', '#F44336', 5),
          ('00000000-0000-0000-0000-000000000506', $1, 'SO', 'その他', 'その他', '#607D8B', 6)
      `, [DEMO_FACILITY_ID]);

      // サービス項目（身体介護）
      await client.query(`
        INSERT INTO service_items (id, service_type_id, name, sort_order) VALUES
          ('00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000501', '排泄介助', 1),
          ('00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000501', '入浴介助', 2),
          ('00000000-0000-0000-0000-000000000603', '00000000-0000-0000-0000-000000000501', '清拭', 3),
          ('00000000-0000-0000-0000-000000000604', '00000000-0000-0000-0000-000000000501', '食事介助', 4),
          ('00000000-0000-0000-0000-000000000605', '00000000-0000-0000-0000-000000000501', '服薬介助', 5),
          ('00000000-0000-0000-0000-000000000606', '00000000-0000-0000-0000-000000000501', '更衣介助', 6),
          ('00000000-0000-0000-0000-000000000607', '00000000-0000-0000-0000-000000000501', '体位変換', 7),
          ('00000000-0000-0000-0000-000000000608', '00000000-0000-0000-0000-000000000501', '移乗介助', 8),
          ('00000000-0000-0000-0000-000000000609', '00000000-0000-0000-0000-000000000501', '歩行介助', 9),
          ('00000000-0000-0000-0000-000000000610', '00000000-0000-0000-0000-000000000501', '整容介助', 10)
      `);

      // サービス項目（生活援助）
      await client.query(`
        INSERT INTO service_items (id, service_type_id, name, sort_order) VALUES
          ('00000000-0000-0000-0000-000000000611', '00000000-0000-0000-0000-000000000502', '掃除', 1),
          ('00000000-0000-0000-0000-000000000612', '00000000-0000-0000-0000-000000000502', '洗濯', 2),
          ('00000000-0000-0000-0000-000000000613', '00000000-0000-0000-0000-000000000502', '調理', 3),
          ('00000000-0000-0000-0000-000000000614', '00000000-0000-0000-0000-000000000502', '買い物代行', 4),
          ('00000000-0000-0000-0000-000000000615', '00000000-0000-0000-0000-000000000502', 'ゴミ出し', 5),
          ('00000000-0000-0000-0000-000000000616', '00000000-0000-0000-0000-000000000502', '薬の受け取り', 6)
      `);

      // サービス項目（自立支援）
      await client.query(`
        INSERT INTO service_items (id, service_type_id, name, sort_order) VALUES
          ('00000000-0000-0000-0000-000000000617', '00000000-0000-0000-0000-000000000503', '外出同行', 1),
          ('00000000-0000-0000-0000-000000000618', '00000000-0000-0000-0000-000000000503', '通院等乗降介助', 2),
          ('00000000-0000-0000-0000-000000000619', '00000000-0000-0000-0000-000000000503', 'リハビリ補助', 3),
          ('00000000-0000-0000-0000-000000000620', '00000000-0000-0000-0000-000000000503', '見守り', 4)
      `);

      // 職員
      await client.query(`
        INSERT INTO staff (id, facility_id, firebase_uid, name, email, role, is_active, created_at, updated_at) VALUES
          ('00000000-0000-0000-0000-000000000101', $1, NULL, 'デモユーザー', 'demo@example.com', 'admin', true, NOW(), NOW()),
          ('00000000-0000-0000-0000-000000000102', $1, NULL, '山田 花子', 'yamada@example.com', 'staff', true, NOW(), NOW()),
          ('00000000-0000-0000-0000-000000000103', $1, NULL, '佐藤 太郎', 'sato@example.com', 'staff', true, NOW(), NOW()),
          ('00000000-0000-0000-0000-000000000104', $1, NULL, '鈴木 一郎', 'suzuki@example.com', 'staff', true, NOW(), NOW())
      `, [DEMO_FACILITY_ID]);

      // 利用者
      await client.query(`
        INSERT INTO clients (id, facility_id, name, name_kana, gender, birth_date, care_level_id, address_prefecture, address_city, phone, care_manager, care_office, emergency_phone, emergency_name, emergency_relation, notes, is_active, created_at, updated_at) VALUES
          ('00000000-0000-0000-0000-000000000401', $1, '田中 太郎', 'タナカ タロウ', '男性', '1940-05-15', '00000000-0000-0000-0000-000000000204', '東京都', '千代田区', '03-1111-2222', '高橋 ケアマネ', 'ケアセンター東京', '090-1111-2222', '田中 花子', '妻', '明るい性格で会話好き', true, NOW(), NOW()),
          ('00000000-0000-0000-0000-000000000402', $1, '佐藤 幸子', 'サトウ サチコ', '女性', '1935-08-20', '00000000-0000-0000-0000-000000000205', '東京都', '新宿区', '03-2222-3333', '渡辺 ケアマネ', '新宿ケアステーション', '090-2222-3333', '佐藤 一郎', '息子', '読書が趣味', true, NOW(), NOW()),
          ('00000000-0000-0000-0000-000000000403', $1, '山田 次郎', 'ヤマダ ジロウ', '男性', '1945-03-10', '00000000-0000-0000-0000-000000000203', '東京都', '渋谷区', '03-3333-4444', '伊藤 ケアマネ', '渋谷介護センター', '090-3333-4444', '山田 美子', '娘', '一人暮らし', true, NOW(), NOW()),
          ('00000000-0000-0000-0000-000000000404', $1, '鈴木 美代子', 'スズキ ミヨコ', '女性', '1938-11-25', '00000000-0000-0000-0000-000000000206', '東京都', '世田谷区', '03-4444-5555', '中村 ケアマネ', '世田谷ケアサポート', '090-4444-5555', '鈴木 健一', '息子', '全介助が必要', true, NOW(), NOW()),
          ('00000000-0000-0000-0000-000000000405', $1, '高橋 健太', 'タカハシ ケンタ', '男性', '1950-07-08', '00000000-0000-0000-0000-000000000201', '東京都', '目黒区', '03-5555-6666', '小林 ケアマネ', '目黒介護ステーション', '090-5555-6666', '高橋 真理', '妻', '元教師', true, NOW(), NOW()),
          ('00000000-0000-0000-0000-000000000406', $1, '伊藤 節子', 'イトウ セツコ', '女性', '1942-12-03', '00000000-0000-0000-0000-000000000204', '東京都', '大田区', '03-6666-7777', '山本 ケアマネ', '大田ケアセンター', '090-6666-7777', '伊藤 誠', '夫', '手芸が趣味', true, NOW(), NOW()),
          ('00000000-0000-0000-0000-000000000407', $1, '渡辺 勝', 'ワタナベ マサル', '男性', '1948-09-17', '00000000-0000-0000-0000-000000000202', '東京都', '品川区', '03-7777-8888', '加藤 ケアマネ', '品川介護サービス', '090-7777-8888', '渡辺 久美子', '妻', '囲碁が趣味', true, NOW(), NOW()),
          ('00000000-0000-0000-0000-000000000408', $1, '中村 智子', 'ナカムラ トモコ', '女性', '1936-04-22', '00000000-0000-0000-0000-000000000207', '東京都', '杉並区', '03-8888-9999', '佐々木 ケアマネ', '杉並ケアステーション', '090-8888-9999', '中村 浩二', '息子', '胃ろう管理中', true, NOW(), NOW()),
          ('00000000-0000-0000-0000-000000000409', $1, '小林 正男', 'コバヤシ マサオ', '男性', '1947-01-30', '00000000-0000-0000-0000-000000000203', '東京都', '中野区', '03-9999-0000', '松本 ケアマネ', '中野介護センター', '090-9999-0000', '小林 恵子', '娘', '元会社員', true, NOW(), NOW()),
          ('00000000-0000-0000-0000-000000000410', $1, '加藤 由美', 'カトウ ユミ', '女性', '1943-06-14', '00000000-0000-0000-0000-000000000205', '東京都', '練馬区', '03-0000-1111', '藤田 ケアマネ', '練馬ケアサポート', '090-0000-1111', '加藤 雅彦', '息子', 'カラオケが好き', true, NOW(), NOW())
      `, [DEMO_FACILITY_ID]);

      // スケジュール生成（過去7日〜今後14日）
      const today = new Date();
      for (let i = -7; i <= 14; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];
        const dayOfWeek = date.getDay();
        const status = i < 0 ? "completed" : "scheduled";

        // 田中太郎: 月水金
        if ([1, 3, 5].includes(dayOfWeek)) {
          await client.query(`
            INSERT INTO schedules (id, facility_id, client_id, staff_id, service_type_id, scheduled_date, start_time, end_time, status, notes, created_at, updated_at)
            VALUES (gen_random_uuid(), $1, '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000501', $2, '09:00', '10:00', $3, '定期訪問（身体介護）', NOW(), NOW())
          `, [DEMO_FACILITY_ID, dateStr, status]);
        }

        // 佐藤幸子: 火木土
        if ([2, 4, 6].includes(dayOfWeek)) {
          await client.query(`
            INSERT INTO schedules (id, facility_id, client_id, staff_id, service_type_id, scheduled_date, start_time, end_time, status, notes, created_at, updated_at)
            VALUES (gen_random_uuid(), $1, '00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000501', $2, '10:00', '11:30', $3, '定期訪問（入浴介助）', NOW(), NOW())
          `, [DEMO_FACILITY_ID, dateStr, status]);
        }

        // 鈴木美代子: 毎日2回
        await client.query(`
          INSERT INTO schedules (id, facility_id, client_id, staff_id, service_type_id, scheduled_date, start_time, end_time, status, notes, created_at, updated_at)
          VALUES (gen_random_uuid(), $1, '00000000-0000-0000-0000-000000000404', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000501', $2, '08:00', '09:00', $3, '朝のケア', NOW(), NOW())
        `, [DEMO_FACILITY_ID, dateStr, status]);

        await client.query(`
          INSERT INTO schedules (id, facility_id, client_id, staff_id, service_type_id, scheduled_date, start_time, end_time, status, notes, created_at, updated_at)
          VALUES (gen_random_uuid(), $1, '00000000-0000-0000-0000-000000000404', '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000501', $2, '17:00', '18:00', $3, '夕方のケア', NOW(), NOW())
        `, [DEMO_FACILITY_ID, dateStr, status]);
      }

      // 訪問記録生成（過去30日分）
      for (let i = 1; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        const dayOfWeek = date.getDay();

        // 田中太郎
        if ([1, 3, 5].includes(dayOfWeek)) {
          const bp_high = 120 + Math.floor(Math.random() * 20);
          const bp_low = 70 + Math.floor(Math.random() * 15);
          const pulse = 65 + Math.floor(Math.random() * 20);
          const temp = (36.0 + Math.random() * 1.0).toFixed(1);

          await client.query(`
            INSERT INTO visit_records (id, client_id, staff_id, visit_date, visit_reason_id, start_time, end_time, vitals, services, notes, ai_generated, created_at, updated_at)
            VALUES (
              gen_random_uuid(),
              '00000000-0000-0000-0000-000000000401',
              '00000000-0000-0000-0000-000000000102',
              $1,
              '00000000-0000-0000-0000-000000000301',
              '09:00', '10:00',
              $2::jsonb,
              '{"items": ["排泄介助", "服薬介助", "歩行介助"]}'::jsonb,
              '体調良好。定期訪問実施。',
              false, NOW(), NOW()
            )
          `, [dateStr, JSON.stringify({ bloodPressure: `${bp_high}/${bp_low}`, pulse, temperature: parseFloat(temp), spo2: 97 })]);
        }

        // 佐藤幸子
        if ([2, 4, 6].includes(dayOfWeek)) {
          const bp_high = 130 + Math.floor(Math.random() * 25);
          const bp_low = 75 + Math.floor(Math.random() * 15);
          const pulse = 70 + Math.floor(Math.random() * 15);

          await client.query(`
            INSERT INTO visit_records (id, client_id, staff_id, visit_date, visit_reason_id, start_time, end_time, vitals, services, notes, ai_generated, created_at, updated_at)
            VALUES (
              gen_random_uuid(),
              '00000000-0000-0000-0000-000000000402',
              '00000000-0000-0000-0000-000000000103',
              $1,
              '00000000-0000-0000-0000-000000000301',
              '10:00', '11:30',
              $2::jsonb,
              '{"items": ["入浴介助", "更衣介助", "整容介助"]}'::jsonb,
              '入浴を楽しまれていた。',
              false, NOW(), NOW()
            )
          `, [dateStr, JSON.stringify({ bloodPressure: `${bp_high}/${bp_low}`, pulse, spo2: 95 })]);
        }

        // 鈴木美代子: 毎日2回
        await client.query(`
          INSERT INTO visit_records (id, client_id, staff_id, visit_date, visit_reason_id, start_time, end_time, vitals, services, notes, ai_generated, created_at, updated_at)
          VALUES (
            gen_random_uuid(),
            '00000000-0000-0000-0000-000000000404',
            '00000000-0000-0000-0000-000000000102',
            $1,
            '00000000-0000-0000-0000-000000000301',
            '08:00', '09:00',
            '{"bloodPressure": "105/65", "pulse": 72, "spo2": 94}'::jsonb,
            '{"items": ["排泄介助", "体位変換", "更衣介助"]}'::jsonb,
            '穏やかな表情で過ごされていた。',
            false, NOW(), NOW()
          )
        `, [dateStr]);

        await client.query(`
          INSERT INTO visit_records (id, client_id, staff_id, visit_date, visit_reason_id, start_time, end_time, vitals, services, notes, ai_generated, created_at, updated_at)
          VALUES (
            gen_random_uuid(),
            '00000000-0000-0000-0000-000000000404',
            '00000000-0000-0000-0000-000000000103',
            $1,
            '00000000-0000-0000-0000-000000000301',
            '17:00', '18:00',
            '{"bloodPressure": "108/68", "pulse": 70, "spo2": 93}'::jsonb,
            '{"items": ["排泄介助", "体位変換", "更衣介助"]}'::jsonb,
            '夕方も穏やかに過ごされていた。',
            false, NOW(), NOW()
          )
        `, [dateStr]);
      }

      // 実施報告書
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;
      const prevMonth1 = currentMonth - 1 > 0 ? currentMonth - 1 : 12;
      const prevMonth2 = currentMonth - 2 > 0 ? currentMonth - 2 : 12;
      const prevYear1 = prevMonth1 === 12 ? currentYear - 1 : currentYear;
      const prevYear2 = prevMonth2 >= 11 ? currentYear - 1 : currentYear;

      await client.query(`
        INSERT INTO reports (id, client_id, staff_id, target_year, target_month, summary, ai_generated, pdf_generated, created_at, updated_at) VALUES
          ('00000000-0000-0000-0000-000000000901', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000101', $1, $2, '体調安定。定期訪問を継続。', false, false, NOW(), NOW()),
          ('00000000-0000-0000-0000-000000000902', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000101', $3, $4, '先月に引き続き安定。', false, false, NOW(), NOW()),
          ('00000000-0000-0000-0000-000000000903', '00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000101', $1, $2, '入浴介助順調。', false, false, NOW(), NOW()),
          ('00000000-0000-0000-0000-000000000904', '00000000-0000-0000-0000-000000000404', '00000000-0000-0000-0000-000000000101', $1, $2, '全介助継続中。穏やかに過ごす。', false, false, NOW(), NOW())
      `, [prevYear2, prevMonth2, prevYear1, prevMonth1]);

      // ケアプラン
      await client.query(`
        INSERT INTO care_plans (id, client_id, staff_id, current_situation, family_wishes, main_support, long_term_goals, short_term_goals, created_at, updated_at) VALUES
          ('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000101', '糖尿病があり食事管理が必要。', '自宅で安心して過ごしてほしい。', '排泄介助、服薬管理、歩行介助', '{"goals": ["日常生活動作の維持"]}', '{"goals": ["毎日の服薬を確実に"]}', NOW(), NOW()),
          ('00000000-0000-0000-0000-000000001002', '00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000101', '車椅子生活だが上肢機能良好。', '清潔を保ち趣味を楽しんでほしい。', '入浴介助を中心に清潔保持。', '{"goals": ["清潔で快適な生活"]}', '{"goals": ["週3回の入浴継続"]}', NOW(), NOW()),
          ('00000000-0000-0000-0000-000000001003', '00000000-0000-0000-0000-000000000404', '00000000-0000-0000-0000-000000000101', 'ベッド上生活。全介助必要。', '穏やかに過ごしてほしい。', '排泄介助、体位変換、清潔保持。', '{"goals": ["苦痛のない穏やかな生活"]}', '{"goals": ["定時の体位変換を実施"]}', NOW(), NOW())
      `);

      await client.query("COMMIT");

      return {
        success: true,
        message: "デモデータをリセットしました",
      };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Reset demo data error:", error);
      throw new HttpsError("internal", "デモデータのリセットに失敗しました");
    } finally {
      client.release();
    }
  }
);
