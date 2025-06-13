#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');

class GitDiffReviewer {
    constructor() {
        this.projectRoot = path.resolve(__dirname, '..');
        this.reviewFile = path.join(__dirname, 'review-result.md');
    }

    async performReview() {
        console.log('🔍 ステージングされたファイルのレビューを開始します...');
        console.log(`📁 プロジェクトルート: ${this.projectRoot}`);
        
        try {
            // プロジェクトルートに移動
            console.log('📂 プロジェクトルートに移動中...');
            process.chdir(this.projectRoot);
            
            // ステージングされた差分を取得
            console.log('📋 ステージングされた差分を取得中...');
            const gitDiff = await this.getGitDiff();
            
            if (!gitDiff.trim()) {
                console.log('📋 ステージングされた変更がありません。レビュー対象がありません。');
                console.log('💡 ヒント: git add でファイルをステージングしてからレビューを実行してください');
                this.clearReviewFile();
                return;
            }

            console.log('📝 ステージングされた変更を検出しました。Amazon Q でレビューを実行中...');

            // ステージングされたファイル一覧を取得
            console.log('📄 ステージングされたファイル一覧を取得中...');
            const changedFiles = await this.getChangedFiles();
            console.log(`📄 ステージングされたファイル数: ${changedFiles.length}`);
            changedFiles.forEach(file => console.log(`  - ${file}`));
            
            // Amazon Q でレビュー実行
            console.log('🤖 Amazon Q でレビューを実行中...');
            const review = await this.runAmazonQReview(gitDiff, changedFiles);
            
            // レビュー結果を保存（過去の結果は上書き）
            console.log('💾 レビュー結果を保存中...');
            await this.saveReview(review, changedFiles);
            
            console.log('✅ レビューが完了しました。');
            console.log(`📄 結果は ${this.reviewFile} に保存されました。`);
            
        } catch (error) {
            console.error('❌ レビュー中にエラーが発生しました:');
            console.error('エラー詳細:', error.message);
            console.error('スタックトレース:', error.stack);
            
            // エラーの種類に応じたヒント
            if (error.message.includes('Git diff error')) {
                console.error('💡 ヒント: gitリポジトリ内で実行していることを確認してください');
            } else if (error.message.includes('Amazon Q process')) {
                console.error('💡 ヒント: Amazon Q CLI が正しくインストールされていることを確認してください');
                console.error('   確認コマンド: q --version');
            }
            
            process.exit(1);
        }
    }

