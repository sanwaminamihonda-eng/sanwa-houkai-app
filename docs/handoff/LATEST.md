# 作業状態 - 2026-01-09 (Updated)

## プロジェクト概要

**訪問介護サービスの記録・管理アプリ**（モバイル + Web）

現行AppSheet + Google Sheetsシステムを、Firebase + React Native/Next.jsへ移行。

### 現行システム

| 項目 | 値 |
|------|-----|
| プラットフォーム | AppSheet + Google Sheets |
| ユーザー数 | 約30人 |
| 記録数 | 約2万レコード |
| 状態 | 稼働中（並行運用予定） |

## 現在のフェーズ

**設計フェーズ完了** → **インフラ構築フェーズ**

## 完了タスク

### 初期セットアップ
- [x] アーキテクチャ設計確定
- [x] DB選定: Firebase Data Connect (PostgreSQL)
- [x] オフライン非対応の決定（ADR-0001）
- [x] AppSheet移行方針の決定（ADR-0002）
- [x] GitHub リポジトリ作成
- [x] GCP/Firebase プロジェクト作成
- [x] direnv 環境自動切り替え設定

### ドキュメント整備（今回完了）
- [x] AppSheetドキュメントをMarkdownに変換（docs/md/）
- [x] 現行システム仕様書作成（docs/legacy/appsheet-spec.md）
- [x] UI設計ガイドライン作成（docs/ui/design-guidelines.md）
- [x] 画面仕様書作成（docs/ui/screens.md）
- [x] スケジュール管理機能仕様作成（docs/ui/schedule-feature.md）
- [x] データモデル詳細化（docs/data-model.md）
- [x] CLAUDE.md AI駆動開発向け最適化
- [x] docs/README.md 整理

## 設計決定事項

### 技術スタック

| レイヤー | 技術 |
|---------|------|
| DB | Firebase Data Connect (Cloud SQL PostgreSQL) |
| リアルタイム同期 | Firestore（スケジュール用） |
| 認証 | Firebase Auth (Google OAuth) |
| バックエンド | Cloud Functions |
| AI | Vertex AI Gemini 2.5 Flash |
| モバイル | React Native + Expo |
| Web | Next.js |
| UIライブラリ | React Native Paper |
| カレンダー(Web) | @fullcalendar/react |
| カレンダー(Mobile) | react-native-big-calendar |

### UI設計

| 項目 | 決定 |
|------|------|
| UIライブラリ | React Native Paper（Material Design 3） |
| カラースキーム | 青系踏襲（Primary: #2196F3） |
| レスポンシブ | モバイルファースト → タブレット/デスクトップ拡張 |
| ナビゲーション | ボトム5タブ（記録/履歴/予定表/利用者/その他） |

### 開発方針（MVP）

| 項目 | 方針 |
|------|------|
| ブランチ戦略 | GitHub Flow（main + feature branch + PR） |
| 環境 | シンプルに1環境で開始 |
| Cloud SQL | 最小構成（db-f1-micro、約$10-15/月） |

## 次のステップ

### Phase 1: インフラ構築（P0）

| タスク | 状態 |
|--------|------|
| Firebase Data Connect 有効化 | 未着手 |
| Cloud SQL インスタンス作成 | 未着手 |
| PostgreSQL スキーマ適用 | 未着手 |
| Data Connect GraphQL スキーマ作成 | 未着手 |

### Phase 2: 開発環境（P0）

| タスク | 状態 |
|--------|------|
| React Native / Expo + React Native Paper セットアップ | 未着手 |
| Next.js セットアップ | 未着手 |
| CI/CD 設定（GitHub Actions） | ✅ 完了（基本設定） |

### Phase 3: MVP実装（P0）

| タスク | 状態 |
|--------|------|
| 認証機能（Google OAuth） | 未着手 |
| 記録入力画面 | 未着手 |
| 履歴一覧・詳細画面 | 未着手 |
| 利用者一覧・詳細画面 | 未着手 |
| スケジュール表示（週/日/月） | 未着手 |

## ドキュメント状態

| ドキュメント | 状態 |
|-------------|------|
| CLAUDE.md | ✅ AI駆動開発向け最適化完了 |
| architecture.md | ✅ 確定 |
| requirements.md | ✅ 詳細化完了 |
| data-model.md | ✅ 詳細化完了（13テーブル定義） |
| ADR-0001 (DB) | ✅ Accepted |
| ADR-0002 (移行) | ✅ Accepted |
| ui/design-guidelines.md | ✅ 完了 |
| ui/screens.md | ✅ 完了 |
| ui/schedule-feature.md | ✅ 完了 |
| legacy/appsheet-spec.md | ✅ 完了 |

## 参照ガイド

```
実装判断時: requirements.md
技術判断時: architecture.md → adr/
DB設計時:   data-model.md
画面実装時: ui/screens.md → ui/design-guidelines.md
スケジュール: ui/schedule-feature.md
現行仕様:   legacy/appsheet-spec.md
詳細カラム: docs/md/Application_Documentation.md
```

## Git状態

- リポジトリ: sanwaminamihonda-eng/sanwa-houkai-app
- ブランチ: main
- 最新コミット: 17223a8
- 状態: Clean（CI/CD設定追加待ち）
- CI/CD: `.github/workflows/ci.yml` 設定済み
