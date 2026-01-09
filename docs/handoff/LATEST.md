# 作業状態 - 2026-01-10 (Recurring Schedule Visual Indicator)

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

### Data Connect SDK統合
- [x] connector.yaml をモバイル/Web両方に出力する設定に修正
- [x] `firebase dataconnect:sdk:generate` でSDK生成
- [x] モバイルアプリ（Expo）へのSDK統合
  - mobile/src/lib/firebase.ts 作成
  - mobile/.env.example 作成
- [x] Webアプリ（Next.js）へのSDK統合
  - web/src/lib/firebase.ts にData Connect初期化追加
- [x] 両アプリでビルド成功確認
- [x] PR #8 マージ完了

### Firebase Auth（Google OAuth）実装
- [x] モバイルアプリ認証機能
  - expo-auth-session / expo-web-browser / expo-crypto パッケージ追加
  - mobile/src/lib/firebase.ts にAuth初期化追加
  - mobile/src/contexts/AuthContext.tsx 作成（認証状態管理）
  - mobile/src/screens/auth/LoginScreen.tsx 作成（ログイン画面）
  - mobile/src/navigation/RootNavigator.tsx 認証分岐追加
  - mobile/App.tsx AuthProviderでラップ
  - mobile/src/screens/settings/SettingsScreen.tsx ログアウト機能追加
  - mobile/app.json にscheme追加（sanwa-houkai）
  - mobile/.env.example にGoogle Client ID追加
- [x] Webアプリ認証機能
  - web/src/contexts/AuthContext.tsx 作成（認証状態管理）
  - web/src/app/login/page.tsx 作成（ログインページ）
  - web/src/components/AuthGuard.tsx 作成（認証ガード）
  - web/src/components/ThemeRegistry.tsx AuthProviderでラップ
  - web/src/components/layout/MainLayout.tsx AuthGuardでラップ
  - web/src/components/layout/Header.tsx ログアウト機能実装

### 記録入力画面実装
- [x] モバイル記録入力画面
  - mobile/src/hooks/useStaff.ts 作成（スタッフ情報取得フック）
  - mobile/src/screens/records/RecordInputScreen.tsx 実装
    - 利用者選択（Picker）
    - 訪問日/時間選択（DateTimePicker）
    - 訪問理由選択
    - バイタル入力（脈拍、血圧高/低）
    - サービス内容選択（Chip形式、カテゴリ別）
    - 特記事項テキスト入力
    - Data Connect経由でDB保存
  - @react-native-community/datetimepicker パッケージ追加
  - @react-native-picker/picker パッケージ追加
- [x] Web記録入力画面
  - web/src/hooks/useStaff.ts 作成（スタッフ情報取得フック）
  - web/src/app/records/new/page.tsx 実装
    - MUI Select / DatePicker / TimePicker使用
    - サービス内容選択（Chip形式）
    - Snackbar通知
  - @mui/x-date-pickers パッケージ追加
  - date-fns パッケージ追加
- [x] .gitignore に .serena/ 追加
- [x] web/eslint.config.mjs に generated/ 無視追加

### 履歴一覧・詳細画面実装（今回完了）
- [x] モバイル履歴一覧画面
  - mobile/src/screens/records/RecordHistoryScreen.tsx 実装
    - FlatListでカード形式の一覧表示
    - 直近30日の記録を取得（listVisitRecordsByDateRange API）
    - 利用者フィルター（Menuコンポーネント）
    - プルリフレッシュ対応
    - タップで詳細画面へ遷移
- [x] モバイル履歴詳細画面
  - mobile/src/screens/records/RecordDetailScreen.tsx 新規作成
    - 基本情報（利用者名、訪問日時、担当者、訪問理由）
    - バイタル表示（脈拍、血圧）
    - サービス内容表示（カテゴリ別Chip）
    - 特記事項（AI生成フラグ付き）
    - 満足度、状態変化、サービス変更必要性
    - 作成/更新日時
- [x] モバイルナビゲーション更新
  - mobile/src/navigation/RootNavigator.tsx 更新
    - RecordHistoryStackParamList 型定義追加
    - RecordHistoryNavigator スタックナビゲーション追加
    - 履歴タブから詳細画面への遷移対応
- [x] Web履歴一覧画面
  - web/src/app/records/page.tsx 実装
    - MUI Tableでテーブル形式の一覧表示
    - TablePaginationでページネーション対応
    - 利用者フィルター（Select）
    - 行クリックで詳細画面へ遷移
- [x] Web履歴詳細画面
  - web/src/app/records/[id]/page.tsx 新規作成
    - MUI Grid レイアウト
    - Card形式でセクション分け
    - 一覧への戻るボタン
