# データモデル設計

Firebase Data Connect（Cloud SQL PostgreSQL）で管理。

## ER図

```
┌──────────────┐
│  facilities  │
│   (事業所)   │
└──────┬───────┘
       │1
       │
       ├────────────────┬────────────────┬────────────────┐
       │n               │n               │n               │n
┌──────┴───────┐ ┌──────┴───────┐ ┌──────┴───────┐ ┌──────┴───────┐
│    staff     │ │   clients    │ │service_types │ │service_items │
│   (職員)     │ │  (利用者)    │ │(サービス種類) │ │(サービス項目) │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────────────┘
       │                │                │
       │n        1│     │n        1│     │n
       │          │     │          │     │
       │    ┌─────┴─────┴──────────┴─────┤
       │    │                            │
       │    │n                           │n
┌──────┴────┴──┐                  ┌──────┴───────┐
│  schedules   │                  │  care_plans  │
│(スケジュール) │                  │ (ケアプラン)  │
└──────┬───────┘                  └──────────────┘
       │1
       │
       │n
┌──────┴───────┐
│visit_records │
│ (訪問記録)   │
└──────┬───────┘
       │
       │n
┌──────┴───────┐
│   reports    │
│ (実施報告書) │
└──────────────┘
```

## エンティティ一覧

| エンティティ | 説明 | 優先度 |
|-------------|------|--------|
| facilities | 事業所 | P0 |
| staff | 職員（ヘルパー） | P0 |
| clients | 利用者 | P0 |
| service_types | サービス種類（身体介護/生活援助等） | P0 |
| service_items | サービス項目（排泄介助/掃除等） | P0 |
| care_levels | 要介護度マスタ | P0 |
| visit_reasons | 訪問理由マスタ | P0 |
| schedules | スケジュール（予定） | P0 |
| visit_records | 訪問記録（実績） | P0 |
| care_plans | ケアプラン | P1 |
| reports | 実施報告書 | P1 |
| goal_templates | 目標文例マスタ | P2 |
| prompts | AIプロンプトマスタ | P2 |

---

## テーブル定義

### facilities（事業所）

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | |
| name | TEXT | NOT NULL | 事業所名 |
| address | TEXT | | 住所 |
| phone | TEXT | | 電話番号 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

### staff（職員）

| カラム | 型 | 制約 | 説明 | AppSheet元 |
|--------|-----|------|------|-----------|
| id | UUID | PK | | 支援者ID |
| facility_id | UUID | FK → facilities | 所属事業所 | - |
| firebase_uid | TEXT | UNIQUE | Firebase Auth UID | - |
| name | TEXT | NOT NULL | 氏名 | 支援者 |
| email | TEXT | UNIQUE | メールアドレス | - |
| role | TEXT | DEFAULT 'staff' | admin / staff | - |
| is_active | BOOLEAN | DEFAULT TRUE | 有効フラグ | 削除の逆 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | | |

### clients（利用者）

| カラム | 型 | 制約 | 説明 | AppSheet元 |
|--------|-----|------|------|-----------|
| id | UUID | PK | | 利用者ID |
| facility_id | UUID | FK → facilities | 所属事業所 | - |
| name | TEXT | NOT NULL | 氏名 | 氏名 |
| name_kana | TEXT | | 読み仮名 | ふりがな |
| gender | TEXT | | 性別（男/女） | 性別 |
| birth_date | DATE | | 生年月日 | 生年月日 |
| care_level_id | UUID | FK → care_levels | 要介護度 | 要介護度 |
| address_prefecture | TEXT | | 都道府県 | 住所（都道府県） |
| address_city | TEXT | | 市区町村以下 | 住所（市区町村以下） |
| phone | TEXT | | 電話番号 | 連絡先（電話番号） |
| care_manager | TEXT | | 担当ケアマネ | 担当CM |
| care_office | TEXT | | 居宅介護支援事業所 | 居宅名称 |
| emergency_phone | TEXT | | 緊急連絡先電話 | 緊急連絡先（電話番号） |
| emergency_name | TEXT | | 緊急連絡先氏名 | 緊急連絡先（名前） |
| emergency_relation | TEXT | | 緊急連絡先続柄 | 続柄 |
| assessment | JSONB | | アセスメント情報 | ADL項目群 |
| last_assessment_date | DATE | | 最終アセスメント日 | アセスメント更新日 |
| regular_services | JSONB | | 定期サービス設定 | サービス1/2, 曜日, 時間 |
| notes | TEXT | | 備考 | 備考 |
| is_active | BOOLEAN | DEFAULT TRUE | 有効フラグ | 削除の逆 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | | |

