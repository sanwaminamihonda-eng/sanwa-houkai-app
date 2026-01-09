# データモデル設計

Firebase Data Connect（Cloud SQL PostgreSQL）で管理。

## エンティティ一覧

| エンティティ | 説明 |
|-------------|------|
| facilities | 事業所 |
| staff | 職員 |
| clients | 利用者 |
| service_types | サービス種類 |
| schedules | スケジュール（予定） |
| visit_records | 訪問記録（実績） |
| care_plans | ケアプラン |

## ER図

```
┌──────────────┐
│  facilities  │
│   (事業所)   │
└──────┬───────┘
       │1
       │
       ├────────────────┬────────────────┐
       │n               │n               │n
┌──────┴───────┐ ┌──────┴───────┐ ┌──────┴───────┐
│    staff     │ │   clients    │ │service_types │
│   (職員)     │ │  (利用者)    │ │(サービス種類) │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
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
└──────────────┘
```

## リレーション

| 関係 | 説明 |
|------|------|
| facilities → staff | 1:N（事業所に複数職員） |
| facilities → clients | 1:N（事業所に複数利用者） |
| clients → care_plans | 1:N（利用者に複数ケアプラン） |
| clients → schedules | 1:N |
| staff → schedules | 1:N |
| service_types → schedules | 1:N |
| schedules → visit_records | 1:N（予定に対する実績） |

## テーブル定義（概要）

### facilities

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | PK |
| name | TEXT | 事業所名 |
| address | TEXT | 住所 |
| phone | TEXT | 電話番号 |

### staff

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | PK |
| facility_id | UUID | FK |
| firebase_uid | TEXT | Firebase Auth UID |
| name | TEXT | 氏名 |
| role | TEXT | admin / staff |

### clients

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | PK |
| facility_id | UUID | FK |
| name | TEXT | 氏名 |
| care_level | TEXT | 要介護度 |

### service_types

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | PK |
| code | TEXT | サービスコード |
| name | TEXT | サービス名 |
| unit_price | INTEGER | 単位数 |

### schedules

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | PK |
| facility_id | UUID | FK |
| client_id | UUID | FK |
| staff_id | UUID | FK |
| service_type_id | UUID | FK |
| scheduled_date | DATE | 予定日 |
| scheduled_time | TIME | 予定時刻 |
| status | TEXT | scheduled / completed / cancelled |

### visit_records

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | PK |
| schedule_id | UUID | FK |
| visit_date | DATE | 訪問日 |
| start_time | TIME | 開始時刻 |
| end_time | TIME | 終了時刻 |
| content | TEXT | サービス内容 |
| vitals | JSONB | バイタル情報 |
| ai_summary | TEXT | AI要約 |

### care_plans

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | PK |
| client_id | UUID | FK |
| start_date | DATE | 開始日 |
| end_date | DATE | 終了日 |
| content | JSONB | プラン内容 |

---

※詳細スキーマは実装時に確定
