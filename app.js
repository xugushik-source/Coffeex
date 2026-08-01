// ============================================================
// CONFIG — поменять после деплоя (см. README)
// ============================================================
const WHATSAPP_NUMBER = '995568110777'; // Люси, хозяйка Coffeex
const SHEETS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyX142Any4XtzxrJhP5NGKp-vDmFMsHiXfZgPA-L8DMkjeNfHJuxS7w6JuuztjuSsFT/exec
';
const PAYMENT_LINK_TEXT = 'Перевод на счёт Арутюна (временно, потом поменяем на счёт Coffeex):\nTBC: XXXX XXXX XXXX XXXX\nBOG: XXXX XXXX XXXX XXXX';
const DISCOUNT_MIN_TOTAL = 15; // от скольки лари включается скидка
const DISCOUNT_RATE = 0.10;    // 10%
const LOYALTY_CYCLE = 6;       // 5 покупок -> 6-я бесплатно

// ============================================================
// STATE
// ============================================================
const carts = {
  barista: {},   // id(+variant) -> {name, price, qty, variant}
  predzakaz: {}
};
let payMethod = { barista: 'cash', predzakaz: 'cash' };
let predzakazPaidClicked = false;

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  renderCatalog('catalog-barista', 'barista');
  renderCatalog('catalog-predzakaz', 'predzakaz');
  buildCatPills('barista');
  buildCatPills('predzakaz');
  loadSavedCustomer();
  updateCartBar('barista');
  updateCartBar('predzakaz');
  updateOrderPanel('barista');
  updateOrderPanel('predzakaz');
});

// ============================================================
// TABS
// ============================================================
function showMainTab(tabId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + tabId).classList.add('active');
  document.querySelectorAll('.main-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + tabId).classList.add('active');
  if (tabId === 'board') loadOrderBoard();
}

function buildCatPills(scope) {
  const wrap = document.getElementById('pills-' + scope);
  if (!wrap) return;
  wrap.innerHTML = '';
  CATALOG.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.className = 'cat-pill' + (i === 0 ? ' active' : '');
    btn.innerHTML = cat.icon + ' ' + cat.name;
    btn.onclick = function () {
      document.getElementById('cat-' + scope + '-' + cat.id).scrollIntoView({ behavior: 'smooth', block: 'start' });
      wrap.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
    };
    wrap.appendChild(btn);
  });
}

// ============================================================
// CATALOG RENDERING
// ============================================================
function renderCatalog(containerId, scope) {
  const root = document.getElementById(containerId);
  if (!root) return; // этой вкладки нет на этой странице — и это нормально
  root.innerHTML = '';

  if (FEATURED_NEW.length) root.appendChild(buildFeaturedSection('🆕 Новинки', 'new', FEATURED_NEW, scope));
  if (FEATURED_TOP.length) root.appendChild(buildFeaturedSection('🔥 Топ продаж', 'top', FEATURED_TOP, scope));

  CATALOG.forEach(cat => {
    const section = document.createElement('div');
    section.className = 'cat-section';
    section.id = 'cat-' + scope + '-' + cat.id;
    section.innerHTML = '<div class="cat-title">' + cat.icon + ' ' + cat.name + '</div>';
    const grid = document.createElement('div');
    grid.className = 'prod-grid';

    cat.items.forEach(item => {
      grid.appendChild(buildTile(item, scope));
    });
    section.appendChild(grid);

    if (cat.addon) {
      const addonTile = buildAddonTile(cat.addon, scope);
      section.appendChild(addonTile);
    }
    root.appendChild(section);
  });
}

function photoOrIcon(item, variant) {
  let src = null;
  if (item.price && typeof item.price === 'object') {
    src = variant === 'hot' ? (item.photoHot || item.photo) : (item.photoCold || item.photo);
  } else {
    src = item.photo;
  }
  if (src) return '<img src="' + src + '" alt="' + item.name + '" loading="lazy">';
  return (item.icon || '🥤');
}

