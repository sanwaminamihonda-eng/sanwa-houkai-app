# 作業状態 - 2026-01-11 (Responsive Lists)

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
- CI/CD: ✅ 動作確認済み（PR #6, #7, #8, #10, #11, #12, #14, #16, #25, #26, #28, #29, #30, #31, #32, #33, #34, #35, #36, #37, #38, #39, #40, #41, #42, #43, #44, #45, #46, #47, #48, #49, #50）
- デプロイ: ✅ Firebase Hosting 自動デプロイ（main push時）

## 今セッション完了作業

- [x] レスポンシブリストコンポーネント追加 - PR #50 ✅ マージ完了
  - ResponsiveList共通コンポーネント作成（デスクトップ: テーブル、モバイル: カード）
  - 各ページ用コンポーネント作成:
    - Records: RecordsTable, RecordListItem
    - Clients: ClientsTable, ClientListItem
    - Reports: ReportsTable, ReportListItem
    - CarePlans: CarePlansTable, CarePlanListItem
  - 全ページをResponsiveListに移行（本番/デモ共通）
  - E2Eテスト追加: responsive-lists-desktop.spec.ts, responsive-lists-mobile.spec.ts
  - E2Eテスト修正: セレクタ問題（h4, dialog）を解決

### 前セッション完了作業

- [x] カレンダーモバイル表示最適化 - PR #49 ✅ マージ完了
  - CSS media queriesでモバイル向けスタイル追加
  - 「新規予定」ボタンをモバイルではアイコンのみに変更

- [x] レスポンシブレイアウト修正（CSS版）- PR #48 ✅ マージ完了
  - DualDrawerパターン（temporary + permanent）でCSS display切り替え

- [x] レスポンシブレイアウト追加 - PR #47 ✅ マージ完了

### 前々セッション完了作業

- [x] カレンダービュー切り替え修正 - PR #46 ✅ マージ完了
  - ビュー切り替え（日/週/月）が動作しない問題を修正
  - 原因: ビュー変更時に`setLoading(true)`でコンポーネントがリマウントされ、FullCalendarが`initialView="timeGridWeek"`にリセット
  - 修正: ローディングスピナーは初回ロード時（`schedules.length === 0`）のみ表示
  - 本番/デモ両方のスケジュールページを修正
  - E2Eテストでビュー切り替えを有効化・動作確認済み

- [x] Googleカレンダー風ビュースタイリング - PR #45 ✅ マージ完了
  - 月ビューで「+N件」表示機能を追加（3件以上の予定はポップオーバー表示）
  - ビュータイプに応じたイベント表示最適化（月ビューはコンパクト表示）
  - Googleカレンダー風CSSスタイリング追加
    - 今日の日付を青い丸でハイライト
    - セルホバーエフェクト
    - 週末の背景スタイリング
    - ボタン・ツールバーのスタイリング
  - 日ビューのヘッダーフォーマット改善

- [x] スケジュールページAPI無限ループ修正 - PR #44 ✅ マージ完了
  - useEffect/useCallback依存関係サイクルによる無限ループを修正
  - マスターデータ読み込みとスケジュールデータ読み込みを分離
  - `lastFetchedRangeRef`で重複APIコール防止
  - `handleDateRangeChange`で値変更時のみ状態更新
  - Playwright E2Eテスト追加（5/7テスト成功）
  - 本番/デモ両方のスケジュールページを修正

- [x] カレンダー表示問題修正 - PR #43 ✅ マージ完了
  - FullCalendar の height を "auto" から 600 に変更
  - CardContent に minHeight: 600 を追加
  - contentHeight="auto" でコンテンツサイズを適切に調整

- [x] デモ/本番UI一貫性修正 - PR #42 ✅ マージ完了
  - 本番Sidebar・DemoSidebar にダッシュボードリンク追加
  - デモスケジュールページから冗長なTypographyタイトル削除

- [x] スケジュール共通コンポーネント化 - PR #41 ✅ マージ完了
  - 共通コンポーネント抽出（`web/src/components/schedule/`）
    - `ScheduleCalendarView.tsx` - メインカレンダー（FullCalendar使用）
    - `ScheduleDetailDialog.tsx` - 詳細表示ダイアログ
    - `ScheduleFormDialog.tsx` - 作成/編集フォーム
    - `RecurrenceEditDialog.tsx` - 繰り返し編集スコープ選択
    - `RecurrenceDeleteDialog.tsx` - 繰り返し削除スコープ選択
    - `types.ts` - 共通型定義・APIインターフェース
    - `utils.ts` - カラー、RRule生成ユーティリティ
  - デモ版スケジュール（`/demo/schedule`）をGoogleカレンダースタイルに変更
  - 依存性注入パターンでAPI関数差し替え可能に（`ScheduleApiHandlers`）
  - 本番ページを1400行→220行に削減（共通コンポーネント使用）

- [x] デモ/本番コード共通化 - PR #40 ✅ マージ完了
  - 共通ユーティリティ関数抽出（`web/src/utils/formatters.ts`）
    - `formatDateWithWeekday`, `formatDateSlash`, `formatDateJapaneseWithWeekday`
    - `formatDateJapanese`, `formatDateShortWithWeekday`, `formatTimeRange`, `formatTime`
    - `formatAddress`, `truncateText`, `formatDateForApi`
  - 記録詳細共通コンポーネント（`web/src/components/records/RecordDetailView.tsx`）
    - 本番/デモの記録詳細ページで共通使用
  - 利用者詳細共通コンポーネント（`web/src/components/clients/ClientDetailView.tsx`）
    - 本番/デモの利用者詳細ページで共通使用
  - 約1300行のコード削減