    async getGitDiff() {
        return new Promise((resolve, reject) => {
            exec('git diff --cached', (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(`Git diff error: ${error.message}`));
                    return;
                }
                resolve(stdout);
            });
        });
    }

    async getChangedFiles() {
        return new Promise((resolve, reject) => {
            exec('git diff --cached --name-only', (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(`Git diff --name-only error: ${error.message}`));
                    return;
                }
                const files = stdout.trim().split('\n').filter(file => file.length > 0);
                resolve(files);
            });
        });
    }

    async runAmazonQReview(gitDiff, changedFiles) {
        return new Promise((resolve, reject) => {
            // Amazon Q CLI の存在確認
            exec('which q', (error, stdout, stderr) => {
                if (error) {
                    reject(new Error('Amazon Q CLI が見つかりません。インストールされていることを確認してください。'));
                    return;
                }
                
                const prompt = `以下のステージングされた変更をレビューしてください。homes-spプロジェクトのコードレビューとして、以下の観点でチェックしてください：

## レビュー観点

### 1. **バグの可能性**
- 変数名の不一致・タイポ
- null/undefined チェック漏れ
- 条件分岐の論理エラー
- 配列・オブジェクトのアクセスエラー

### 2. **homes-sp固有の規約遵守**
- A/Bテストメソッドの実装パターン
- 直アクセス判定の実装
- 賃貸居住用チェックの実装
- Twigテンプレートの変数受け渡し
- コメントの記載方法（A/Bテスト番号とタイトル）

### 3. **Symfony/Twig規約**
- DIコンテナの適切な使用
- Twigテンプレートの継承・include
- ルーティング設定
- バリデーション設定

### 4. **フロントエンド**
- CSS/SCSSの命名規則（BEM準拠）
- JavaScript の実装
- レスポンシブ対応

### 5. **セキュリティ**
- XSS対策（エスケープ処理）
- 個人情報の取り扱い
- SQLインジェクション対策

### 6. **パフォーマンス**
- 不要な処理の重複
- データベースクエリの最適化
- キャッシュの適切な使用

### 7. **可読性・保守性**
- 複雑な条件分岐の簡素化
- マジックナンバーの定数化
- 関数の責務分離
- 適切な変数名・関数名

---

**ステージングされたファイル:** ${changedFiles.join(', ')}

**ステージングされた変更:**
\`\`\`diff
${gitDiff}
\`\`\`

---

**レビュー結果を以下の形式でプレーンテキスト（色付けなし）で出力してください：**

## 🔍 レビュー結果

### ✅ 良い点
- [良い実装や改善点があれば記載]

### ❌ 重要な問題（修正必須）
- [バグや重大な問題があれば記載]

### ⚠️ 改善推奨
- [改善した方が良い点があれば記載]

### 💡 提案・コメント
- [その他の提案やコメントがあれば記載]

### 🔧 修正例
- [具体的な修正例があれば記載]

問題がない場合は「問題なし」と記載してください。
重要：出力にはANSIカラーコードを含めないでください。`;

                console.log('🤖 Amazon Q にレビューを依頼中...');

                // Amazon Q CLI を実行（カラー出力を無効化）
                const qProcess = spawn('q', ['chat'], {
                    stdio: ['pipe', 'pipe', 'pipe'],
                    env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' }
                });

                let output = '';
                let errorOutput = '';

                qProcess.stdout.on('data', (data) => {
                    output += data.toString();
                });

                qProcess.stderr.on('data', (data) => {
                    errorOutput += data.toString();
                });

                qProcess.on('close', (code) => {
                    if (code !== 0) {
                        reject(new Error(`Amazon Q process exited with code ${code}. Error: ${errorOutput}`));
                        return;
                    }
                    // ANSIカラーコードを除去
                    const cleanOutput = this.stripAnsiCodes(output);
                    resolve(cleanOutput);
                });

                qProcess.on('error', (error) => {
                    reject(new Error(`Failed to start Amazon Q process: ${error.message}`));
                });

                // プロンプトを送信
                try {
                    qProcess.stdin.write(prompt);
                    qProcess.stdin.end();
                } catch (writeError) {
                    reject(new Error(`Failed to write to Amazon Q process: ${writeError.message}`));
                }
            });
        });
    }

    // ANSIカラーコードを除去するヘルパーメソッド
    stripAnsiCodes(text) {
        // ANSI escape sequences を除去
        return text.replace(/\x1b\[[0-9;]*m/g, '');
    }

    clearReviewFile() {
        const emptyContent = `# ステージングされたファイルのレビュー結果

現在レビュー対象のステージングされた変更はありません。

**使用方法:**
1. \`git add <ファイル名>\` でファイルをステージング
2. \`node auto-review/review.js\` でレビュー実行

---
*最終更新: ${new Date().toISOString()}*
`;
        fs.writeFileSync(this.reviewFile, emptyContent);
        console.log('📄 レビューファイルをクリアしました。');
    }

    async saveReview(review, changedFiles) {
        const timestamp = new Date().toISOString();
        const reviewContent = `# ステージングされたファイルのレビュー結果

**レビュー実行時刻:** ${timestamp}

## 📄 ステージングされたファイル
${changedFiles.map(file => `- \`${file}\``).join('\n')}

---

${review}

---
*Amazon Q による自動レビュー結果*
`;

        fs.writeFileSync(this.reviewFile, reviewContent);
        console.log(`📄 レビュー結果を保存しました: ${this.reviewFile}`);
    }
}

// メイン実行部分
if (require.main === module) {
    const reviewer = new GitDiffReviewer();
    reviewer.performReview().catch(console.error);
}

module.exports = GitDiffReviewer;