function priceLabel(item, variant) {
  if (item.price && typeof item.price === 'object') {
    const v = variant === 'hot' ? item.price.hot : item.price.cold;
    return v.toFixed(2).replace(/\.00$/, '') + ' ₾';
  }
  return item.price.toFixed(2).replace(/\.00$/, '') + ' ₾';
}

function buildTile(item, scope) {
  const tile = document.createElement('div');
  tile.className = 'prod-tile';
  const isDual = item.price && typeof item.price === 'object';
  const defaultVariant = isDual ? 'cold' : null;
  tile.id = 'tile-' + scope + '-' + item.id;
  tile.dataset.tileKey = scope + ':' + item.id;
  tile.dataset.variant = defaultVariant || '';

  tile.innerHTML =
    '<div class="prod-photo" id="photo-' + scope + '-' + item.id + '">' + photoOrIcon(item, defaultVariant) + '</div>' +
    (item.badge ? '<div class="prod-badge">' + item.badge + '</div>' : '') +
    '<div class="prod-body">' +
    '<div class="prod-name">' + item.name + '</div>' +
    (isDual ? '<div class="hotcold-tag" id="hc-' + scope + '-' + item.id + '">' +
      '<div class="hc-btn sel" data-v="cold" onclick="setVariant(event,\'' + scope + '\',\'' + item.id + '\',\'cold\')">❄️ ' + item.price.cold + '₾</div>' +
      '<div class="hc-btn" data-v="hot" onclick="setVariant(event,\'' + scope + '\',\'' + item.id + '\',\'hot\')">🔥 ' + item.price.hot + '₾</div>' +
      '</div>' : '') +
    '<div class="prod-bottom">' +
    '<div class="prod-price" id="price-' + scope + '-' + item.id + '">' + (isDual ? '' : priceLabel(item, null)) + '</div>' +
    '<div class="prod-qty-badge" data-badge-key="' + scope + ':' + item.id + '" style="display:none">1</div>' +
    '</div></div>';

  tile.onclick = function (e) {
    if (e.target.closest('.hc-btn')) return;
    addToCart(scope, item, tile.dataset.variant || null);
  };
  return tile;
}

function buildAddonTile(addon, scope) {
  const div = document.createElement('div');
  div.className = 'prod-tile';
  div.dataset.tileKey = scope + ':' + addon.id;
  div.style.marginTop = '9px';
  div.innerHTML = '<div class="prod-body" style="display:flex;align-items:center;justify-content:space-between;padding:12px;">' +
    '<div>' + addon.icon + ' <b>' + addon.name + '</b> <span style="color:var(--mu);font-size:11px">+' + addon.price + '₾</span></div>' +
    '<div class="prod-qty-badge" data-badge-key="' + scope + ':' + addon.id + '" style="display:none">1</div></div>';
  div.onclick = function () { addToCart(scope, addon, null); };
  return div;
}

// ============================================================
// FEATURED RAILS — "Новинки" / "Топ продаж", горизонтальная
// прокрутка вверху меню. Ссылаются на существующие товары по id —
// корзина общая с обычной сеткой (см. syncItemUI).
// ============================================================
function buildFeaturedSection(title, kind, itemsSpec, scope) {
  const section = document.createElement('div');
  section.className = 'featured-section';
  section.innerHTML = '<div class="featured-title ' + kind + '">' + title + '</div>';
  const rail = document.createElement('div');
  rail.className = 'featured-rail';
  itemsSpec.forEach(spec => {
    const card = buildFeaturedCard(spec, scope, kind);
    if (card) rail.appendChild(card);
  });
  section.appendChild(rail);
  return section;
}

