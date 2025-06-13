# ステージングされたファイルのレビューツール

Amazon Q を使用してステージングされたファイルを自動レビューするツールです。

## 🚀 使用方法

### 基本的な使い方

```bash
# 1. ファイルをステージング
git add <ファイル名>

# 2. auto-reviewディレクトリに移動
cd auto-review

# 3. レビュー実行
npm run review
```

### 直接実行

```bash
# 1. ファイルをステージング
git add src/template-spec/route/rent/sp/ra_list/31C110_compact_searching_room_messge/

# 2. auto-reviewディレクトリに移動
cd auto-review

# 3. 直接実行
node review.js
```

## 📋 動作の流れ

1. **ステージングされた差分を取得** - `git diff --cached` でステージングされた変更を取得
2. **ステージングされたファイル一覧を取得** - `git diff --cached --name-only` でファイル名を取得
3. **Amazon Q でレビュー** - 差分内容をAmazon Q に送信してレビューを依頼
4. **結果を保存** - `review-result.md` に結果を保存（過去の結果は上書き）

## 📄 出力ファイル

### `review-result.md`
- レビュー結果が保存されます
- 実行するたびに内容が更新されます（過去の結果は消去）
- ステージングされた変更がない場合は「レビュー対象なし」と表示されます

## 🔍 レビュー観点

### homes-sp固有の観点
- A/Bテストメソッドの実装パターン
- 直アクセス判定の実装
- 賃貸居住用チェックの実装
- Twigテンプレートの変数受け渡し

### 一般的な観点
- バグの可能性
- セキュリティ問題
- パフォーマンス問題
- 可読性・保守性

## 📝 使用例

```bash
# ファイルをステージング
$ git add src/template-spec/route/rent/sp/ra_list/31C110_compact_searching_room_messge/

# レビュー実行
$ cd auto-review
$ npm run review

🔍 ステージングされたファイルのレビューを開始します...
📁 プロジェクトルート: /Users/username/Desktop/dev/puppeteer-auto-test
📋 ステージングされた差分を取得中...
📝 ステージングされた変更を検出しました。Amazon Q でレビューを実行中...
📄 ステージングされたファイル数: 3
  - src/template-spec/route/rent/sp/ra_list/31C110_compact_searching_room_messge/test_case_a.spec.js
  - src/template-spec/route/rent/sp/ra_list/31C110_compact_searching_room_messge/test_case_a.env.js
  - src/template-spec/route/rent/sp/ra_list/31C110_compact_searching_room_messge/README.md
🤖 Amazon Q にレビューを依頼中...
✅ レビューが完了しました。
📄 結果は /Users/username/Desktop/dev/puppeteer-auto-test/auto-review/review-result.md に保存されました。
```

## ⚠️ 前提条件

1. **Amazon Q CLI がインストールされていること**
   ```bash
   q --version
   ```

2. **プロジェクトルートがgitリポジトリであること**

3. **レビュー対象のファイルがステージングされていること**
   - `git add` でステージングされたファイルが対象
   - ステージングされていない変更は対象外

## 🐛 トラブルシューティング

### Amazon Q CLI が見つからない場合
```bash
# パスの確認
which q

# パスが通っていない場合
export PATH=$PATH:/path/to/q/cli
```

### ステージングされた変更がない場合
```bash
# 現在の状態を確認
git status

# ステージングされた差分があるか確認
git diff --cached

# ファイルをステージング
git add <ファイル名>
```

### 権限エラーが発生する場合
```bash
chmod +x review.js
```

## 📁 ファイル構成

```
auto-review/
├── review.js          # メインスクリプト
├── package.json       # npm設定
├── README.md         # このファイル
└── review-result.md  # レビュー結果（自動生成）
```

## 🔄 ワークフロー例

1. **コードを修正**
2. **ファイルをステージング**
   ```bash
   git add src/path/to/modified/file.js
   ```
3. **レビュー実行**
   ```bash
   cd auto-review && npm run review
   ```
4. **結果確認**
   ```bash
   cat review-result.md
   ```
5. **問題があれば修正してステージング**
   ```bash
   # 修正後
   git add src/path/to/modified/file.js
   ```
6. **再度レビュー実行**
7. **問題なければコミット**
   ```bash
   git commit -m "feat: 新機能を追加"
   ```

## 💡 ステージングのメリット

- **選択的レビュー**: 特定のファイルのみをレビュー対象にできる
- **新規ファイル対応**: 新規ファイルも`git add`でステージングすればレビュー対象
- **部分的変更**: `git add -p`で変更の一部のみをステージングしてレビュー可能
- **確実性**: ステージングされた内容のみがレビューされるため、意図しない変更の混入を防止

これで効率的で確実なコードレビューが可能になります！