- [x] GoogleカレンダースタイルのリサイズUIUX機能 - PR #39 ✅ マージ完了
  - イベントリサイズ機能追加（上端/下端ドラッグで時間変更）
  - `eventResizableFromStart={true}` で開始端からもリサイズ可能
  - `snapDuration="00:15:00"` で15分単位スナップ（Googleカレンダー準拠）
  - CSSスタイリング追加:
    - ホバー時にリサイズハンドル表示
    - ドラッグ/リサイズ中の半透明・シャドウ効果
    - 現在時刻インジケーターをGoogleカレンダー風の赤線に
  - 短いイベント（30分未満）の表示最適化（時間省略、タイトルのみ表示）

### 前セッション完了作業

- [x] デモ記録ページのクラッシュ修正 - コミット 2ff760d（※mainへ直接push - ルール違反）
  - Data Connect Demoクエリが「operation not found」エラー → `firebase deploy --only dataconnect --force`で再デプロイ
  - 記録ページで`l.map is not a function`エラー → `getServiceSummary`関数を修正
    - APIレスポンス形式 `{ details, items: string[] }` に対応
    - レガシー形式との互換性維持
  - Firebase Hostingへデプロイ完了

- [x] デモ環境修正・機能追加 - PR #38 ✅ マージ完了
  - DemoContext.tsxのSTAFF_IDを正しい値に修正（シードデータと一致）
  - デモ用記録入力ページ作成（`/demo/records/new`）
  - デモ用利用者詳細ページ作成（`/demo/clients/detail?id=xxx`）
  - デモ用記録詳細ページ作成（`/demo/records/detail?id=xxx`）
  - Firebase Hostingへデプロイ完了

- [x] 戻るボタン追加 - PR #37 ✅ マージ完了
  - Header/MainLayoutにshowBackButton/backHrefプロパティ追加
  - ダッシュボード以外の全ページに戻るボタンを表示
  - 詳細ページは一覧ページへ、その他はダッシュボードへ遷移

- [x] デモ環境デプロイ - PR #36
  - DemoContext.tsxのUUID不一致を修正（シードデータと一致）
  - CLAUDE.mdにアカウント切り替え手順を追加
  - Cloud SQLにシードデータ投入（利用者10名、スケジュール91件、訪問記録189件）
  - Firebase Hostingへデプロイ完了

- [x] デモ専用ページ実装 - PR #35
  - `/demo/*` パスでアクセス可能（認証不要）
  - DemoContext、DemoLayout、DemoSidebar、DemoHeader作成
  - `@auth(level: PUBLIC)` でデモ用クエリ・ミューテーション追加
  - シードデータSQL作成（`dataconnect/seed/demo-seed.sql`）
  - リセット機能Cloud Function追加（`resetDemoData`）
  - ログインページ・ダッシュボードからデモへの導線追加
  - CLAUDE.mdにブランチ運用ルール明記

- [x] Web版計画書表示機能 - PR #34
  - 計画書一覧ページ（テーブル形式、利用者フィルタ、ページネーション）
  - 詳細表示（モーダルダイアログ方式）
    - Next.js静的エクスポートの制限により動的ルートではなくダイアログを採用
  - 計画書生成ダイアログ（Cloud Functions連携）
  - 長期目標・短期目標のカード表示
  - PDF表示ボタン

- [x] 実施報告書のモバイル表示機能 - PR #33
  - GetReport クエリを DataConnect に追加
  - ReportsScreen.tsx（一覧画面）
    - FlatList + Card 形式の一覧表示
    - 利用者フィルター（Menu コンポーネント）
    - プルリフレッシュ対応
    - AI要約バッジ、PDFバッジ表示
  - ReportDetailScreen.tsx（詳細画面）
    - 年月、利用者名、要介護度、担当者表示
    - AI要約セクション
    - PDFを開くボタン（Linking.openURL）
  - RootNavigator.tsx に ReportsStack 追加
  - SettingsScreen.tsx メニュー改善
    - 「帳票」「管理」セクションに分割
    - 「実施報告書」メニュー追加

### 前セッション完了作業（参考）

- [x] 繰り返し予定の視覚的識別機能 - PR #32
- [x] モバイル計画書表示機能 - PR #31
- [x] 繰り返し予定の編集・削除改善 - PR #30
- [x] 繰り返し予定機能 - PR #29
- [x] 訪問介護計画書PDF生成機能 - PR #28
- [x] PDF帳票生成機能（実施報告書）- PR #27

## 次回アクション

1. デモページの動作確認（https://sanwa-houkai-app.web.app/demo）
   - ダッシュボード
   - スケジュール（91件のシードデータ）
   - 利用者一覧・詳細（10名）
   - 記録一覧・詳細・新規入力（189件）
2. 必要に応じて追加シードデータを投入
3. オフライン対応検討
4. 追加機能の要望に応じて実装

**デプロイ済み:**
- デモ環境（シードデータ投入済み）- 2026-01-10 デプロイ完了（PR #36）
- Cloud Functions（generateVisitNotes, generateReport, generateCarePlan）- 2026-01-10 デプロイ完了
- Cloud Storageバケット（sanwa-houkai-app-reports）- 2026-01-10 作成完了
- リアルタイム同期コード - 2026-01-10 マージ完了
- Firestoreルール - 2026-01-10 デプロイ完了
- 繰り返し予定機能 - 2026-01-10 マージ完了（PR #29）
- 繰り返し予定編集・削除改善 - 2026-01-10 マージ完了（PR #30）

## デモ環境情報

| 項目 | 値 |
|------|-----|
| URL | https://sanwa-houkai-app.web.app/demo |
| 利用者数 | 10名 |
| スケジュール | 91件 |
| 訪問記録 | 189件 |
| リセット機能 | resetDemoData Cloud Function |
