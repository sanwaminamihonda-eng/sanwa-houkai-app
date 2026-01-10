-- =============================================
-- デモ用シードデータ
-- =============================================
-- このSQLはデモ環境用のサンプルデータを投入します。
-- 個人情報は含まれておらず、すべて架空のデータです。
-- =============================================

-- トランザクション開始
BEGIN;

-- =============================================
-- 1. 要介護度マスタ
-- =============================================
INSERT INTO care_levels (id, name, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000201', '要支援1', 1),
  ('00000000-0000-0000-0000-000000000202', '要支援2', 2),
  ('00000000-0000-0000-0000-000000000203', '要介護1', 3),
  ('00000000-0000-0000-0000-000000000204', '要介護2', 4),
  ('00000000-0000-0000-0000-000000000205', '要介護3', 5),
  ('00000000-0000-0000-0000-000000000206', '要介護4', 6),
  ('00000000-0000-0000-0000-000000000207', '要介護5', 7)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

-- =============================================
-- 2. 訪問理由マスタ
-- =============================================
INSERT INTO visit_reasons (id, name, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000301', '通常訪問', 1),
  ('00000000-0000-0000-0000-000000000302', '緊急訪問', 2),
  ('00000000-0000-0000-0000-000000000303', '初回訪問', 3),
  ('00000000-0000-0000-0000-000000000304', 'サービス担当者会議', 4),
  ('00000000-0000-0000-0000-000000000305', 'その他', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

-- =============================================
-- 3. 目標文例マスタ
-- =============================================
INSERT INTO goal_templates (id, support_type, goal_type, content, sort_order) VALUES
  ('00000000-0000-0000-0000-000000001101', '身体介護', '長期', '日常生活動作の維持・向上を図り、自立した生活を送れるようになる', 1),
  ('00000000-0000-0000-0000-000000001102', '身体介護', '短期', '安全に入浴できるようになる', 2),
  ('00000000-0000-0000-0000-000000001103', '身体介護', '短期', '転倒せずに歩行できるようになる', 3),
  ('00000000-0000-0000-0000-000000001104', '生活援助', '長期', '清潔で快適な住環境を維持できるようになる', 4),
  ('00000000-0000-0000-0000-000000001105', '生活援助', '短期', '定期的に掃除・洗濯ができるようになる', 5),
  ('00000000-0000-0000-0000-000000001106', '生活援助', '短期', '栄養バランスの取れた食事を摂れるようになる', 6),
  ('00000000-0000-0000-0000-000000001107', '自立支援', '長期', '地域社会と交流しながら生活できるようになる', 7),
  ('00000000-0000-0000-0000-000000001108', '自立支援', '短期', '週に1回は外出できるようになる', 8)
ON CONFLICT (id) DO UPDATE SET support_type = EXCLUDED.support_type, goal_type = EXCLUDED.goal_type, content = EXCLUDED.content, sort_order = EXCLUDED.sort_order;

-- =============================================
-- 4. デモ事業所
-- =============================================
INSERT INTO facilities (id, name, address, phone, created_at, updated_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'デモ訪問介護ステーション', '東京都千代田区丸の内1-1-1', '03-1234-5678', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, address = EXCLUDED.address, phone = EXCLUDED.phone, updated_at = NOW();

-- =============================================
-- 5. サービス種類
-- =============================================
INSERT INTO service_types (id, facility_id, code, name, category, color, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000001', 'SH', '身体介護', '身体介護', '#4CAF50', 1),
  ('00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000001', 'SE', '生活援助', '生活援助', '#2196F3', 2),
  ('00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000001', 'JR', '自立支援', '自立支援', '#FF9800', 3),
  ('00000000-0000-0000-0000-000000000504', '00000000-0000-0000-0000-000000000001', 'YS', '夜間対応', '夜間対応', '#9C27B0', 4),
  ('00000000-0000-0000-0000-000000000505', '00000000-0000-0000-0000-000000000001', 'TK', '特定行為', '特定行為', '#F44336', 5),
  ('00000000-0000-0000-0000-000000000506', '00000000-0000-0000-0000-000000000001', 'SO', 'その他', 'その他', '#607D8B', 6)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, name = EXCLUDED.name, category = EXCLUDED.category, color = EXCLUDED.color, sort_order = EXCLUDED.sort_order;

-- =============================================
-- 6. サービス項目
-- =============================================
-- 身体介護
INSERT INTO service_items (id, service_type_id, name, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000501', '排泄介助', 1),
  ('00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000501', '入浴介助', 2),
  ('00000000-0000-0000-0000-000000000603', '00000000-0000-0000-0000-000000000501', '清拭', 3),
  ('00000000-0000-0000-0000-000000000604', '00000000-0000-0000-0000-000000000501', '食事介助', 4),
  ('00000000-0000-0000-0000-000000000605', '00000000-0000-0000-0000-000000000501', '服薬介助', 5),
  ('00000000-0000-0000-0000-000000000606', '00000000-0000-0000-0000-000000000501', '更衣介助', 6),
  ('00000000-0000-0000-0000-000000000607', '00000000-0000-0000-0000-000000000501', '体位変換', 7),
  ('00000000-0000-0000-0000-000000000608', '00000000-0000-0000-0000-000000000501', '移乗介助', 8),
  ('00000000-0000-0000-0000-000000000609', '00000000-0000-0000-0000-000000000501', '歩行介助', 9),
  ('00000000-0000-0000-0000-000000000610', '00000000-0000-0000-0000-000000000501', '整容介助', 10)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

-- 生活援助
INSERT INTO service_items (id, service_type_id, name, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000611', '00000000-0000-0000-0000-000000000502', '掃除', 1),
  ('00000000-0000-0000-0000-000000000612', '00000000-0000-0000-0000-000000000502', '洗濯', 2),
  ('00000000-0000-0000-0000-000000000613', '00000000-0000-0000-0000-000000000502', '調理', 3),
  ('00000000-0000-0000-0000-000000000614', '00000000-0000-0000-0000-000000000502', '買い物代行', 4),
  ('00000000-0000-0000-0000-000000000615', '00000000-0000-0000-0000-000000000502', 'ゴミ出し', 5),
  ('00000000-0000-0000-0000-000000000616', '00000000-0000-0000-0000-000000000502', '薬の受け取り', 6)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

-- 自立支援
INSERT INTO service_items (id, service_type_id, name, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000617', '00000000-0000-0000-0000-000000000503', '外出同行', 1),
  ('00000000-0000-0000-0000-000000000618', '00000000-0000-0000-0000-000000000503', '通院等乗降介助', 2),
  ('00000000-0000-0000-0000-000000000619', '00000000-0000-0000-0000-000000000503', 'リハビリ補助', 3),
  ('00000000-0000-0000-0000-000000000620', '00000000-0000-0000-0000-000000000503', '見守り', 4)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

-- =============================================
-- 7. デモ職員
-- =============================================
INSERT INTO staff (id, facility_id, firebase_uid, name, email, role, is_active, created_at, updated_at) VALUES
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', NULL, 'デモユーザー', 'demo@example.com', 'admin', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', NULL, '山田 花子', 'yamada@example.com', 'staff', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', NULL, '佐藤 太郎', 'sato@example.com', 'staff', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000001', NULL, '鈴木 一郎', 'suzuki@example.com', 'staff', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, role = EXCLUDED.role, is_active = EXCLUDED.is_active, updated_at = NOW();

-- =============================================
-- 8. デモ利用者
-- =============================================
INSERT INTO clients (id, facility_id, name, name_kana, gender, birth_date, care_level_id, address_prefecture, address_city, phone, care_manager, care_office, emergency_phone, emergency_name, emergency_relation, assessment, regular_services, notes, is_active, created_at, updated_at) VALUES
  ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001', '田中 太郎', 'タナカ タロウ', '男性', '1940-05-15', '00000000-0000-0000-0000-000000000204', '東京都', '千代田区', '03-1111-2222', '高橋 ケアマネ', 'ケアセンター東京', '090-1111-2222', '田中 花子', '妻', '{"mobility": "歩行器使用", "cognition": "軽度認知症"}', '["身体介護", "生活援助"]', '明るい性格で会話好き。糖尿病の食事制限あり。', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000001', '佐藤 幸子', 'サトウ サチコ', '女性', '1935-08-20', '00000000-0000-0000-0000-000000000205', '東京都', '新宿区', '03-2222-3333', '渡辺 ケアマネ', '新宿ケアステーション', '090-2222-3333', '佐藤 一郎', '息子', '{"mobility": "車椅子", "cognition": "問題なし"}', '["身体介護"]', '読書が趣味。耳が少し遠い。', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000001', '山田 次郎', 'ヤマダ ジロウ', '男性', '1945-03-10', '00000000-0000-0000-0000-000000000203', '東京都', '渋谷区', '03-3333-4444', '伊藤 ケアマネ', '渋谷介護センター', '090-3333-4444', '山田 美子', '娘', '{"mobility": "自立歩行可", "cognition": "問題なし"}', '["生活援助"]', '一人暮らし。料理が苦手。', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000404', '00000000-0000-0000-0000-000000000001', '鈴木 美代子', 'スズキ ミヨコ', '女性', '1938-11-25', '00000000-0000-0000-0000-000000000206', '東京都', '世田谷区', '03-4444-5555', '中村 ケアマネ', '世田谷ケアサポート', '090-4444-5555', '鈴木 健一', '息子', '{"mobility": "ベッド上", "cognition": "重度認知症"}', '["身体介護", "特定行為"]', '全介助が必要。穏やかな性格。', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000405', '00000000-0000-0000-0000-000000000001', '高橋 健太', 'タカハシ ケンタ', '男性', '1950-07-08', '00000000-0000-0000-0000-000000000201', '東京都', '目黒区', '03-5555-6666', '小林 ケアマネ', '目黒介護ステーション', '090-5555-6666', '高橋 真理', '妻', '{"mobility": "杖使用", "cognition": "問題なし"}', '["生活援助", "自立支援"]', '元教師。散歩が日課。', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000406', '00000000-0000-0000-0000-000000000001', '伊藤 節子', 'イトウ セツコ', '女性', '1942-12-03', '00000000-0000-0000-0000-000000000204', '東京都', '大田区', '03-6666-7777', '山本 ケアマネ', '大田ケアセンター', '090-6666-7777', '伊藤 誠', '夫', '{"mobility": "歩行器使用", "cognition": "軽度認知症"}', '["身体介護", "生活援助"]', '手芸が趣味。左膝に痛みあり。', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000407', '00000000-0000-0000-0000-000000000001', '渡辺 勝', 'ワタナベ マサル', '男性', '1948-09-17', '00000000-0000-0000-0000-000000000202', '東京都', '品川区', '03-7777-8888', '加藤 ケアマネ', '品川介護サービス', '090-7777-8888', '渡辺 久美子', '妻', '{"mobility": "自立歩行可", "cognition": "問題なし"}', '["生活援助"]', '囲碁が趣味。高血圧で服薬中。', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000408', '00000000-0000-0000-0000-000000000001', '中村 智子', 'ナカムラ トモコ', '女性', '1936-04-22', '00000000-0000-0000-0000-000000000207', '東京都', '杉並区', '03-8888-9999', '佐々木 ケアマネ', '杉並ケアステーション', '090-8888-9999', '中村 浩二', '息子', '{"mobility": "ベッド上", "cognition": "重度認知症"}', '["身体介護", "特定行為"]', '胃ろう管理中。穏やかな表情。', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000409', '00000000-0000-0000-0000-000000000001', '小林 正男', 'コバヤシ マサオ', '男性', '1947-01-30', '00000000-0000-0000-0000-000000000203', '東京都', '中野区', '03-9999-0000', '松本 ケアマネ', '中野介護センター', '090-9999-0000', '小林 恵子', '娘', '{"mobility": "杖使用", "cognition": "問題なし"}', '["生活援助", "自立支援"]', '元会社員。新聞を毎日読む。', true, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000410', '00000000-0000-0000-0000-000000000001', '加藤 由美', 'カトウ ユミ', '女性', '1943-06-14', '00000000-0000-0000-0000-000000000205', '東京都', '練馬区', '03-0000-1111', '藤田 ケアマネ', '練馬ケアサポート', '090-0000-1111', '加藤 雅彦', '息子', '{"mobility": "車椅子", "cognition": "軽度認知症"}', '["身体介護", "生活援助"]', 'カラオケが好き。糖尿病で食事管理中。', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_kana = EXCLUDED.name_kana,
  gender = EXCLUDED.gender,
  birth_date = EXCLUDED.birth_date,
  care_level_id = EXCLUDED.care_level_id,
  address_prefecture = EXCLUDED.address_prefecture,
  address_city = EXCLUDED.address_city,
  phone = EXCLUDED.phone,
  care_manager = EXCLUDED.care_manager,
  care_office = EXCLUDED.care_office,
  emergency_phone = EXCLUDED.emergency_phone,
  emergency_name = EXCLUDED.emergency_name,
  emergency_relation = EXCLUDED.emergency_relation,
  assessment = EXCLUDED.assessment,
  regular_services = EXCLUDED.regular_services,
  notes = EXCLUDED.notes,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- =============================================
-- 9. スケジュール（過去1週間〜今後2週間）
-- =============================================
-- 動的日付を使用
DO $$
DECLARE
  today DATE := CURRENT_DATE;
  schedule_id UUID;
  i INTEGER;
BEGIN
  -- 過去1週間〜今後2週間のスケジュールを生成
  FOR i IN -7..14 LOOP
    -- 田中太郎: 月水金 午前
    IF EXTRACT(DOW FROM today + i) IN (1, 3, 5) THEN
      INSERT INTO schedules (id, facility_id, client_id, staff_id, service_type_id, scheduled_date, start_time, end_time, status, notes, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000401',
        '00000000-0000-0000-0000-000000000102',
        '00000000-0000-0000-0000-000000000501',
        today + i,
        '09:00',
        '10:00',
        CASE WHEN i < 0 THEN 'completed' ELSE 'scheduled' END,
        '定期訪問（身体介護）',
        NOW(), NOW()
      )
      ON CONFLICT DO NOTHING;
    END IF;

    -- 佐藤幸子: 火木土 午前
    IF EXTRACT(DOW FROM today + i) IN (2, 4, 6) THEN
      INSERT INTO schedules (id, facility_id, client_id, staff_id, service_type_id, scheduled_date, start_time, end_time, status, notes, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000402',
        '00000000-0000-0000-0000-000000000103',
        '00000000-0000-0000-0000-000000000501',
        today + i,
        '10:00',
        '11:30',
        CASE WHEN i < 0 THEN 'completed' ELSE 'scheduled' END,
        '定期訪問（入浴介助）',
        NOW(), NOW()
      )
      ON CONFLICT DO NOTHING;
    END IF;

    -- 山田次郎: 月木 午後
    IF EXTRACT(DOW FROM today + i) IN (1, 4) THEN
      INSERT INTO schedules (id, facility_id, client_id, staff_id, service_type_id, scheduled_date, start_time, end_time, status, notes, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000403',
        '00000000-0000-0000-0000-000000000104',
        '00000000-0000-0000-0000-000000000502',
        today + i,
        '14:00',
        '15:00',
        CASE WHEN i < 0 THEN 'completed' ELSE 'scheduled' END,
        '定期訪問（生活援助）',
        NOW(), NOW()
      )
      ON CONFLICT DO NOTHING;
    END IF;

    -- 鈴木美代子: 毎日 午前・午後
    INSERT INTO schedules (id, facility_id, client_id, staff_id, service_type_id, scheduled_date, start_time, end_time, status, notes, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000404',
      '00000000-0000-0000-0000-000000000102',
      '00000000-0000-0000-0000-000000000501',
      today + i,
      '08:00',
      '09:00',
      CASE WHEN i < 0 THEN 'completed' ELSE 'scheduled' END,
      '朝のケア（排泄・更衣）',
      NOW(), NOW()
    )
    ON CONFLICT DO NOTHING;

    INSERT INTO schedules (id, facility_id, client_id, staff_id, service_type_id, scheduled_date, start_time, end_time, status, notes, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000404',
      '00000000-0000-0000-0000-000000000103',
      '00000000-0000-0000-0000-000000000501',
      today + i,
      '17:00',
      '18:00',
      CASE WHEN i < 0 THEN 'completed' ELSE 'scheduled' END,
      '夕方のケア（排泄・更衣）',
      NOW(), NOW()
    )
    ON CONFLICT DO NOTHING;

    -- 高橋健太: 火金 午前
    IF EXTRACT(DOW FROM today + i) IN (2, 5) THEN
      INSERT INTO schedules (id, facility_id, client_id, staff_id, service_type_id, scheduled_date, start_time, end_time, status, notes, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000405',
        '00000000-0000-0000-0000-000000000104',
        '00000000-0000-0000-0000-000000000503',
        today + i,
        '10:00',
        '11:00',
        CASE WHEN i < 0 THEN 'completed' ELSE 'scheduled' END,
        '外出同行（散歩）',
        NOW(), NOW()
      )
      ON CONFLICT DO NOTHING;
    END IF;

    -- 伊藤節子: 月水金 午後
    IF EXTRACT(DOW FROM today + i) IN (1, 3, 5) THEN
      INSERT INTO schedules (id, facility_id, client_id, staff_id, service_type_id, scheduled_date, start_time, end_time, status, notes, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000406',
        '00000000-0000-0000-0000-000000000103',
        '00000000-0000-0000-0000-000000000501',
        today + i,
        '13:00',
        '14:30',
        CASE WHEN i < 0 THEN 'completed' ELSE 'scheduled' END,
        '身体介護（入浴・清拭）',
        NOW(), NOW()
      )
      ON CONFLICT DO NOTHING;
    END IF;

    -- 渡辺勝: 水土 午前
    IF EXTRACT(DOW FROM today + i) IN (3, 6) THEN
      INSERT INTO schedules (id, facility_id, client_id, staff_id, service_type_id, scheduled_date, start_time, end_time, status, notes, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000407',
        '00000000-0000-0000-0000-000000000102',
        '00000000-0000-0000-0000-000000000502',
        today + i,
        '11:00',
        '12:00',
        CASE WHEN i < 0 THEN 'completed' ELSE 'scheduled' END,
        '生活援助（掃除・洗濯）',
        NOW(), NOW()
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;
END $$;

-- =============================================
-- 10. 訪問記録（過去2ヶ月分）
-- =============================================
DO $$
DECLARE
  today DATE := CURRENT_DATE;
  i INTEGER;
  visit_id UUID;
  client_id UUID;
  staff_id UUID;
  service_type_id UUID;
  visit_reason_id UUID;
  vitals_json JSONB;
  services_json JSONB;
  notes_text TEXT;
BEGIN
  -- 過去60日分の訪問記録を生成
  FOR i IN 1..60 LOOP
    -- 田中太郎の記録（月水金）
    IF EXTRACT(DOW FROM today - i) IN (1, 3, 5) THEN
      vitals_json := jsonb_build_object(
        'bloodPressure', format('%s/%s', 120 + (random() * 20)::int, 70 + (random() * 15)::int),
        'pulse', 65 + (random() * 20)::int,
        'temperature', 36.0 + (random() * 1.0)::numeric(3,1),
        'spo2', 95 + (random() * 4)::int
      );
      services_json := jsonb_build_object(
        'items', ARRAY['排泄介助', '服薬介助', '歩行介助'],
        'details', '排泄介助2回、服薬確認、リビングまでの歩行介助を実施'
      );
      notes_text := CASE
        WHEN random() < 0.3 THEN '本日は体調良好。食欲もあり、会話も弾んでいた。'
        WHEN random() < 0.6 THEN '少し疲れた様子。午後は休息を勧めた。'
        ELSE '奥様と楽しそうに会話されていた。表情も明るかった。'
      END;

      INSERT INTO visit_records (id, client_id, staff_id, visit_date, visit_reason_id, start_time, end_time, vitals, services, notes, ai_generated, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000401',
        '00000000-0000-0000-0000-000000000102',
        today - i,
        '00000000-0000-0000-0000-000000000301',
        '09:00',
        '10:00',
        vitals_json,
        services_json,
        notes_text,
        false,
        NOW(), NOW()
      );
    END IF;

    -- 佐藤幸子の記録（火木土）
    IF EXTRACT(DOW FROM today - i) IN (2, 4, 6) THEN
      vitals_json := jsonb_build_object(
        'bloodPressure', format('%s/%s', 130 + (random() * 25)::int, 75 + (random() * 15)::int),
        'pulse', 70 + (random() * 15)::int,
        'temperature', 36.0 + (random() * 0.8)::numeric(3,1),
        'spo2', 94 + (random() * 5)::int
      );
      services_json := jsonb_build_object(
        'items', ARRAY['入浴介助', '更衣介助', '整容介助'],
        'details', 'シャワー浴実施。洗髪、全身洗浄。入浴後の保湿ケア実施。'
      );
      notes_text := CASE
        WHEN random() < 0.3 THEN '入浴を楽しまれていた。読んでいる本の話をしてくれた。'
        WHEN random() < 0.6 THEN '左足に軽い浮腫あり。主治医に報告予定。'
        ELSE '入浴後、とてもすっきりした表情。会話も活発だった。'
      END;

      INSERT INTO visit_records (id, client_id, staff_id, visit_date, visit_reason_id, start_time, end_time, vitals, services, notes, ai_generated, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000402',
        '00000000-0000-0000-0000-000000000103',
        today - i,
        '00000000-0000-0000-0000-000000000301',
        '10:00',
        '11:30',
        vitals_json,
        services_json,
        notes_text,
        false,
        NOW(), NOW()
      );
    END IF;

    -- 山田次郎の記録（月木）
    IF EXTRACT(DOW FROM today - i) IN (1, 4) THEN
      vitals_json := jsonb_build_object(
        'bloodPressure', format('%s/%s', 115 + (random() * 15)::int, 68 + (random() * 10)::int),
        'pulse', 62 + (random() * 12)::int,
        'temperature', 36.2 + (random() * 0.6)::numeric(3,1),
        'spo2', 97 + (random() * 2)::int
      );
      services_json := jsonb_build_object(
        'items', ARRAY['掃除', '洗濯', '調理'],
        'details', '居室の掃除機かけ、トイレ清掃。洗濯物の取り込み・たたみ。夕食の調理（煮物）。'
      );
      notes_text := CASE
        WHEN random() < 0.3 THEN '今日は天気が良く、洗濯物がよく乾いた。夕食の煮物を喜んでくれた。'
        WHEN random() < 0.6 THEN '冷蔵庫の食材を確認し、買い物リストを一緒に作成した。'
        ELSE '元気そうで安心した。趣味の将棋の話をしてくれた。'
      END;

      INSERT INTO visit_records (id, client_id, staff_id, visit_date, visit_reason_id, start_time, end_time, vitals, services, notes, ai_generated, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000403',
        '00000000-0000-0000-0000-000000000104',
        today - i,
        '00000000-0000-0000-0000-000000000301',
        '14:00',
        '15:00',
        vitals_json,
        services_json,
        notes_text,
        false,
        NOW(), NOW()
      );
    END IF;

    -- 鈴木美代子の記録（毎日2回）
    vitals_json := jsonb_build_object(
      'bloodPressure', format('%s/%s', 100 + (random() * 20)::int, 60 + (random() * 15)::int),
      'pulse', 72 + (random() * 18)::int,
      'temperature', 36.0 + (random() * 1.2)::numeric(3,1),
      'spo2', 92 + (random() * 6)::int
    );
    services_json := jsonb_build_object(
      'items', ARRAY['排泄介助', '体位変換', '更衣介助'],
      'details', 'オムツ交換、体位変換（左側臥位→仰臥位）、パジャマから普段着へ更衣。'
    );
    notes_text := CASE
      WHEN random() < 0.3 THEN '穏やかな表情で過ごされていた。声かけに反応あり。'
      WHEN random() < 0.6 THEN '少し熱っぽい様子。経過観察を継続。'
      ELSE '手を握ると握り返してくれた。表情も良好。'
    END;

    INSERT INTO visit_records (id, client_id, staff_id, visit_date, visit_reason_id, start_time, end_time, vitals, services, notes, ai_generated, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000404',
      '00000000-0000-0000-0000-000000000102',
      today - i,
      '00000000-0000-0000-0000-000000000301',
      '08:00',
      '09:00',
      vitals_json,
      services_json,
      notes_text,
      false,
      NOW(), NOW()
    );

    -- 夕方の訪問
    vitals_json := jsonb_build_object(
      'bloodPressure', format('%s/%s', 105 + (random() * 18)::int, 62 + (random() * 12)::int),
      'pulse', 68 + (random() * 15)::int,
      'temperature', 36.2 + (random() * 0.8)::numeric(3,1),
      'spo2', 93 + (random() * 5)::int
    );
    services_json := jsonb_build_object(
      'items', ARRAY['排泄介助', '体位変換', '更衣介助'],
      'details', 'オムツ交換、体位変換（仰臥位→右側臥位）、就寝準備の更衣。'
    );

    INSERT INTO visit_records (id, client_id, staff_id, visit_date, visit_reason_id, start_time, end_time, vitals, services, notes, ai_generated, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000404',
      '00000000-0000-0000-0000-000000000103',
      today - i,
      '00000000-0000-0000-0000-000000000301',
      '17:00',
      '18:00',
      vitals_json,
      services_json,
      '夕方も穏やかに過ごされていた。明日への申し送り事項なし。',
      false,
      NOW(), NOW()
    );
  END LOOP;
END $$;

-- =============================================
-- 11. 実施報告書
-- =============================================
INSERT INTO reports (id, client_id, staff_id, target_year, target_month, summary, ai_generated, pdf_url, pdf_generated, created_at, updated_at) VALUES
  ('00000000-0000-0000-0000-000000000901', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000101', EXTRACT(YEAR FROM CURRENT_DATE)::int, EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '2 months')::int, '今月は体調も安定しており、予定通りの訪問を実施できました。奥様との会話も増え、精神面でも良い傾向が見られます。引き続き糖尿病の食事管理に注意しながら支援を継続します。', false, NULL, false, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000902', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000101', EXTRACT(YEAR FROM CURRENT_DATE)::int, EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')::int, '先月に引き続き安定した状態が続いています。歩行訓練の効果か、以前より足取りがしっかりしてきました。次月も同様の支援を継続予定です。', false, NULL, false, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000903', '00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000101', EXTRACT(YEAR FROM CURRENT_DATE)::int, EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '2 months')::int, '入浴介助は問題なく実施できています。読書が趣味とのことで、図書館への外出支援も検討中です。左足の浮腫については主治医に相談済み、経過観察となりました。', false, NULL, false, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000904', '00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000101', EXTRACT(YEAR FROM CURRENT_DATE)::int, EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')::int, '車椅子での移動も安定しています。入浴時の表情がとても明るく、QOL向上に寄与していると感じます。来月から図書館への外出同行を開始予定です。', false, NULL, false, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000905', '00000000-0000-0000-0000-000000000404', '00000000-0000-0000-0000-000000000101', EXTRACT(YEAR FROM CURRENT_DATE)::int, EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '2 months')::int, '全介助が必要な状態ですが、表情は穏やかで声かけにも反応があります。褥瘡予防のため体位変換を確実に実施しています。ご家族との連携も良好です。', false, NULL, false, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000906', '00000000-0000-0000-0000-000000000404', '00000000-0000-0000-0000-000000000101', EXTRACT(YEAR FROM CURRENT_DATE)::int, EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')::int, '今月も大きな変化なく過ごされています。皮膚の状態も良好で、褥瘡の兆候は見られません。来月も引き続き丁寧なケアを継続します。', false, NULL, false, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  target_year = EXCLUDED.target_year,
  target_month = EXCLUDED.target_month,
  summary = EXCLUDED.summary,
  ai_generated = EXCLUDED.ai_generated,
  pdf_url = EXCLUDED.pdf_url,
  pdf_generated = EXCLUDED.pdf_generated,
  updated_at = NOW();

-- =============================================
-- 12. ケアプラン（訪問介護計画書）
-- =============================================
INSERT INTO care_plans (id, client_id, staff_id, current_situation, family_wishes, main_support, long_term_goals, short_term_goals, pdf_url, created_at, updated_at) VALUES
  ('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000101', '糖尿病があり食事管理が必要。軽度認知症により服薬管理に不安がある。歩行器使用で室内移動は可能だが、外出時は介助が必要。', '自宅で安心して過ごしてほしい。できることは自分でやってほしいが、無理はしないでほしい。', '排泄介助、服薬管理、歩行介助を中心に日常生活動作を支援', '{"goals": ["日常生活動作の維持・向上", "安全な在宅生活の継続"]}', '{"goals": ["毎日の服薬を確実に行う", "週3回の歩行訓練を継続する"]}', NULL, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000001002', '00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000101', '車椅子生活だが上肢機能は良好。読書が趣味で知的活動は活発。耳が遠いためコミュニケーションに配慮が必要。', '清潔を保ち、趣味の読書を楽しんでほしい。できれば外出の機会も増やしたい。', '入浴介助を中心に清潔保持を支援。外出支援も検討中。', '{"goals": ["清潔で快適な生活の維持", "社会参加の機会を増やす"]}', '{"goals": ["週3回の入浴を継続する", "月1回は図書館に外出する"]}', NULL, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000001003', '00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000101', '一人暮らしで料理が苦手。身体機能は比較的良好だが、家事全般に支援が必要。社会的な交流が少ない。', '栄養のある食事を摂ってほしい。一人でも安心して生活してほしい。', '調理、掃除、洗濯などの生活援助を中心に支援', '{"goals": ["栄養バランスの取れた食生活の維持", "清潔な住環境の維持"]}', '{"goals": ["週2回の調理支援を受ける", "毎週の掃除・洗濯を継続する"]}', NULL, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000001004', '00000000-0000-0000-0000-000000000404', '00000000-0000-0000-0000-000000000101', 'ベッド上での生活が中心。重度認知症により意思疎通が困難だが、声かけには反応がある。全介助が必要。', '穏やかに過ごしてほしい。褥瘡などができないようにしてほしい。', '排泄介助、体位変換、清潔保持を中心に24時間体制で支援', '{"goals": ["苦痛のない穏やかな生活の維持", "褥瘡予防と皮膚の健康維持"]}', '{"goals": ["定時の体位変換を確実に実施", "毎日の清拭で清潔を保つ"]}', NULL, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000001005', '00000000-0000-0000-0000-000000000405', '00000000-0000-0000-0000-000000000101', '杖歩行が可能で比較的自立度が高い。元教師で知的活動への意欲が高い。毎日の散歩が日課。', '健康的な生活を続けてほしい。散歩を安全に楽しんでほしい。', '外出同行を中心に、自立支援と安全確保を両立', '{"goals": ["健康的な生活習慣の維持", "安全な外出活動の継続"]}', '{"goals": ["週2回の散歩同行を継続", "地域の活動に月1回参加"]}', NULL, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  current_situation = EXCLUDED.current_situation,
  family_wishes = EXCLUDED.family_wishes,
  main_support = EXCLUDED.main_support,
  long_term_goals = EXCLUDED.long_term_goals,
  short_term_goals = EXCLUDED.short_term_goals,
  pdf_url = EXCLUDED.pdf_url,
  updated_at = NOW();

-- コミット
COMMIT;

-- =============================================
-- データ確認用クエリ
-- =============================================
-- SELECT 'care_levels' as table_name, COUNT(*) as count FROM care_levels
-- UNION ALL SELECT 'visit_reasons', COUNT(*) FROM visit_reasons
-- UNION ALL SELECT 'goal_templates', COUNT(*) FROM goal_templates
-- UNION ALL SELECT 'facilities', COUNT(*) FROM facilities WHERE id = '00000000-0000-0000-0000-000000000001'
-- UNION ALL SELECT 'staff', COUNT(*) FROM staff WHERE facility_id = '00000000-0000-0000-0000-000000000001'
-- UNION ALL SELECT 'clients', COUNT(*) FROM clients WHERE facility_id = '00000000-0000-0000-0000-000000000001'
-- UNION ALL SELECT 'service_types', COUNT(*) FROM service_types WHERE facility_id = '00000000-0000-0000-0000-000000000001'
-- UNION ALL SELECT 'service_items', COUNT(*) FROM service_items WHERE service_type_id IN (SELECT id FROM service_types WHERE facility_id = '00000000-0000-0000-0000-000000000001')
-- UNION ALL SELECT 'schedules', COUNT(*) FROM schedules WHERE facility_id = '00000000-0000-0000-0000-000000000001'
-- UNION ALL SELECT 'visit_records', COUNT(*) FROM visit_records WHERE client_id IN (SELECT id FROM clients WHERE facility_id = '00000000-0000-0000-0000-000000000001')
-- UNION ALL SELECT 'reports', COUNT(*) FROM reports WHERE client_id IN (SELECT id FROM clients WHERE facility_id = '00000000-0000-0000-0000-000000000001')
-- UNION ALL SELECT 'care_plans', COUNT(*) FROM care_plans WHERE client_id IN (SELECT id FROM clients WHERE facility_id = '00000000-0000-0000-0000-000000000001');
