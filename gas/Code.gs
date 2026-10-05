// 脳トレバトル ランキング保存用 Google Apps Script
// スプレッドシートの「拡張機能 → Apps Script」に貼り付けてデプロイしてください．

const SHEET_NAME = 'scores';
const MODES = ['general', 'iq'];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['日時', 'モード', '名前', 'スコア', '正解数', '問題数', 'タイム(秒)']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ランキング取得：?mode=general または ?mode=iq
function doGet(e) {
  const mode = (e && e.parameter && e.parameter.mode) || '';
  const values = getSheet_().getDataRange().getValues().slice(1);
  const rows = values
    .filter(function (r) { return !mode || r[1] === mode; })
    .map(function (r) {
      return {
        date: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
        mode: r[1],
        name: String(r[2]),
        score: Number(r[3]),
        correct: Number(r[4]),
        total: Number(r[5]),
        time: Number(r[6]),
      };
    });
  return json_({ ok: true, rows: rows });
}

// スコア登録
function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (MODES.indexOf(d.mode) < 0) throw new Error('bad mode');
    let name = String(d.name || '').trim().slice(0, 12);
    if (!name) throw new Error('no name');
    // 数式として解釈されないようにする
    if (/^[=+\-@]/.test(name)) name = "'" + name;
    const score = Math.max(0, Math.min(99999, Math.round(Number(d.score) || 0)));
    const correct = Math.max(0, Math.min(100, Math.round(Number(d.correct) || 0)));
    const total = Math.max(0, Math.min(100, Math.round(Number(d.total) || 0)));
    const time = Math.max(0, Math.min(9999, Math.round((Number(d.time) || 0) * 10) / 10));

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      getSheet_().appendRow([new Date(), d.mode, name, score, correct, total, time]);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}
