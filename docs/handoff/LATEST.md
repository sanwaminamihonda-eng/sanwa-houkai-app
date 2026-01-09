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

**開発環境セットアップ** → **MVP実装**

## 完了タスク

### 初期セットアップ
- [x] アーキテクチャ設計確定
- [x] DB選定: Firebase Data Connect (PostgreSQL)
- [x] オフライン非対応の決定（ADR-0001）
- [x] AppSheet移行方針の決定（ADR-0002）
- [x] GitHub リポジトリ作成
- [x] GCP/Firebase プロジェクト作成
- [x] direnv 環境自動切り替え設定

### ドキュメント整備
- [x] AppSheetドキュメントをMarkdownに変換（docs/md/）
- [x] 現行システム仕様書作成（docs/legacy/appsheet-spec.md）
- [x] UI設計ガイドライン作成（docs/ui/design-guidelines.md）
- [x] 画面仕様書作成（docs/ui/screens.md）
- [x] スケジュール管理機能仕様作成（docs/ui/schedule-feature.md）
- [x] データモデル詳細化（docs/data-model.md）
- [x] CLAUDE.md AI駆動開発向け最適化
- [x] docs/README.md 整理

### Firebase Data Connect セットアップ
- [x] Firebase プロジェクト初期化（firebase.json）
- [x] Data Connect 設定（dataconnect/dataconnect.yaml）
- [x] GraphQL スキーマ定義（dataconnect/schema/schema.gql）
  - 13テーブル: CareLevel, VisitReason, GoalTemplate, Prompt, Facility, ServiceType, ServiceItem, Staff, Client, Schedule, VisitRecord, Report, CarePlan
- [x] クエリ・ミューテーション定義
  - dataconnect/connector/queries.gql
  - dataconnect/connector/mutations.gql
- [x] GCP課金アカウントリンク
- [x] Cloud SQL インスタンス作成（sanwa-houkai-db, db-f1-micro, asia-northeast1）
- [x] Data Connect サービスデプロイ

### モバイルアプリセットアップ
- [x] Expo + TypeScript プロジェクト作成（mobile/）
- [x] React Native Paper (Material Design 3) テーマ設定
- [x] Firebase / React Navigation パッケージインストール
- [x] 5タブ構成のボトムナビゲーション設定
  - 記録 / 履歴 / 予定表 / 利用者 / その他
- [x] 各画面のプレースホルダー実装
- [x] PR #6 マージ完了

### Web管理画面セットアップ
- [x] Next.js 16 + TypeScript + TailwindCSS プロジェクト作成（web/）
- [x] Material UI v7 カスタムテーマ設定（モバイルとカラー統一）
- [x] Firebase SDK 設定（環境変数テンプレート付き）
- [x] サイドナビゲーション付きレイアウト（デスクトップ向け）
- [x] ダッシュボード画面（クイックアクション + 統計サマリー）
- [x] 各画面プレースホルダー実装
  - 記録入力 / 履歴一覧 / スケジュール / 利用者 / 支援者 / 帳票 / 設定
- [x] FullCalendar パッケージインストール済み
- [x] PR #7 マージ完了

### Data Connect SDK統合（今回完了）
- [x] connector.yaml をモバイル/Web両方に出力する設定に修正
- [x] `firebase dataconnect:sdk:generate` でSDK生成
- [x] モバイルアプリ（Expo）へのSDK統合
  - mobile/src/lib/firebase.ts 作成
  - mobile/.env.example 作成
- [x] Webアプリ（Next.js）へのSDK統合
  - web/src/lib/firebase.ts にData Connect初期化追加
- [x] 両アプリでビルド成功確認
- [x] PR #8 マージ完了

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

### Phase 1: インフラ構築（P0） ✅ 完了

| タスク | 状態 |
|--------|------|
| Firebase Data Connect 有効化 | ✅ 完了 |
| Cloud SQL インスタンス作成 | ✅ 完了 |
| PostgreSQL スキーマ適用 | ✅ 完了（自動） |
| Data Connect GraphQL スキーマ作成 | ✅ 完了 |

