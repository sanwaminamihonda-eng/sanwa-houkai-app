# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

**訪問介護サービスの記録・管理アプリ**（モバイル + Web）

現行AppSheet + Google Sheetsシステムを、Firebase + React Native/Next.jsへ移行するプロジェクト。

### システム全体像

```
┌─────────────────────────────────────────────────────────────┐
│                     訪問介護記録アプリ                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ 利用者管理    │  │ 職員管理     │  │ スケジュール管理  │  │
│  │ (clients)    │  │ (staff)      │  │ (schedules)      │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│           ↓                ↓                 ↓              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              訪問介護記録 (visit_records)            │   │
│  │  訪問日時/利用者/支援者/バイタル/サービス内容/特記事項  │   │
│  └─────────────────────────────────────────────────────┘   │
│                            ↓                                │
│  ┌──────────────────┐  ┌──────────────────────────────┐   │
│  │ PDF帳票出力       │  │ AI文章生成                   │   │
│  │ ・実施報告書      │  │ ・特記事項自動生成           │   │
│  │ ・訪問介護計画書  │  │ ・月次AI要約                 │   │
│  └──────────────────┘  └──────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 環境設定

| 項目 | 値 |
|------|-----|
| GitHub | sanwaminamihonda-eng / sanwa-houkai-app |
| GCP | sanwaminamihonda@gmail.com / sanwa-houkai-app |
| Firebase | sanwa-houkai-app |

**自動切り替え**: direnv（.envrc）でディレクトリ移動時に環境が自動設定される

## 技術スタック

| レイヤー | 技術 | 備考 |
|---------|------|------|
| **DB** | Firebase Data Connect (Cloud SQL PostgreSQL) | マスターDB |
| **リアルタイム同期** | Firestore | スケジュール変更通知用 |
| **認証** | Firebase Auth | Google OAuth / Email+PW |
| **ホスティング** | Firebase Hosting | Preview Channels対応 |
| **バックエンド** | Cloud Functions | PDF生成、AI連携 |
| **AI** | Vertex AI Gemini 2.5 Flash | asia-northeast1 |
| **モバイル** | React Native + Expo | iOS/Android |
| **Web** | Next.js | 管理画面 |
| **UIライブラリ** | React Native Paper | Material Design 3 |
| **カレンダー(Web)** | @fullcalendar/react | D&D対応 |
| **カレンダー(Mobile)** | react-native-big-calendar | 週表示対応 |

## ドキュメント構成

```
docs/
├── README.md                    # 目次・クイックリファレンス
├── architecture.md              # アーキテクチャ詳細
├── requirements.md              # 要件定義・優先度
├── data-model.md                # データモデル・ER図・スキーマ
├── adr/                         # Architecture Decision Records
│   ├── 0001-database-architecture.md
│   └── 0002-appsheet-migration.md
├── handoff/LATEST.md            # 作業状態（セッション継続用）
├── ui/
│   ├── design-guidelines.md     # カラー・タイポグラフィ・UIライブラリ
│   ├── screens.md               # 画面別仕様・ワイヤーフレーム
│   └── schedule-feature.md      # スケジュール管理機能仕様
└── legacy/
    └── appsheet-spec.md         # 現行AppSheet仕様（移行マッピング）
```

## 実装ガイド

### 参照すべきドキュメント（タスク別）

| タスク | 参照ドキュメント |
|--------|-----------------|
| DB設計・スキーマ変更 | `data-model.md` → `legacy/appsheet-spec.md` |
| 画面実装 | `ui/screens.md` → `ui/design-guidelines.md` |
| スケジュール機能 | `ui/schedule-feature.md` |
| ビジネスロジック | `legacy/appsheet-spec.md` |
| 技術判断 | `architecture.md` → `adr/` |
| 現行仕様の詳細 | `docs/md/Application_Documentation.md` |

### 主要エンティティと画面の対応

| エンティティ | 画面 | 主要操作 |
|-------------|------|---------|
| visit_records | 記録入力、履歴一覧、履歴詳細 | CRUD、AI生成 |
| clients | 利用者一覧、利用者詳細 | CRUD、電話発信、地図 |
| staff | 支援者管理 | CRUD |
| schedules | スケジュール管理 | CRUD、D&D、リアルタイム同期 |
| reports | 報告書一覧 | PDF生成、AI要約 |
| care_plans | 計画書一覧 | PDF生成 |

### 実装優先度

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
└── オフライン対応検討
```