function buildFeaturedCard(spec, scope, kind) {
  const item = ITEM_INDEX[spec.id];
  if (!item) return null;
  const variant = spec.variant || (item.price && typeof item.price === 'object' ? 'cold' : null);
  const displayName = spec.displayName || item.name;

  const card = document.createElement('div');
  card.className = 'featured-card';
  card.dataset.tileKey = scope + ':' + item.id;

  card.innerHTML =
    '<div class="feat-photo">' + photoOrIcon(item, variant) +
    '<div class="featured-ribbon ' + kind + '">' + (kind === 'top' ? '🔥 ТОП' : '🆕 NEW') + '</div>' +
    '<div class="prod-qty-badge feat-qty-badge" data-badge-key="' + scope + ':' + item.id + '" style="display:none">1</div>' +
    '</div>' +
    '<div class="feat-name">' + displayName + '</div>' +
    '<div class="feat-price">' + priceLabel(item, variant) + '</div>';

  card.onclick = function () { addToCart(scope, item, variant); };
  return card;
}

function setVariant(e, scope, itemId, variant) {
  e.stopPropagation();
  const tile = document.getElementById('tile-' + scope + '-' + itemId);
  tile.dataset.variant = variant;
  const hc = document.getElementById('hc-' + scope + '-' + itemId);
  hc.querySelectorAll('.hc-btn').forEach(b => b.classList.toggle('sel', b.dataset.v === variant));
}

// ============================================================
// CART
// ============================================================
function cartKey(item, variant) {
  return item.id + (variant ? ':' + variant : '');
}

function addToCart(scope, item, variant) {
  const key = cartKey(item, variant);
  const cart = carts[scope];
  const unitPrice = (item.price && typeof item.price === 'object') ? item.price[variant] : item.price;
  if (cart[key]) {
    cart[key].qty += 1;
  } else {
    cart[key] = { id: item.id, name: item.name + (variant ? (variant === 'hot' ? ' (горячий)' : ' (холодный)') : ''), price: unitPrice, qty: 1, isAddon: !!item.isAddon };
  }
  syncItemUI(scope, item.id);
  updateCartBar(scope);
  updateOrderPanel(scope);
}

// Обновляет ВСЕ визуальные представления товара на странице (обычная
// плитка в категории + карточка в рельсе "Новинки"/"Топ", если товар
// показан там тоже) — иначе счётчик будет расходиться между ними.
function syncItemUI(scope, baseId) {
  const cart = carts[scope];
  let total = 0;
  Object.keys(cart).forEach(k => { if (k.split(':')[0] === baseId) total += cart[k].qty; });
  const has = total > 0;
  document.querySelectorAll('[data-badge-key="' + scope + ':' + baseId + '"]').forEach(b => {
    b.textContent = total;
    b.style.display = has ? 'flex' : 'none';
  });
  document.querySelectorAll('[data-tile-key="' + scope + ':' + baseId + '"]').forEach(t => {
    t.classList.toggle('in-cart', has);
  });
}

function changeCartQty(scope, key, delta) {
  const cart = carts[scope];
  if (!cart[key]) return;
  cart[key].qty += delta;
  if (cart[key].qty <= 0) {
    delete cart[key];
  }
  const baseId = key.split(':')[0];
  syncItemUI(scope, baseId);
  updateCartBar(scope);
  updateOrderPanel(scope);
}

function clearCart(scope) {
  carts[scope] = {};
  document.querySelectorAll('[data-badge-key^="' + scope + ':"]').forEach(b => b.style.display = 'none');
  document.querySelectorAll('[data-tile-key^="' + scope + ':"]').forEach(t => t.classList.remove('in-cart'));
  updateCartBar(scope);
  updateOrderPanel(scope);
}

function cartTotal(scope) {
  return Object.values(carts[scope]).reduce((s, l) => s + l.price * l.qty, 0);
}
function cartCount(scope) {
  return Object.values(carts[scope]).reduce((s, l) => s + l.qty, 0);
}
function getCartCalc(scope) {
  const subtotal = cartTotal(scope);
  const qualifies = subtotal >= DISCOUNT_MIN_TOTAL;
  const discount = qualifies ? Math.round(subtotal * DISCOUNT_RATE * 100) / 100 : 0;
  const total = Math.round((subtotal - discount) * 100) / 100;
  return { subtotal, discount, total, qualifies };
}

