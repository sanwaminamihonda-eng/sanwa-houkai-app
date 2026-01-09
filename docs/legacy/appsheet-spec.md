# AppSheet 現行システム仕様書

移行元システム（AppSheet + Google Sheets）の仕様。新システム設計時の参照用。

## システム概要

| 項目 | 値 |
|------|-----|
| アプリ名 | 訪問介護記録 App |
| プラットフォーム | AppSheet + Google Sheets |
| テーブル数 | 36（うちプロセス系15） |
| カラム数 | 639 |
| ビュー数 | 63 |
| アクション数 | 92 |

## データモデル

### コアテーブル（移行対象）

#### 訪問介護記録（中核）
訪問ごとの記録。新システムの `visit_records` に対応。

| カラム | 型 | 説明 | 移行先 |
|--------|-----|------|--------|
| 訪問介護記録ID | Key | PK（自動採番） | id |
| 利用者名 | Ref | 利用者リストへの参照 | client_id |
| 訪問日 | Date | 訪問実施日 | visit_date |
| 訪問理由 | Ref | 訪問理由マスタ参照 | visit_reason |
| 支援者 | Ref | 支援者マスタ参照 | staff_id |
| 開始時間（時/分） | Number | 開始時刻 | start_time |
| 終了時間（時/分） | Number | 終了時刻 | end_time |
| 脈拍 | Number | バイタル | vitals.pulse |
| 最高血圧 | Number | バイタル | vitals.bp_high |
| 最低血圧 | Number | バイタル | vitals.bp_low |
| 身体介護 | EnumList | 実施内容（複数選択） | services.physical |
| 自立支援 | EnumList | 実施内容（複数選択） | services.independence |
| 生活援助 | EnumList | 実施内容（複数選択） | services.daily_life |
| AI利用 | Boolean | AI文章生成使用フラグ | - |
| AI用文章入力 | Text | AI生成用の入力テキスト | - |
| 特記事項 | LongText | 記録内容 | notes |
| 画像 | Image | 添付画像 | attachments |

#### 利用者リスト
利用者（サービス受給者）情報。新システムの `clients` に対応。

| カラム | 型 | 説明 | 移行先 |
|--------|-----|------|--------|
| 利用者ID | Key | PK | id |
| 氏名 | Text | 利用者名 | name |
| ふりがな | Text | 読み仮名 | name_kana |
| 性別 | Enum | 男/女 | gender |
| 生年月日 | Date | 生年月日 | birth_date |
| 要介護度 | Ref | 要介護度マスタ参照 | care_level |
| 住所（都道府県） | Text | 住所1 | address_prefecture |
| 住所（市区町村以下） | Text | 住所2 | address_city |
| 連絡先（電話番号） | Phone | 電話 | phone |
| 担当CM | Text | ケアマネージャー | care_manager |
| 居宅名称 | Text | 居宅介護支援事業所 | care_office |
| 緊急連絡先（電話番号） | Phone | 緊急連絡先 | emergency_phone |
| 続柄 | Text | 緊急連絡先との関係 | emergency_relation |
| 緊急連絡先（名前） | Text | 緊急連絡先氏名 | emergency_name |
| アセスメント更新日 | Date | 最終アセスメント日 | last_assessment |
| サービス1/2 | Ref | 定期サービス設定 | regular_services |
| 曜日1/2 | Enum | サービス曜日 | service_days |
| 開始時間/終了時間 | Time | サービス時間帯 | service_times |
| 支援内容（身体/自立/生活） | EnumList | 各サービスの内容 | service_contents |

**ADL項目（アセスメント）:**
- 寝返り、起き上がり、歩行、移乗
- 食事、口腔衛生、入浴・洗身、更衣
- トイレ移乗、排尿・排便、薬の内服
- コミュニケーション

#### 支援者
職員（ヘルパー）情報。新システムの `staff` に対応。

| カラム | 型 | 説明 | 移行先 |
|--------|-----|------|--------|
| 支援者ID | Key | PK | id |
| 支援者 | Text | 氏名 | name |
| 削除 | Boolean | 論理削除フラグ | deleted_at |

### マスタテーブル