## 重要な設計判断

| 決定事項 | 理由 | 参照 |
|---------|------|------|
| オフライン非対応 | 同期問題・バージョン問題を回避 | [ADR-0001](./docs/adr/0001-database-architecture.md) |
| AppSheet機能踏襲 | 現場運用を継承しつつ制限解消 | [ADR-0002](./docs/adr/0002-appsheet-migration.md) |
| GCP統一 | 認証・DB・AI全てGCP/Firebase | architecture.md |
| React Native Paper | Material Design 3、Expo対応 | ui/design-guidelines.md |
| Cloud SQL最小構成 | コスト最適化（$10-15/月） | handoff/LATEST.md |

## 開発ルール

1. **設計変更時**: docs/ を更新
2. **重要決定時**: ADR を作成（docs/adr/）
3. **セッション終了時**: handoff/LATEST.md を更新
4. **コミット**: 作業単位を小さく、こまめに
5. **mainへ直接push禁止**: 全ての変更（ドキュメント更新含む）は featureブランチ → PR → マージ

### ブランチ運用（必須）

```
# 全ての変更は以下のフローで行う（例外なし）
git checkout -b feature/xxx  # または docs/xxx, fix/xxx
# ... 作業 ...
git add -A && git commit -m "メッセージ"
git push -u origin feature/xxx
gh pr create --title "タイトル" --body "説明"
gh pr merge N --squash --delete-branch
git checkout main && git pull
```

**禁止事項:**
- `git push origin main` の直接実行
- mainブランチでの直接コミット
- ドキュメントのみの変更でもPRをスキップすること

## 開発コマンド

```bash
# 環境ロード確認
direnv allow

# Firebase CLI
firebase login
firebase projects:list
firebase deploy

# GCP CLI
gcloud auth list
gcloud config list
```

※ビルド・テストコマンドは開発環境構築後に追加

## 作業再開時

1. `docs/handoff/LATEST.md` を読む
2. 未完了タスクを確認
3. 必要に応じて関連ドキュメントを参照

## 現在のフェーズ

**開発環境セットアップ完了** → **MVP実装**

完了済み:
- [x] Firebase Data Connect 有効化・デプロイ
- [x] React Native / Expo + React Native Paper セットアップ（mobile/）
- [x] Next.js + Material UI セットアップ（web/）
- [x] Cloud SQL インスタンス作成（sanwa-houkai-db）
- [x] GraphQL スキーマ定義（13テーブル）
- [x] CI/CD 設定（GitHub Actions）
- [x] Data Connect SDK 生成・統合（モバイル/Web両対応）
- [x] Firebase Auth（Google OAuth）実装・Console設定完了
- [x] 記録入力画面の実装（モバイル/Web両対応）
- [x] 履歴一覧・詳細画面の実装（モバイル/Web両対応）
- [x] Firebase Hosting デプロイ設定・稼働確認（https://sanwa-houkai-app.web.app）
- [x] 利用者一覧・詳細画面の実装（モバイル/Web両対応）
- [x] スケジュール画面の実装（FullCalendar / react-native-big-calendar）
- [x] スケジュール新規作成・編集画面の実装（モバイル）

次のステップ:
1. リアルタイム同期（Firestore連携）
2. AI特記事項生成機能
3. Web版スケジュール新規作成・編集画面