### Phase 2: 開発環境（P0） ✅ 完了

| タスク | 状態 |
|--------|------|
| React Native / Expo + React Native Paper セットアップ | ✅ 完了 |
| Next.js + Material UI セットアップ | ✅ 完了 |
| CI/CD 設定（GitHub Actions） | ✅ 完了（基本設定） |

### Phase 3: MVP実装（P0）

| タスク | 状態 |
|--------|------|
| Data Connect SDK生成・統合 | ✅ 完了 |
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

## インフラ情報

### Firebase Data Connect

| 項目 | 値 |
|------|-----|
| Service ID | sanwa-houkai-service |
| Location | asia-northeast1 |
| Connector ID | default |

### Cloud SQL

| 項目 | 値 |
|------|-----|
| Instance | sanwa-houkai-db |
| Database | fdcdb |
| Version | PostgreSQL 15 |
| Tier | db-f1-micro |
| Region | asia-northeast1-b |

## モバイルアプリ構成

```
mobile/
├── App.tsx                 # エントリーポイント（Provider設定）
├── app.json                # Expo設定
├── .env.example            # Firebase環境変数テンプレート
├── src/
│   ├── generated/
│   │   └── dataconnect/    # Data Connect生成SDK
│   ├── lib/
│   │   └── firebase.ts     # Firebase/Data Connect初期化
│   ├── navigation/
│   │   └── RootNavigator.tsx   # 5タブナビゲーション
│   ├── screens/
│   │   ├── records/
│   │   │   ├── RecordInputScreen.tsx
│   │   │   └── RecordHistoryScreen.tsx
│   │   ├── schedule/
│   │   │   └── ScheduleScreen.tsx
│   │   ├── clients/
│   │   │   └── ClientListScreen.tsx
│   │   └── settings/
│   │       └── SettingsScreen.tsx
│   └── theme/
│       └── index.ts        # Material Design 3テーマ
```

## Web管理画面構成

```
web/
├── src/
│   ├── app/
│   │   ├── page.tsx               # ダッシュボード
│   │   ├── layout.tsx             # ルートレイアウト
│   │   ├── records/
│   │   │   ├── page.tsx           # 履歴一覧
│   │   │   └── new/page.tsx       # 記録入力
│   │   ├── schedule/page.tsx      # スケジュール
│   │   ├── clients/page.tsx       # 利用者管理
│   │   ├── staff/page.tsx         # 支援者管理
│   │   ├── reports/page.tsx       # 帳票・報告
│   │   └── settings/page.tsx      # 設定
│   ├── components/
│   │   ├── layout/
│   │   │   ├── MainLayout.tsx     # メインレイアウト
│   │   │   ├── Sidebar.tsx        # サイドナビゲーション
│   │   │   └── Header.tsx         # ヘッダー
│   │   └── ThemeRegistry.tsx      # MUIテーマプロバイダー
│   ├── generated/
│   │   └── dataconnect/           # Data Connect生成SDK
│   ├── lib/
│   │   └── firebase.ts            # Firebase/Data Connect設定
│   └── theme/
│       └── index.ts               # MUIカスタムテーマ
└── .env.example                   # 環境変数テンプレート
```

## Git状態

- リポジトリ: sanwaminamihonda-eng/sanwa-houkai-app
- ブランチ: main
- 状態: clean
- CI/CD: ✅ 動作確認済み（PR #6, #7, #8）

## 今セッション完了作業

- [x] Data Connect SDK生成・統合
  - connector.yaml をモバイル/Web両方へ出力設定
  - `firebase dataconnect:sdk:generate` でSDK生成
  - 13テーブルの型安全なクエリ・ミューテーション利用可能
  - モバイル: mobile/src/lib/firebase.ts, mobile/.env.example
  - Web: web/src/lib/firebase.ts にData Connect初期化追加
- [x] PR #8 作成・レビュー・マージ

## 次回アクション

1. 認証機能（Firebase Auth）実装
2. 記録入力画面の実装
3. スケジュール画面（FullCalendar統合）
4. 履歴一覧・詳細画面
