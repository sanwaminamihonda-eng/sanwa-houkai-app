# 訪問介護記録アプリ - AI開発ガイド

## プロジェクト概要

訪問介護サービスの記録・管理アプリ（モバイル + Web）

## 技術スタック

| 項目 | 技術 |
|------|------|
| DB | Firebase Data Connect (Cloud SQL PostgreSQL) |
| 認証 | Firebase Auth (Google OAuth / Email+PW) |
| ホスティング | Firebase Hosting |
| バックエンド | Cloud Functions |
| AI | Vertex AI Gemini 2.5 Flash (日本リージョン) |
| モバイル | React Native + Expo |
| Web | Next.js |

## 重要な設計判断

- **オフライン非対応**: 同期問題・バージョン問題を回避（[ADR-0001](./docs/adr/0001-database-architecture.md)）
- **GCP統一**: 認証・DB・AI全てGCP/Firebase
- **シングルDB**: PostgreSQL一本

## ドキュメント

```
docs/
├── README.md           # 目次
├── architecture.md     # アーキテクチャ（確定）
├── requirements.md     # 要件（概要）
├── data-model.md       # データモデル（概要）
├── adr/                # 決定記録
└── handoff/LATEST.md   # 作業状態
```

## 開発ルール

1. **設計変更時**: docs/ を更新
2. **重要決定時**: ADR を作成
3. **セッション終了時**: handoff/LATEST.md を更新
4. **コミット**: 作業単位を小さく、こまめに

## 作業再開時

1. `docs/handoff/LATEST.md` を読む
2. 未完了タスクを確認
3. 必要に応じて関連ドキュメントを参照
