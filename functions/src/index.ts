import { onCall, HttpsError } from "firebase-functions/v2/https";
import { VertexAI } from "@google-cloud/vertexai";

const PROJECT_ID = "sanwa-houkai-app";
const LOCATION = "asia-northeast1";
const MODEL_ID = "gemini-2.5-flash-preview-05-20";

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