function updateCartBar(scope) {
  const bar = document.getElementById('cartbar-' + scope);
  if (!bar) return;
  const count = cartCount(scope);
  const calc = getCartCalc(scope);
  bar.classList.toggle('show', count > 0);
  document.getElementById('cartbar-lbl-' + scope).textContent = count + ' поз.' + (calc.qualifies ? ' · 🎉-10%' : '');
  document.getElementById('cartbar-sum-' + scope).textContent = calc.total.toFixed(2).replace(/\.00$/, '');
}

function scrollToOrderPanel(scope) {
  document.getElementById('orderpanel-' + scope).scrollIntoView({ behavior: 'smooth' });
}

function updateOrderPanel(scope) {
  const panel = document.getElementById('orderlines-' + scope);
  if (!panel) return;
  const cart = carts[scope];
  const keys = Object.keys(cart);
  if (keys.length === 0) {
    panel.innerHTML = '<div class="empty-hint">Пока пусто — нажми на фото напитка выше</div>';
  } else {
    panel.innerHTML = keys.map(k => {
      const l = cart[k];
      return '<div class="order-line">' +
        '<div class="order-line-name">' + l.name + '</div>' +
        '<div class="order-line-qty">' +
        '<button class="qty-btn" onclick="changeCartQty(\'' + scope + '\',\'' + k + '\',-1)">−</button>' +
        '<b>' + l.qty + '</b>' +
        '<button class="qty-btn" onclick="changeCartQty(\'' + scope + '\',\'' + k + '\',1)">+</button>' +
        '</div>' +
        '<div class="order-line-price">' + (l.price * l.qty).toFixed(2).replace(/\.00$/, '') + '₾</div>' +
        '</div>';
    }).join('');
  }
  const calc = getCartCalc(scope);
  const totalEl = document.getElementById('ordertotal-' + scope);
  if (totalEl) totalEl.textContent = calc.total.toFixed(2).replace(/\.00$/, '');
  const discRow = document.getElementById('discount-row-' + scope);
  if (discRow) {
    discRow.style.display = calc.qualifies ? 'block' : 'none';
    const discAmt = document.getElementById('discount-amt-' + scope);
    if (discAmt) discAmt.textContent = calc.discount.toFixed(2).replace(/\.00$/, '');
  }
}

// ============================================================
// PAYMENT METHOD SELECT
// ============================================================
function selectPay(scope, method) {
  payMethod[scope] = method;
  document.getElementById('pay-cash-' + scope).classList.toggle('sel', method === 'cash');
  document.getElementById('pay-transfer-' + scope).classList.toggle('sel', method === 'transfer');
  const linkBox = document.getElementById('paylink-' + scope);
  if (linkBox) linkBox.style.display = method === 'transfer' ? 'block' : 'none';
}

// ============================================================
// SAVED CUSTOMER DATA (localStorage — работает только на реальном
// сайте после деплоя, не в превью-песочнице Claude)
// ============================================================
function loadSavedCustomer() {
  try {
    const saved = JSON.parse(localStorage.getItem('coffeex_customer') || '{}');
    if (saved.name) document.getElementById('pz-name').value = saved.name;
    if (saved.phone) document.getElementById('pz-phone').value = saved.phone;
  } catch (e) { /* localStorage недоступен (например, в превью) — просто не подставляем */ }
}
function saveCustomer(name, phone) {
  try {
    localStorage.setItem('coffeex_customer', JSON.stringify({ name, phone }));
  } catch (e) { /* тихо игнорируем — не критично */ }
}

// ============================================================
// ORDER SUBMIT (общая функция для обеих вкладок)
// ============================================================
function generateOrderId() {
  return 'CX' + Date.now().toString().slice(-8);
}

