# UI設計ガイドライン

## UIライブラリ選定

### 採用: React Native Paper

| 項目 | 選定理由 |
|------|---------|
| ライブラリ | [React Native Paper](https://reactnativepaper.com/) |
| デザイン | Material Design 3 |
| Expo対応 | 完全対応 |
| Web対応 | react-native-web経由で対応 |

**選定理由:**
- フォーム入力が多い業務アプリに適した豊富なコンポーネント
- 安定性・ドキュメントが充実
- Material Design 3で洗練されたUI
- Expo + Next.js両対応でコード共有可能

**補助ライブラリ:**
- `react-native-safe-area-context`: セーフエリア対応
- `react-native-vector-icons`: アイコン
- `react-hook-form` + `zod`: フォームバリデーション
- `date-fns`: 日付処理

## カラースキーム

現行AppSheetの青系を踏襲しつつ、Material Design 3に最適化。

### Primary Colors

```
Primary:        #2196F3 (Blue 500) - メインアクション、ヘッダー
Primary Dark:   #1976D2 (Blue 700) - ステータスバー
Primary Light:  #BBDEFB (Blue 100) - 背景ハイライト
```

### Semantic Colors

```
Success:  #4CAF50 (Green)  - 完了、成功
Warning:  #FF9800 (Orange) - 注意、警告
Error:    #F44336 (Red)    - エラー、削除
Info:     #2196F3 (Blue)   - 情報
```

### Neutral Colors

```
Background:     #FAFAFA - 画面背景
Surface:        #FFFFFF - カード、モーダル
Text Primary:   #212121 - 本文
Text Secondary: #757575 - 補足テキスト
Divider:        #E0E0E0 - 区切り線
```

### Dark Mode（将来対応）

```
Background:     #121212
Surface:        #1E1E1E
Text Primary:   #FFFFFF
Text Secondary: #B0B0B0
```

## タイポグラフィ

### フォント

```
iOS:     San Francisco (システムデフォルト)
Android: Roboto (システムデフォルト)
Web:     'Noto Sans JP', sans-serif
```

### サイズ規定

| 用途 | サイズ | ウェイト |
|------|--------|---------|
| 画面タイトル | 20sp | Bold |
| セクション見出し | 16sp | SemiBold |
| 本文 | 14sp | Regular |
| 補足・ラベル | 12sp | Regular |
| ボタン | 14sp | Medium |

## スペーシング

8pxグリッドシステム採用。

```
xs:  4px   - アイコン内パディング
sm:  8px   - コンパクト要素間
md:  16px  - 標準要素間
lg:  24px  - セクション間
xl:  32px  - 大きなセクション間
```

## レスポンシブブレークポイント

| デバイス | 幅 | レイアウト |
|---------|-----|-----------|
| Mobile | < 600px | シングルカラム、ボトムナビ |
| Tablet | 600-1024px | 2カラム可、サイドナビ検討 |
| Desktop | > 1024px | マルチカラム、サイドナビ |

## コンポーネント設計原則

### 1. タッチターゲット

- 最小サイズ: 48x48dp（モバイル）
- ボタン間隔: 最低8dp

### 2. フォーム

- ラベルは入力フィールドの上に配置
- エラーメッセージはフィールド直下に赤字表示
- 必須項目は `*` マーク

### 3. リスト

- モバイル: カード形式（タップエリア大きく）
- デスクトップ: テーブル形式も可

### 4. ナビゲーション

- モバイル: ボトムナビゲーション（5項目以内）
- デスクトップ: サイドナビゲーション

## 画面別優先度

| 優先度 | 画面 | 理由 |
|--------|------|------|
| P0 | 記録入力 | 最も使用頻度が高い |
| P0 | 履歴一覧 | 記録確認・編集 |
| P1 | 利用者情報 | 利用者詳細確認 |
| P1 | スケジュール | 予定確認 |
| P2 | 印刷（帳票） | PDF生成 |
| P2 | 設定 | 管理機能 |

## アクセシビリティ

- コントラスト比: 4.5:1以上（WCAG AA）
- フォーカス状態の明示
- スクリーンリーダー対応（accessibilityLabel）
