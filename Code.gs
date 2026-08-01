/**
 * COFFEEX — backend на Google Apps Script.
 *
 * НАСТРОЙКА (сделать один раз):
 * 1. Открой https://sheets.google.com → создай новую таблицу, назови "Coffeex Заказы".
 * 2. В первой строке (шапка) впиши ровно так, по столбцам A-M:
 *    OrderID | Timestamp | Source | Name | Phone | Fulfillment | Address | PickupTime | Items | Total | PaymentMethod | Status | Comment
 * 3. В таблице: Расширения → Apps Script.
 * 4. Удали весь код-заглушку, вставь целиком этот файл.
 * 5. Нажми "Развернуть" (Deploy) → "Новое развёртывание" → тип "Веб-приложение":
 *    - Выполнять как: Я (твой аккаунт)
 *    - У кого есть доступ: Все (Anyone)
 * 6. Скопируй ссылку, которая заканчивается на /exec.
 * 7. Вставь эту ссылку в js/app.js вместо PASTE_APPS_SCRIPT_EXEC_URL_HERE.
 *
 * Если Google попросит подтвердить доступ — это нормально, это твой личный скрипт.
 */

const SHEET_NAME = 'Sheet1'; // поменяй, если лист называется иначе

function getSheet_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = getSheet_();

  if (data.action === 'create') {
    sheet.appendRow([
      data.orderId,
      new Date(),
      data.source || '',
      data.name || '',
      data.phone || '',
      data.fulfillment || '',
      data.address || '',
      data.pickupTime || '',
      data.items || '',
      data.total || '',
      data.paymentMethod || '',
      data.status || 'new',
      data.comment || ''
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  }

  if (data.action === 'updateStatus') {
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === data.orderId) {
        sheet.getRange(i + 1, 12).setValue(data.status); // столбец L = Status
        break;
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unknown action' })).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const action = e.parameter.action;
  const sheet = getSheet_();
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const orders = rows.slice(1).map(r => {
    const o = {};
    headers.forEach((h, i) => { o[toCamel_(h)] = r[i]; });
    return o;
  }).filter(o => o.orderId); // пропускаем пустые строки

  if (action === 'list') {
    return ContentService.createTextOutput(JSON.stringify({ orders })).setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'report') {
    const period = e.parameter.period || 'today';
    const now = new Date();
    const filtered = orders.filter(o => {
      if (o.status === 'cancelled') return false;
      const ts = new Date(o.timestamp);
      if (period === 'today') {
        return ts.toDateString() === now.toDateString();
      } else {
        return ts.getMonth() === now.getMonth() && ts.getFullYear() === now.getFullYear();
      }
    });
    const total = filtered.reduce((s, o) => s + (parseFloat(o.total) || 0), 0);
    const cash = filtered.filter(o => o.paymentMethod === 'cash').reduce((s, o) => s + (parseFloat(o.total) || 0), 0);
    const transfer = filtered.filter(o => o.paymentMethod === 'transfer').reduce((s, o) => s + (parseFloat(o.total) || 0), 0);
    const barista = filtered.filter(o => o.source === 'barista').length;
    const predzakaz = filtered.filter(o => o.source === 'predzakaz').length;

    return ContentService.createTextOutput(JSON.stringify({
      periodLabel: period === 'today' ? 'за сегодня' : 'за этот месяц',
      total: total.toFixed(2), count: filtered.length,
      cash: cash.toFixed(2), transfer: transfer.toFixed(2),
      barista, predzakaz
    })).setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'loyalty') {
    const phone = (e.parameter.phone || '').replace(/\s+/g, '');
    const count = orders.filter(o => {
      const p = String(o.phone || '').replace(/\s+/g, '');
      return p && p === phone && o.status !== 'cancelled';
    }).length;
    return ContentService.createTextOutput(JSON.stringify({ count })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ error: 'unknown action' })).setMimeType(ContentService.MimeType.JSON);
}

function toCamel_(header) {
  const map = {
    'OrderID': 'orderId', 'Timestamp': 'timestamp', 'Source': 'source', 'Name': 'name',
    'Phone': 'phone', 'Fulfillment': 'fulfillment', 'Address': 'address', 'PickupTime': 'pickupTime',
    'Items': 'items', 'Total': 'total', 'PaymentMethod': 'paymentMethod', 'Status': 'status', 'Comment': 'comment'
  };
  return map[header] || header;
}
