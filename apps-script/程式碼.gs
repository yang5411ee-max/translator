/**
 * 雙向即時翻譯：翻譯服務（給 GitHub 上的網頁呼叫）
 * 網頁放在 GitHub Pages（Apps Script 網頁的框架不開放麥克風，不能直接收音），這裡只負責翻譯。
 *
 * 呼叫：GET 部署網址?k=金鑰&q=文字&from=zh-TW&to=id  →  {"t":"譯文"}，失敗時 {"error":"…"}
 * 部署：網頁應用程式；執行身分「我」；誰可以存取「任何人」（網頁不用登入就能呼叫，靠金鑰擋掉別人）。
 * 金鑰：改 KEY 後，手機要用新的「網址#k=新金鑰」連結開一次。
 * 配額：翻譯每天 5,000 次（個人 Google 帳號）。
 */
const KEY = 'YOUR_KEY';

function doGet(e) {
  const p = (e && e.parameter) || {};
  let out;
  if (!p.k || p.k !== KEY) {
    out = { error: 'key' };
  } else {
    try {
      out = { t: translate(p.q, p.from, p.to) };
    } catch (err) {
      out = { error: String((err && err.message) || err).slice(0, 200) };
    }
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * 翻譯一句話。
 * @param {string} text 要翻譯的文字
 * @param {string} from 來源語言（Google 翻譯代碼，例：zh-TW、id、vi、en；空白＝自動判斷）
 * @param {string} to   目標語言
 * @return {string} 譯文
 */
function translate(text, from, to) {
  text = String(text || '').trim().slice(0, 2000);
  if (!text) return '';
  if (from && from === to) return text;
  return LanguageApp.translate(text, from || '', to);
}

/** 在編輯器選這個函式按「執行」，可先確認翻譯正常（結果在執行記錄）。 */
function testTranslate() {
  Logger.log(translate('今天我們來看看浴室的空間夠不夠放洗澡椅', 'zh-TW', 'id'));
}