**assessment JSONB構造:**
```json
{
  "turning": "自立/一部介助/全介助",
  "sitting_up": "自立/一部介助/全介助",
  "walking": "自立/一部介助/全介助",
  "transfer": "自立/一部介助/全介助",
  "eating": "自立/一部介助/全介助",
  "oral_hygiene": "自立/一部介助/全介助",
  "bathing": "自立/一部介助/全介助",
  "dressing": "自立/一部介助/全介助",
  "toilet_transfer": "自立/一部介助/全介助",
  "excretion": "自立/一部介助/全介助",
  "medication": "自立/一部介助/全介助",
  "communication": "自立/一部介助/全介助",
  "main_complaints": "利用者の主な訴え",
  "family_environment": "家族を含む環境",
  "other_notes": "その他サービス提供に当たって必要な事項"
}
```

**regular_services JSONB構造:**
```json
{
  "services": [
    {
      "service_type_id": "uuid",
      "day_of_week": ["月", "水", "金"],
      "start_time": "09:00",
      "end_time": "10:00",
      "service_items": {
        "physical": ["排泄介助", "食事介助"],
        "daily_life": [],
        "independence": []
      }
    }
  ]
}
```

### care_levels（要介護度マスタ）

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | |
| name | TEXT | NOT NULL, UNIQUE | 要支援1/要支援2/要介護1〜5 |
| sort_order | INTEGER | | 表示順 |

### service_types（サービス種類）

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | |
| facility_id | UUID | FK → facilities | |
| code | TEXT | | サービスコード |
| name | TEXT | NOT NULL | サービス名 |
| category | TEXT | NOT NULL | physical/daily_life/independence |
| color | TEXT | | 表示色（HEX） |
| sort_order | INTEGER | | 表示順 |

**category値:**
- `physical`: 身体介護
- `daily_life`: 生活援助
- `independence`: 自立支援

### service_items（サービス項目マスタ）

| カラム | 型 | 制約 | 説明 | AppSheet元 |
|--------|-----|------|------|-----------|
| id | UUID | PK | | |
| service_type_id | UUID | FK → service_types | | |
| name | TEXT | NOT NULL | 項目名 | 身体介護/生活援助/自立支援の各項目 |
| sort_order | INTEGER | | 表示順 | |

### visit_reasons（訪問理由マスタ）

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | |
| name | TEXT | NOT NULL, UNIQUE | 定期/臨時/その他 |
| sort_order | INTEGER | | 表示順 |

### schedules（スケジュール）

| カラム | 型 | 制約 | 説明 | AppSheet元 |
|--------|-----|------|------|-----------|
| id | UUID | PK | | |
| facility_id | UUID | FK → facilities | | |
| client_id | UUID | FK → clients, NOT NULL | | 利用者名 |
| staff_id | UUID | FK → staff, NOT NULL | | 支援者 |
| service_type_id | UUID | FK → service_types | | |
| scheduled_date | DATE | NOT NULL | 予定日 | 訪問日 |
| start_time | TIME | NOT NULL | 開始時刻 | 開始時間 |
| end_time | TIME | NOT NULL | 終了時刻 | 終了時間 |
| status | TEXT | DEFAULT 'scheduled' | scheduled/completed/cancelled | |
| recurrence_rule | TEXT | | 繰り返しルール（iCal RRULE） | |
| recurrence_id | UUID | FK → schedules | 繰り返しの親ID | |
| notes | TEXT | | メモ | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | | |

**recurrence_rule例:**
- 毎週月水金: `FREQ=WEEKLY;BYDAY=MO,WE,FR`
- 毎月第2火曜: `FREQ=MONTHLY;BYDAY=2TU`

### visit_records（訪問記録）

