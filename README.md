# 🧠 脳トレバトル

一般常識クイズとIQテストで，仲間内でランキングを競うスマホ向けサイトです．

- 一般常識クイズ：69問からランダム10問，1問15秒．正解で100点＋残り秒数×10点
- IQテスト：38問から難易度別に5問ずつ計15問，1問45秒．正解数とスピードから推定IQ（70〜150）を算出
- ランキング：名前ごとの自己ベストで順位付け（Googleスプレッドシートに保存）

## ファイル構成

| ファイル | 内容 |
| --- | --- |
| `index.html` | サイト本体 |
| `questions.js` | 問題データ（自由に追加・編集OK） |
| `config.js` | ランキング保存先URLの設定 |
| `gas/Code.gs` | ランキング保存用の Google Apps Script |

## 公開手順

### 1. GitHubにアップロード

1. GitHubで新しいリポジトリ（例：`brain-battle`）を **Public** で作成
2. 「uploading an existing file」から `index.html`，`questions.js`，`config.js`，`README.md`，`gas` フォルダをドラッグ＆ドロップして Commit
3. リポジトリの **Settings → Pages** で，Branch を `main` / `(root)` にして Save
4. 1〜2分後に `https://<ユーザー名>.github.io/brain-battle/` で開ける

この時点では，ランキングは各自の端末の中だけで保存されます．

### 2. 共有ランキングを有効にする（約5分）

1. Googleスプレッドシートを新規作成（名前は何でもOK）
2. メニューの **拡張機能 → Apps Script** を開く
3. 最初からある `function myFunction() {}` を消して，`gas/Code.gs` の中身を全部貼り付けて保存
4. 右上の **デプロイ → 新しいデプロイ**
   - 種類の選択（歯車）→ **ウェブアプリ**
   - 次のユーザーとして実行：**自分**
   - アクセスできるユーザー：**全員**
   - 「デプロイ」→ Googleアカウントの承認画面が出たら許可（「安全ではないページ」と出たら「詳細」→「〜に移動」）
5. 表示された **ウェブアプリのURL**（`https://script.google.com/macros/s/.../exec`）をコピー
6. GitHubで `config.js` を開き，鉛筆アイコンで編集して URL を貼り付けて Commit

```js
const RANKING_API_URL = 'https://script.google.com/macros/s/xxxxxxxx/exec';
```

これで全員のスコアがスプレッドシートの `scores` シートに記録され，サイトのランキングに表示されます．
記録を消したいときはスプレッドシートの行を直接削除すればOKです．

> Apps Script のコードを書き換えたときは「デプロイ → デプロイを管理 → 編集 → バージョン：新バージョン」で更新してください（URLは変わりません）．

## 問題の追加

`questions.js` に1行足すだけです．

```js
{ q: "問題文", a: "正解", w: ["不正解1", "不正解2", "不正解3"], e: "解説" },
```

IQテストの問題には難易度 `lv: 1〜3` を付けてください．
