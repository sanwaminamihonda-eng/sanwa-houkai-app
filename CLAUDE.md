# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

訪問介護サービスの記録・管理アプリ（モバイル + Web）

## 環境設定

| 項目 | 値 |
|------|-----|
| GitHub | sanwaminamihonda-eng / sanwa-houkai-app |
| GCP | sanwaminamihonda@gmail.com / sanwa-houkai-app |
| Firebase | sanwa-houkai-app |

**自動切り替え**: direnv（.envrc）でディレクトリ移動時に環境が自動設定される

## 技術スタック

| 項目 | 技術 |
|------|------|
| DB | Firebase Data Connect (Cloud SQL PostgreSQL) |
| 認証 | Firebase Auth (Google OAuth / Email+PW) |
| ホスティング | Firebase Hosting |
| バックエンド | Cloud Functions |
| AI | Vertex AI Gemini 2.5 Flash (asia-northeast1) |
| モバイル | React Native + Expo |
| Web | Next.js |

## 重要な設計判断

- **AppSheet移行**: 現行AppSheetの制限を解消（[ADR-0002](./docs/adr/0002-appsheet-migration.md)）
- **オフライン非対応**: 同期問題・バージョン問題を回避（[ADR-0001](./docs/adr/0001-database-architecture.md)）
- **GCP統一**: 認証・DB・AI全てGCP/Firebase
- **シングルDB**: PostgreSQL一本

## ドキュメント構成

```
docs/
├── README.md           # 目次・クイックリファレンス
├── architecture.md     # アーキテクチャ詳細
├── requirements.md     # 要件定義
├── data-model.md       # データモデル・ER図
├── adr/                # Architecture Decision Records
└── handoff/LATEST.md   # 作業状態（セッション継続用）
```

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

## 開発ルール

1. **設計変更時**: docs/ を更新
2. **重要決定時**: ADR を作成（docs/adr/）
3. **セッション終了時**: handoff/LATEST.md を更新
4. **コミット**: 作業単位を小さく、こまめに
5. **mainへ直接push禁止**: featureブランチ → PR → レビュー → マージ

## 作業再開時

1. `docs/handoff/LATEST.md` を読む
2. 未完了タスクを確認
3. 必要に応じて関連ドキュメントを参照

## 現在のフェーズ

**設計フェーズ** - コード実装前

次のステップ:
1. Firebase Data Connect 有効化
2. PostgreSQL スキーマ確定
3. React Native / Expo セットアップ
4. Next.js セットアップ
5. CI/CD 設定（GitHub Actions）