| カラム | 型 | 制約 | 説明 | AppSheet元 |
|--------|-----|------|------|-----------|
| id | UUID | PK | | 訪問介護記録ID |
| schedule_id | UUID | FK → schedules | 紐づくスケジュール | |
| client_id | UUID | FK → clients, NOT NULL | | 利用者名 |
| staff_id | UUID | FK → staff, NOT NULL | | 支援者 |
| visit_date | DATE | NOT NULL | 訪問日 | 訪問日 |
| visit_reason_id | UUID | FK → visit_reasons | | 訪問理由 |
| start_time | TIME | NOT NULL | 開始時刻 | 開始時間 |
| end_time | TIME | NOT NULL | 終了時刻 | 終了時間 |
| vitals | JSONB | | バイタル情報 | 脈拍/血圧 |
| services | JSONB | NOT NULL | 実施サービス | 身体介護/生活援助/自立支援 |
| notes | TEXT | | 特記事項 | 特記事項 |
| ai_generated | BOOLEAN | DEFAULT FALSE | AI生成フラグ | AI利用 |
| ai_input | TEXT | | AI生成用入力 | AI用文章入力 |
| satisfaction | TEXT | | 利用者満足度 | 利用者及び家族の満足度 |
| satisfaction_reason | TEXT | | 不満足理由 | ※不満足の場合その理由 |
| condition_change | TEXT | | 心身状況変化 | 利用者の生活状況及び心身の状況の変化 |
| condition_change_detail | TEXT | | 変化詳細 | ※変化ありの場合その内容 |
| service_change_needed | TEXT | | サービス変更必要性 | サービス変更の必要性 |
| service_change_detail | TEXT | | 変更詳細 | ※必要アリの場合その内容 |
| attachments | TEXT[] | | 添付画像URL | 画像 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | | |

**vitals JSONB構造:**
```json
{
  "pulse": 72,
  "bp_high": 120,
  "bp_low": 80,
  "temperature": 36.5,
  "spo2": 98
}
```

**services JSONB構造:**
```json
{
  "physical": ["排泄介助", "食事介助"],
  "daily_life": ["掃除", "洗濯"],
  "independence": []
}
```

### reports（実施報告書）

| カラム | 型 | 制約 | 説明 | AppSheet元 |
|--------|-----|------|------|-----------|
| id | UUID | PK | | PDF（報告書）作成ID |
| client_id | UUID | FK → clients, NOT NULL | | 利用者氏名 |
| staff_id | UUID | FK → staff, NOT NULL | 作成者 | 作成者 |
| target_year | INTEGER | NOT NULL | 対象年 | 対象年（指定選択） |
| target_month | INTEGER | NOT NULL | 対象月 | 対象月（指定選択） |
| summary | TEXT | | 生活状況・特記事項 | 利用者の生活状況・特記事項 |
| ai_generated | BOOLEAN | DEFAULT FALSE | AI生成フラグ | AI利用 |
| pdf_url | TEXT | | PDF保存先URL | 作成PDF場所 |
| pdf_generated | BOOLEAN | DEFAULT FALSE | PDF発行済み | PDF発行flag |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | | 作成日 |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | | |

### care_plans（ケアプラン）

| カラム | 型 | 制約 | 説明 | AppSheet元 |
|--------|-----|------|------|-----------|
| id | UUID | PK | | PDF（計画書）作成ID |
| client_id | UUID | FK → clients, NOT NULL | | 利用者氏名 |
| staff_id | UUID | FK → staff, NOT NULL | 作成者 | 作成者 |
| current_situation | TEXT | | 利用者の生活現状 | 利用者の生活現状 |
| family_wishes | TEXT | | 利用者及び家族の意向 | 利用者及び家族の意向・希望 |
| main_support | TEXT | | 主な支援内容 | 主な支援内容 |
| long_term_goals | JSONB | | 長期目標（最大3） | 長期目標1〜3 |
| short_term_goals | JSONB | | 短期目標（最大3） | 短期目標1〜3 |
| pdf_url | TEXT | | PDF保存先URL | PDF_URL |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | | 作成日 |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | | |

**long_term_goals / short_term_goals JSONB構造:**
```json
[
  {
    "content": "目標内容",
    "template_id": "uuid (goal_templatesへの参照)",
    "start_date": "2026-01-01",
    "end_date": "2026-06-30"
  }
]
```

### goal_templates（目標文例マスタ）