function submitBaristaOrder() {
  const cart = carts.barista;
  if (Object.keys(cart).length === 0) { alert('Добавь напитки в заказ'); return; }
  const orderId = generateOrderId();
  const calc = getCartCalc('barista');
  const itemsText = Object.values(cart).map(l => l.name + (l.qty > 1 ? ' x' + l.qty : '') + ' — ' + (l.price * l.qty).toFixed(2) + '₾').join('\n');
  const discountLine = calc.qualifies ? ('\n🎉 Скидка -10% (заказ от 15₾): -' + calc.discount.toFixed(2) + '₾') : '';

  const order = {
    action: 'create',
    orderId, source: 'barista', name: '(на месте)', phone: '', fulfillment: 'pickup',
    address: '', pickupTime: 'сейчас', items: itemsText, total: calc.total.toFixed(2),
    paymentMethod: payMethod.barista, status: payMethod.barista === 'cash' ? 'paid' : 'new',
    comment: calc.qualifies ? ('скидка -10% применена, было ' + calc.subtotal.toFixed(2) + '₾') : ''
  };
  logOrder(order);

  const msg = '☕ *Заказ Coffeex* #' + orderId + '\n\n' + itemsText + discountLine + '\n\n💰 Итого: ' + calc.total.toFixed(2) + '₾\n💳 Оплата: ' + (payMethod.barista === 'cash' ? 'наличные' : 'перевод');
  window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
  clearCart('barista');
}

function submitPredzakaz() {
  const cart = carts.predzakaz;
  const name = document.getElementById('pz-name').value.trim();
  const phone = document.getElementById('pz-phone').value.trim();
  const pickupTime = document.getElementById('pz-time').value.trim();
  const err = document.getElementById('pz-err');

  if (!name || !phone) { err.style.display = 'block'; err.textContent = '⚠️ Заполни имя и телефон'; return; }
  if (Object.keys(cart).length === 0) { err.style.display = 'block'; err.textContent = '⚠️ Добавь напитки в предзаказ'; return; }
  err.style.display = 'none';

  saveCustomer(name, phone);

  const orderId = generateOrderId();
  const calc = getCartCalc('predzakaz');
  const itemsText = Object.values(cart).map(l => l.name + (l.qty > 1 ? ' x' + l.qty : '') + ' — ' + (l.price * l.qty).toFixed(2) + '₾').join('\n');
  const discountLine = calc.qualifies ? ('\n🎉 Скидка -10% (заказ от 15₾): -' + calc.discount.toFixed(2) + '₾') : '';

  const status = payMethod.predzakaz === 'cash' ? 'new' : (predzakazPaidClicked ? 'pending' : 'new');

  const order = {
    action: 'create', orderId, source: 'predzakaz', name, phone,
    fulfillment: 'pickup', address: '', pickupTime,
    items: itemsText, total: calc.total.toFixed(2), paymentMethod: payMethod.predzakaz,
    status, comment: calc.qualifies ? ('скидка -10% применена, было ' + calc.subtotal.toFixed(2) + '₾') : ''
  };
  logOrder(order);

  let msg = '☕ *Предзаказ Coffeex* #' + orderId + '\n\n👤 ' + name + '\n📞 ' + phone + '\n';
  msg += '🏠 Самовывоз, время: ' + (pickupTime || 'как можно скорее') + '\n';
  msg += '\n' + itemsText + discountLine + '\n\n💰 Итого: ' + calc.total.toFixed(2) + '₾\n💳 Оплата: ' + (payMethod.predzakaz === 'cash' ? 'наличные при получении' : 'перевод' + (predzakazPaidClicked ? ' (отмечено как оплачено, ждёт подтверждения)' : ''));

  window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');

  document.getElementById('pz-ok').style.display = 'block';
  document.getElementById('pz-ok').textContent = '✅ Предзаказ #' + orderId + ' отправлен!';
  clearCart('predzakaz');
  predzakazPaidClicked = false;
}

