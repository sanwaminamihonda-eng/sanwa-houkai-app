# 訪問介護記録アプリ (sanwa-houkai-app)

訪問介護サービスの記録・管理を行うモバイル/Webアプリケーション。

## 概要

- **モバイルアプリ**: 職員が訪問先で記録入力
- **Web管理画面**: スケジュール管理、月次レポート作成
- **AI支援**: Vertex AI による記録要約・分析

## 技術スタック

| 項目 | 技術 |
|------|------|
| DB | Firebase Data Connect (Cloud SQL PostgreSQL) |
| 認証 | Firebase Auth (Google OAuth / Email+Password) |
| ホスティング | Firebase Hosting |
| バックエンド | Cloud Functions |
| AI | Vertex AI Gemini 2.5 Flash |
| モバイル | React Native + Expo |
| Web | Next.js |

## ドキュメント

詳細な設計ドキュメントは [docs/](./docs/) を参照。

| ドキュメント | 内容 |
|-------------|------|
| [architecture.md](./docs/architecture.md) | アーキテクチャ設計 |
| [requirements.md](./docs/requirements.md) | 要件定義 |
| [data-model.md](./docs/data-model.md) | データモデル |
| [ADR](./docs/adr/) | 設計決定記録 |

## 開発

```bash
# 開発環境セットアップ（準備中）
npm install
```

## ライセンス

Private