| テーブル名 | 用途 | 移行方針 |
|-----------|------|---------|
| 訪問理由 | 訪問目的の選択肢 | Enum または 別テーブル |
| 身体介護 | 身体介護項目マスタ | service_items テーブル |
| 自立支援 | 自立支援項目マスタ | service_items テーブル |
| 生活援助 | 生活援助項目マスタ | service_items テーブル |
| 要介護度 | 要介護度マスタ | care_levels テーブル |
| サービスリスト | サービス種類マスタ | service_types テーブル |
| 目標例 | 計画書目標文例 | goal_templates テーブル |
| 支援内容 | 支援カテゴリ | - |
| 実施報告書文書例 | 報告書定型文 | report_templates テーブル |
| プロンプト | AI用プロンプト | prompts テーブル |

### 帳票テーブル

| テーブル名 | 用途 | 移行方針 |
|-----------|------|---------|
| PDF（報告書）作成 | 実施報告書の生成管理 | reports テーブル |
| PDF（計画書）作成 | 訪問介護計画書の生成管理 | care_plans テーブル |

### プロセステーブル（移行対象外）

AppSheet Automation用の中間テーブル。新システムではCloud Functionsで代替。

- Process for 【AIなし新規作成】PDF（報告書）作成
- Process for 【AIあり】対象月の内容AI要約
- Process for 【更新時】PDF（報告書）作成
- Process for 【介護支援】特記事項のAI文章生成
- 各種Output テーブル

## ビジネスロジック

### 1. 訪問記録入力フロー

```
利用者選択 → 訪問情報入力 → サービス内容選択 → バイタル入力 → 特記事項入力 → 保存
                                                      ↓
                                              [AI生成オプション]
                                                      ↓
                                              AI文章生成 → 特記事項に反映
```

### 2. AI文章生成機能

**特記事項AI生成（訪問記録単位）**
- 入力: AI用文章入力 + 実施内容 + バイタル
- 出力: 特記事項の文章
- トリガー: ユーザーアクション

**月次AI要約（報告書用）**
- 入力: 対象月の全訪問記録
- 出力: 「利用者の生活状況・特記事項」
- トリガー: 報告書作成時

### 3. PDF帳票生成

**実施報告書**
- GAS連携でPDF生成
- 対象月の訪問記録を集約
- AI要約を含む

**訪問介護計画書**
- 長期目標×3、短期目標×3
- 目標例マスタから選択可能
- 支援内容を自動反映

### 4. スライス（データフィルタ）

| スライス名 | 条件 | 用途 |
|-----------|------|------|
| 利用中 | 削除=FALSE | 現在サービス中の利用者 |
| 利用削除 | 削除=TRUE | 終了した利用者 |
| ふりがな無し | ふりがな=空 | データ整備用 |
| 表示支援者 | 削除=FALSE | アクティブな職員 |

## 画面構成

### メインビュー

| ビュー名 | 種類 | 用途 |
|---------|------|------|
| 記録 | Form | 訪問記録の新規入力 |
| 履歴 | Table/Deck | 訪問記録一覧 |
| 利用者情報 | Deck | 利用者一覧・詳細 |
| スケジュール | Calendar | 訪問予定カレンダー |
| 印刷 | - | 帳票メニュー |
| 報告書 | Table | 実施報告書一覧 |
| 計画書 | Table | 訪問介護計画書一覧 |
| 指示 | Table | 指示内容一覧 |
| 支援者 | Table | 職員管理 |
| 目標例 | Table | 目標文例管理 |
| プロンプト | Table | AIプロンプト管理 |

## 移行時の注意点

### データ型の変換

| AppSheet型 | PostgreSQL型 | 注意 |
|------------|-------------|------|
| Key (自動採番) | UUID | ID体系変更 |
| Ref | UUID (FK) | 参照整合性確認 |
| EnumList | TEXT[] または JSONB | 複数選択の保持方法 |
| Image | TEXT (URL) | ストレージ移行必要 |
| DateTime | TIMESTAMPTZ | タイムゾーン考慮 |

### 機能の代替

| AppSheet機能 | 新システム |
|-------------|-----------|
| Automation | Cloud Functions |
| Bot (AI) | Vertex AI Gemini |
| PDF生成 (GAS) | Cloud Functions + PDF Library |
| Image Storage | Cloud Storage |

### 移行対象外

- プロセステーブル（Automation用）
- ヘルパータイムスケジュール（外部リンク）
- _Per User Settings（AppSheet内部）

---

詳細なカラム定義は `docs/md/Application_Documentation.md` を参照。