function markPredzakazPaidClicked() {
  predzakazPaidClicked = true;
  const btn = document.getElementById('btn-marked-paid');
  btn.textContent = '✅ Отмечено — подтвердим при получении';
  btn.disabled = true;
}

// ============================================================
// LOYALTY — счётчик "5 покупок -> 6-я бесплатно", источник правды —
// Google Таблица (не localStorage — иначе слетает при смене телефона).
// Пока таблица не подключена, виджет просто не показывается.
// ============================================================
function checkLoyalty() {
  const phoneInp = document.getElementById('pz-phone');
  const widget = document.getElementById('loyalty-widget');
  if (!phoneInp || !widget) return;
  const phone = phoneInp.value.trim();
  if (!phone || phone.length < 6) { widget.style.display = 'none'; return; }
  if (!SHEETS_ENDPOINT || SHEETS_ENDPOINT.indexOf('PASTE_') === 0) { widget.style.display = 'none'; return; }
  fetch(SHEETS_ENDPOINT + '?action=loyalty&phone=' + encodeURIComponent(phone))
    .then(r => r.json())
    .then(data => renderLoyalty(data.count || 0))
    .catch(() => { widget.style.display = 'none'; });
}

function renderLoyalty(count) {
  const widget = document.getElementById('loyalty-widget');
  const dotsEl = document.getElementById('loyalty-dots');
  if (!widget || !dotsEl) return;
  const progress = count % LOYALTY_CYCLE;
  let html = '';
  for (let i = 1; i < LOYALTY_CYCLE; i++) {
    const filled = i <= progress;
    html += '<div style="width:26px;height:26px;border-radius:50%;flex-shrink:0;background:' + (filled ? '#E31E24' : '#eee') + ';color:' + (filled ? 'white' : '#999') + ';display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;">' + i + '</div>';
  }
  const freeReady = progress === 0 && count > 0;
  html += '<div style="min-width:42px;height:26px;border-radius:13px;flex-shrink:0;padding:0 6px;background:' + (freeReady ? '#2E9E4C' : '#eee') + ';color:' + (freeReady ? 'white' : '#999') + ';display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:900;">FREE</div>';
  dotsEl.innerHTML = html;
  widget.style.display = 'block';
  const hint = document.getElementById('loyalty-hint');
  if (hint) hint.textContent = freeReady ? '🎉 Следующий кофе — бесплатно!' : ('Ещё ' + (LOYALTY_CYCLE - 1 - progress) + ' покупок(а) до бесплатного кофе');
}

// ============================================================
// GOOGLE SHEETS LOGGING (fire without blocking UI; no-op if
// endpoint not configured yet — see README)
// ============================================================
function logOrder(order) {
  if (!SHEETS_ENDPOINT || SHEETS_ENDPOINT.indexOf('PASTE_') === 0) {
    console.warn('SHEETS_ENDPOINT не настроен — заказ не сохранён в таблицу, только в WhatsApp.');
    return;
  }
  fetch(SHEETS_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(order)
  }).catch(err => console.error('Ошибка логирования в таблицу:', err));
}

// ============================================================
// ORDER BOARD
// ============================================================
function loadOrderBoard() {
  const root = document.getElementById('board-list');
  if (!SHEETS_ENDPOINT || SHEETS_ENDPOINT.indexOf('PASTE_') === 0) {
    root.innerHTML = '<div class="loading-hint">Таблица ещё не подключена (см. README) — доска заказов появится после настройки.</div>';
    return;
  }
  root.innerHTML = '<div class="loading-hint">Загрузка заказов…</div>';
  fetch(SHEETS_ENDPOINT + '?action=list')
    .then(r => r.json())
    .then(data => renderBoard(data.orders || []))
    .catch(err => { root.innerHTML = '<div class="loading-hint">Не удалось загрузить — проверь подключение.</div>'; console.error(err); });
}

