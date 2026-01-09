# 作業状態 - 2025-01-09

## プロジェクト概要

AppSheet + Google Sheetsで運用中の訪問介護記録アプリを、Firebase Data Connect + React Native/Next.jsへ移行するプロジェクト。

### 現行システム

| 項目 | 値 |
|------|-----|
| プラットフォーム | AppSheet + Google Sheets |
| ユーザー数 | 約30人 |
| 記録数 | 約2万レコード |
| 状態 | 稼働中（並行運用予定） |

### 移行方針

- MVP段階はseedデータで開発
- 本番データ移行は別途計画
- 機能的な考え方は継承、制限は解消

## 完了タスク

- [x] アーキテクチャ設計確定
- [x] DB選定: Firebase Data Connect (PostgreSQL)
- [x] オフライン非対応の決定（ADR-0001）
- [x] AppSheet移行方針の決定（ADR-0002）
- [x] ドキュメント構成整備
- [x] GitHub リポジトリ作成
- [x] GCP/Firebase プロジェクト作成
- [x] direnv 環境自動切り替え設定
- [x] requirements.md 詳細化（優先度、AI駆動開発指針）

## 次のステップ

### Phase 1: インフラ構築

| タスク | 優先度 | 状態 |
|--------|--------|------|
| Firebase Data Connect 有効化 | P0 | 未着手 |
| Cloud SQL インスタンス作成 | P0 | 未着手 |
| PostgreSQL スキーマ確定 | P0 | 未着手 |
| Data Connect GraphQL スキーマ作成 | P0 | 未着手 |

### Phase 2: 開発環境

| タスク | 優先度 | 状態 |
|--------|--------|------|
| React Native / Expo セットアップ | P0 | 未着手 |
| Next.js セットアップ | P0 | 未着手 |
| CI/CD 設定（GitHub Actions） | P1 | 未着手 |

### Phase 3: MVP実装

| タスク | 優先度 | 状態 |
|--------|--------|------|
| 認証機能（Google OAuth） | P0 | 未着手 |
| 訪問記録CRUD | P0 | 未着手 |
| スケジュール表示・管理 | P0 | 未着手 |
| 利用者/職員管理 | P0 | 未着手 |

## 未決定事項

| 項目 | 影響範囲 | 決定期限 |
|------|---------|---------|
| バイタル情報の具体的な項目 | data-model.md | MVP設計時 |
| サービス種類マスタの初期データ | seedデータ | DB設計時 |
| 画面デザイン詳細 | UI実装 | UI実装前 |

## ドキュメント状態

| ドキュメント | 状態 | 最終更新 |
|-------------|------|---------|
| CLAUDE.md | ✅ 完了 | 2025-01-09 |
| architecture.md | ✅ 確定 | 初期 |
| requirements.md | ✅ 詳細化完了 | 2025-01-09 |
| data-model.md | 📝 概要のみ | 初期 |
| ADR-0001 (DB) | ✅ Accepted | 初期 |
| ADR-0002 (移行) | ✅ Accepted | 2025-01-09 |

## 参照すべきドキュメント

```
実装判断時: requirements.md → 優先度とAI駆動開発指針
技術判断時: architecture.md → 技術スタック制約
移行方針: adr/0002-appsheet-migration.md → 課題と解決策
DB設計時: adr/0001-database-architecture.md → オフライン非対応理由
```

## Git状態

- リポジトリ: sanwaminamihonda-eng/sanwa-houkai-app
- ブランチ: main
- 状態: 要コミット（ADR-0002、requirements.md更新）