- [x] PR #10 マージ完了

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
| 認証機能（Google OAuth） | ✅ 完了（コード実装・Console設定完了） |
| 記録入力画面 | ✅ 完了（モバイル/Web両対応） |
| 履歴一覧・詳細画面 | ✅ 完了（モバイル/Web両対応） |
| Firebase Hosting デプロイ | ✅ 完了（https://sanwa-houkai-app.web.app） |
| 利用者一覧・詳細画面 | ✅ 完了（モバイル/Web両対応） |
| スケジュール表示（週/日/月） | ✅ 完了（モバイル/Web両対応） |
| AI特記事項生成 | ✅ 完了（Cloud Functions + Vertex AI Gemini） |
| リアルタイム同期 | ✅ 完了（Firestore + onSnapshot） |

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
├── App.tsx                 # エントリーポイント（AuthProvider設定）
├── app.json                # Expo設定（scheme: sanwa-houkai）
├── .env.example            # Firebase + Google OAuth環境変数テンプレート
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx # 認証状態管理
│   ├── generated/
│   │   └── dataconnect/    # Data Connect生成SDK
│   ├── lib/
│   │   └── firebase.ts     # Firebase/Auth/Data Connect初期化
│   ├── navigation/
│   │   └── RootNavigator.tsx   # 認証分岐 + 5タブ + スタックナビゲーション
│   ├── screens/
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx     # ログイン画面
│   │   ├── records/
│   │   │   ├── RecordInputScreen.tsx
│   │   │   └── RecordHistoryScreen.tsx
│   │   ├── schedule/
│   │   │   └── ScheduleScreen.tsx
│   │   ├── clients/
│   │   │   ├── ClientListScreen.tsx   # 利用者一覧（検索、電話発信）
│   │   │   └── ClientDetailScreen.tsx # 利用者詳細
│   │   └── settings/
│   │       └── SettingsScreen.tsx  # ログアウト機能付き
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
│   │   ├── login/page.tsx         # ログインページ
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
│   │   │   ├── MainLayout.tsx     # メインレイアウト（AuthGuard付き）
│   │   │   ├── Sidebar.tsx        # サイドナビゲーション
│   │   │   └── Header.tsx         # ヘッダー（ログアウト機能付き）
│   │   ├── AuthGuard.tsx          # 認証ガード
│   │   └── ThemeRegistry.tsx      # MUIテーマ + AuthProvider
│   ├── contexts/
│   │   └── AuthContext.tsx        # 認証状態管理
│   ├── generated/
│   │   └── dataconnect/           # Data Connect生成SDK
│   ├── lib/
│   │   └── firebase.ts            # Firebase/Auth/Data Connect設定
│   └── theme/
│       └── index.ts               # MUIカスタムテーマ
└── .env.example                   # 環境変数テンプレート
```

## Git状態

- リポジトリ: sanwaminamihonda-eng/sanwa-houkai-app
- ブランチ: main
- 状態: clean
- CI/CD: ✅ 動作確認済み（PR #6, #7, #8, #10, #11, #12, #14, #16, #25, #26, #28, #29, #30, #31, #32）
- デプロイ: ✅ Firebase Hosting 自動デプロイ（main push時）

## 今セッション完了作業

- [x] 繰り返し予定の視覚的識別機能 - PR #32
  - Web（FullCalendar）
    - カレンダーイベントにリピートアイコン（RepeatIcon）を表示
    - eventContentでカスタムレンダリング
    - 詳細ダイアログに「繰り返し予定」表示を追加
  - Mobile（react-native-big-calendar）
    - カレンダーイベントタイトルに🔄マークを追加
    - 詳細モーダルに「繰り返し予定」表示を追加
  - 繰り返し予定と通常予定を視覚的に区別可能に

### 前セッション完了作業（参考）

- [x] モバイル計画書表示機能 - PR #31
- [x] 繰り返し予定の編集・削除改善 - PR #30
- [x] 繰り返し予定機能 - PR #29
- [x] 訪問介護計画書PDF生成機能 - PR #28
- [x] PDF帳票生成機能（実施報告書）- PR #27
- [x] Cloud Storageバケット作成（sanwa-houkai-app-reports）
- [x] Firestoreルールデプロイ（リアルタイム同期有効化）
- [x] スケジュールリアルタイム同期機能 - PR #26
- [x] AI特記事項生成機能 - PR #25

## 次回アクション

1. 実施報告書のモバイル表示機能
2. オフライン対応検討
3. Web計画書表示機能

**デプロイ済み:**
- Cloud Functions（generateVisitNotes, generateReport, generateCarePlan）- 2026-01-10 デプロイ完了
- Cloud Storageバケット（sanwa-houkai-app-reports）- 2026-01-10 作成完了
- リアルタイム同期コード - 2026-01-10 マージ完了
- Firestoreルール - 2026-01-10 デプロイ完了
- 繰り返し予定機能 - 2026-01-10 マージ完了（PR #29）
- 繰り返し予定編集・削除改善 - 2026-01-10 マージ完了（PR #30）