function renderBoard(orders) {
  const root = document.getElementById('board-list');
  if (orders.length === 0) { root.innerHTML = '<div class="loading-hint">Заказов пока нет.</div>'; return; }
  root.innerHTML = orders.slice().reverse().map(o => {
    const statusClass = 'status-' + (o.status || 'new');
    return '<div class="board-order-card ' + statusClass + '">' +
      '<div class="boc-top"><div><div class="boc-name">' + (o.name || '—') + '</div><div class="boc-id">#' + o.orderId + '</div></div><div class="boc-time">' + (o.timestamp || '') + '</div></div>' +
      '<div class="boc-items">' + (o.items || '').replace(/\n/g, '<br>') + '</div>' +
      '<div class="boc-sum">' + o.total + '₾</div>' +
      '<div class="boc-badges">' +
      '<div class="boc-badge">' + (o.source === 'predzakaz' ? 'Предзаказ' : 'На месте') + '</div>' +
      '<div class="boc-badge">' + (o.paymentMethod === 'cash' ? '💵 нал' : '📲 перевод') + '</div>' +
      '<div class="boc-badge">🏠 самовывоз</div>' +
      '</div>' +
      '<div class="boc-actions">' +
      '<button class="boc-btn paid" onclick="updateOrderStatus(\'' + o.orderId + '\',\'paid\')">✅ Оплачено</button>' +
      '<button class="boc-btn cancel" onclick="updateOrderStatus(\'' + o.orderId + '\',\'cancelled\')">✕ Отмена</button>' +
      '</div>' +
      '</div>';
  }).join('');
}

function updateOrderStatus(orderId, status) {
  fetch(SHEETS_ENDPOINT, { method: 'POST', body: JSON.stringify({ action: 'updateStatus', orderId, status }) })
    .then(() => loadOrderBoard())
    .catch(err => console.error(err));
}

function filterBoard(status) {
  document.querySelectorAll('.board-filters .cat-pill').forEach(p => p.classList.remove('active'));
  event.target.classList.add('active');
  const cards = document.querySelectorAll('.board-order-card');
  cards.forEach(c => {
    c.style.display = (status === 'all' || c.classList.contains('status-' + status)) ? 'block' : 'none';
  });
}

// ============================================================
// REPORTS
// ============================================================
function loadReport(period) {
  const root = document.getElementById('report-result');
  if (!SHEETS_ENDPOINT || SHEETS_ENDPOINT.indexOf('PASTE_') === 0) {
    root.innerHTML = '<div class="loading-hint">Таблица ещё не подключена (см. README).</div>';
    return;
  }
  root.innerHTML = '<div class="loading-hint">Считаю…</div>';
  fetch(SHEETS_ENDPOINT + '?action=report&period=' + period)
    .then(r => r.json())
    .then(renderReport)
    .catch(err => { root.innerHTML = '<div class="loading-hint">Не удалось загрузить отчёт.</div>'; console.error(err); });
}

function renderReport(data) {
  const root = document.getElementById('report-result');
  root.innerHTML =
    '<div class="report-card">' +
    '<div class="report-big"><div class="report-big-num">' + (data.total || 0) + '₾</div><div class="report-big-lbl">' + (data.periodLabel || '') + '</div></div>' +
    '<div class="report-row"><div class="report-row-lbl">Заказов</div><div class="report-row-val">' + (data.count || 0) + '</div></div>' +
    '<div class="report-row"><div class="report-row-lbl">💵 Наличные</div><div class="report-row-val">' + (data.cash || 0) + '₾</div></div>' +
    '<div class="report-row"><div class="report-row-lbl">📲 Перевод</div><div class="report-row-val">' + (data.transfer || 0) + '₾</div></div>' +
    '<div class="report-row"><div class="report-row-lbl">На месте / предзаказ</div><div class="report-row-val">' + (data.barista || 0) + ' / ' + (data.predzakaz || 0) + '</div></div>' +
    '</div>';
}
