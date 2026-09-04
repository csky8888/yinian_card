/************************************************************
 * 一念測驗卡 Apps Script 範例（可直接整份貼上部署）
 * 部署：部署 → 新增部署作業 → 類型「網頁應用程式」
 *   執行身分：我 / 具有存取權的使用者：所有人
 * 改完程式記得：管理部署作業 → 版本 → 新版本
 ************************************************************/

// ===== 改這兩個 =====
var SPREADSHEET_ID = 'PUT_YOUR_SPREADSHEET_ID_HERE'; // 試算表網址中 /d/ 和 /edit 之間那段
var SHEET_NAME = 'leads';
var NOTIFY_EMAIL = 'csky8888@gmail.com';

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var data = {};
    // 前端用 text/plain 送 JSON，先 parse；失敗就改讀 e.parameter（表單格式相容）
    if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch (err) {}
    }
    if (e && e.parameter) {
      for (var k in e.parameter) {
        if (data[k] === undefined || data[k] === '') data[k] = e.parameter[k];
      }
    }

    var contact = String(data.contact || '').slice(0, 200) || '未填寫(訪客)';
    var type = String(data.type || data.resultType || 'unknown').slice(0, 50);
    var page = String(data.page || '').slice(0, 50);
    var url = String(data.url || '').slice(0, 500);
    var ua = String(data.ua || '').slice(0, 500);
    var date = data.date ? new Date(data.date) : new Date();

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['時間', 'contact', 'type', 'page', 'url', 'ua']);
    }
    sheet.appendRow([date, contact, type, page, url, ua]);

    // 通知信
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: '【一念測驗卡】新名單：' + contact,
      body: '時間：' + date + '\ncontact：' + contact + '\ntype：' + type +
            '\npage：' + page + '\nurl：' + url + '\nua：' + ua
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
