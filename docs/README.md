# 訪問介護記録アプリ - 設計ドキュメント

訪問介護サービスの記録・管理を行うモバイル/Webアプリケーション。
現行AppSheetシステムをFirebase + React Native/Next.jsへ移行。

## クイックリファレンス

| 項目 | 値 |
|------|-----|
| **DB** | Firebase Data Connect（Cloud SQL PostgreSQL） |
| **認証** | Firebase Auth（Google OAuth / Email+Password） |
| **AI** | Vertex AI Gemini 2.5 Flash |
| **モバイル** | React Native + Expo |
| **Web** | Next.js |
| **UIライブラリ** | React Native Paper（Material Design 3） |

## ドキュメント構成

### 設計ドキュメント

| ドキュメント | 内容 | 状態 |
|-------------|------|------|
| [architecture.md](./architecture.md) | アーキテクチャ・技術スタック | ✅ 確定 |
| [requirements.md](./requirements.md) | 要件定義・優先度 | ✅ 詳細化完了 |
| [data-model.md](./data-model.md) | データモデル・ER図・スキーマ | ✅ 詳細化完了 |

### UI設計

| ドキュメント | 内容 |
|-------------|------|
| [ui/design-guidelines.md](./ui/design-guidelines.md) | カラー・タイポグラフィ・UIライブラリ |
| [ui/screens.md](./ui/screens.md) | 画面別仕様・ワイヤーフレーム |
| [ui/schedule-feature.md](./ui/schedule-feature.md) | スケジュール管理機能（D&D対応） |

### 現行システム仕様（移行元）

| ドキュメント | 内容 | 用途 |
|-------------|------|------|
| [legacy/appsheet-spec.md](./legacy/appsheet-spec.md) | AppSheet仕様概要 | 設計・移行マッピング |
| [md/Application_Documentation.md](./md/Application_Documentation.md) | AppSheet完全定義（639カラム） | 詳細参照 |

### ADR（Architecture Decision Records）

| ADR | タイトル | 状態 |
|-----|---------|------|
| [0001](./adr/0001-database-architecture.md) | データベースアーキテクチャ選定 | Accepted |
| [0002](./adr/0002-appsheet-migration.md) | AppSheet移行方針 | Accepted |

### 運用

| ドキュメント | 内容 |
|-------------|------|
| [handoff/LATEST.md](./handoff/LATEST.md) | 作業状態・セッション継続用 |

---

## 実装優先度

```
Phase 1 (MVP)
├── 認証（Google OAuth）
├── 記録入力画面
├── 履歴一覧・詳細
├── 利用者一覧・詳細
└── スケジュール表示（週/日/月）

Phase 2
├── スケジュールD&D（Web）
├── リアルタイム同期
├── AI特記事項生成
└── PDF帳票生成

Phase 3
├── 繰り返し予定
├── 月次AI要約
└── 機能拡張
```

---

## AI開発ガイド

プロジェクトルートの [CLAUDE.md](../CLAUDE.md) を参照。

### タスク別参照ドキュメント

| タスク | 参照 |
|--------|------|
| DB設計・スキーマ変更 | `data-model.md` → `legacy/appsheet-spec.md` |
| 画面実装 | `ui/screens.md` → `ui/design-guidelines.md` |
| スケジュール機能 | `ui/schedule-feature.md` |
| ビジネスロジック | `legacy/appsheet-spec.md` |
| 技術判断 | `architecture.md` → `adr/` |