| カラム | 型 | 制約 | 説明 | AppSheet元 |
|--------|-----|------|------|-----------|
| id | UUID | PK | | 目標例ID |
| support_type | TEXT | NOT NULL | 支援内容カテゴリ | 支援内容 |
| goal_type | TEXT | NOT NULL | long_term/short_term | 目標期間 |
| content | TEXT | NOT NULL | 目標文例 | 目標内容 |
| sort_order | INTEGER | | 表示順 | |

### prompts（AIプロンプトマスタ）

| カラム | 型 | 制約 | 説明 | AppSheet元 |
|--------|-----|------|------|-----------|
| id | UUID | PK | | プロンプトID |
| title | TEXT | NOT NULL | タイトル | タイトル |
| content | TEXT | NOT NULL | プロンプト内容 | プロンプト |
| sort_order | INTEGER | | 表示順 | |

---

## インデックス

```sql
-- 検索・フィルタ用
CREATE INDEX idx_clients_facility ON clients(facility_id);
CREATE INDEX idx_clients_care_level ON clients(care_level_id);
CREATE INDEX idx_clients_active ON clients(is_active);

CREATE INDEX idx_staff_facility ON staff(facility_id);
CREATE INDEX idx_staff_active ON staff(is_active);

CREATE INDEX idx_schedules_facility ON schedules(facility_id);
CREATE INDEX idx_schedules_date ON schedules(scheduled_date);
CREATE INDEX idx_schedules_client ON schedules(client_id);
CREATE INDEX idx_schedules_staff ON schedules(staff_id);
CREATE INDEX idx_schedules_status ON schedules(status);

CREATE INDEX idx_visit_records_date ON visit_records(visit_date);
CREATE INDEX idx_visit_records_client ON visit_records(client_id);
CREATE INDEX idx_visit_records_staff ON visit_records(staff_id);

CREATE INDEX idx_reports_client ON reports(client_id);
CREATE INDEX idx_reports_target ON reports(target_year, target_month);
```

---

## seedデータ

### care_levels
```sql
INSERT INTO care_levels (id, name, sort_order) VALUES
  (uuid_generate_v4(), '要支援1', 1),
  (uuid_generate_v4(), '要支援2', 2),
  (uuid_generate_v4(), '要介護1', 3),
  (uuid_generate_v4(), '要介護2', 4),
  (uuid_generate_v4(), '要介護3', 5),
  (uuid_generate_v4(), '要介護4', 6),
  (uuid_generate_v4(), '要介護5', 7);
```

### visit_reasons
```sql
INSERT INTO visit_reasons (id, name, sort_order) VALUES
  (uuid_generate_v4(), '定期', 1),
  (uuid_generate_v4(), '臨時', 2),
  (uuid_generate_v4(), 'その他', 3);
```

### service_items（例）
```sql
-- 身体介護
INSERT INTO service_items (id, service_type_id, name, sort_order) VALUES
  (uuid_generate_v4(), '{physical_type_id}', '排泄介助', 1),
  (uuid_generate_v4(), '{physical_type_id}', '食事介助', 2),
  (uuid_generate_v4(), '{physical_type_id}', '入浴介助', 3),
  (uuid_generate_v4(), '{physical_type_id}', '更衣介助', 4),
  (uuid_generate_v4(), '{physical_type_id}', '移乗介助', 5),
  (uuid_generate_v4(), '{physical_type_id}', '体位変換', 6),
  (uuid_generate_v4(), '{physical_type_id}', '服薬介助', 7);

-- 生活援助
INSERT INTO service_items (id, service_type_id, name, sort_order) VALUES
  (uuid_generate_v4(), '{daily_life_type_id}', '掃除', 1),
  (uuid_generate_v4(), '{daily_life_type_id}', '洗濯', 2),
  (uuid_generate_v4(), '{daily_life_type_id}', '調理', 3),
  (uuid_generate_v4(), '{daily_life_type_id}', '買い物', 4),
  (uuid_generate_v4(), '{daily_life_type_id}', 'ゴミ出し', 5);
```

---

## マイグレーション順序

1. care_levels, visit_reasons（マスタ、依存なし）
2. facilities（依存なし）
3. service_types（facilities依存）
4. service_items（service_types依存）
5. staff, clients（facilities, care_levels依存）
6. schedules（clients, staff, service_types依存）
7. visit_records（schedules, clients, staff, visit_reasons依存）
8. reports, care_plans（clients, staff依存）
9. goal_templates, prompts（依存なし）
