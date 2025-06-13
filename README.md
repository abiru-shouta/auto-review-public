# Amazon Q Git差分レビューツール

Amazon Q を使用してgit差分を自動レビューするツールです。

## 🚀 使用方法

### 基本的な使い方

```bash
# auto-reviewディレクトリに移動
cd auto-review

# レビュー実行
npm run review
```

### 直接実行

```bash
# auto-reviewディレクトリに移動
cd auto-review

# 直接実行
node review.js
```

## 📋 動作の流れ

1. **git差分を取得** - `git diff` で未コミットの変更を取得
2. **変更ファイル一覧を取得** - `git diff --name-only` で変更されたファイル名を取得
3. **Amazon Q でレビュー** - 差分内容をAmazon Q に送信してレビューを依頼
4. **結果を保存** - `review-result.md` に結果を保存（過去の結果は上書き）

## 📄 出力ファイル

### `review-result.md`
- レビュー結果が保存されます
- 実行するたびに内容が更新されます（過去の結果は消去）
- 差分がない場合は「レビュー対象なし」と表示されます

## 🔍 レビュー観点

### 一般的な観点
- **バグの可能性**: 変数名の不一致、null/undefinedチェック漏れ
- **コーディング規約**: 命名規則、コメント、フォーマット
- **フレームワーク規約**: 使用フレームワークの規約遵守
- **セキュリティ**: XSS対策、SQLインジェクション対策
- **パフォーマンス**: 不要な処理、クエリ最適化
- **可読性・保守性**: 複雑な条件分岐の簡素化

### 自動適応
Amazon Q が差分内容から自動的に：
- 言語を判定
- フレームワークを認識
- 適切なレビュー観点を適用

## 📝 使用例

```bash
$ cd auto-review
$ npm run review

🔍 Git差分レビューを開始します...
📁 プロジェクトルート: /path/to/your/project
📝 差分を検出しました。Amazon Q でレビューを実行中...
📄 変更ファイル数: 2
  - src/components/Header.jsx
  - src/utils/validation.js
🤖 Amazon Q にレビューを依頼中...
✅ レビューが完了しました。
📄 結果は review-result.md に保存されました。
```

## ⚠️ 前提条件

1. **Amazon Q CLI がインストールされていること**
   ```bash
   q --version
   ```

2. **プロジェクトルートがgitリポジトリであること**

3. **レビュー対象の変更がgit差分として存在すること**
   - `git add` する前の変更が対象
   - コミット済みの変更は対象外

## 🐛 トラブルシューティング

### Amazon Q CLI が見つからない場合
```bash
# パスの確認
which q

# パスが通っていない場合
export PATH=$PATH:/path/to/q/cli
```

### git差分がない場合
```bash
# 現在の状態を確認
git status

# 差分があるか確認
git diff
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
2. **レビュー実行**
   ```bash
   cd auto-review && npm run review
   ```
3. **結果確認**
   ```bash
   cat review-result.md
   ```
4. **問題があれば修正**
5. **再度レビュー実行**
6. **問題なければコミット**
   ```bash
   git add .
   git commit -m "fix: レビュー指摘事項を修正"
   ```

## 📦 他のプロジェクトでの使用

このツールは完全にポータブルです：

```bash
# 他のプロジェクトにコピー
cp -r auto-review /path/to/other/project/

# すぐに使用可能
cd /path/to/other/project/auto-review
npm run review
```

## 🎯 対応言語・フレームワーク

- **PHP**: Laravel, Symfony, CakePHP
- **JavaScript**: React, Vue, Node.js, Express
- **Python**: Django, Flask, FastAPI
- **Ruby**: Rails, Sinatra
- **Java**: Spring Boot, Spring MVC
- **Go**: Gin, Echo
- **その他**: Rust, C#, TypeScript など

Amazon Q が自動的に言語とフレームワークを判定し、適切なレビューを行います。

## 📄 ライセンス

MIT License

## 🤝 貢献

プルリクエストやイシューの報告を歓迎します！
