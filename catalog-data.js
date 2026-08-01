// ============================================================
// CATALOG — Coffeex Akhalkalaki
// Цены — по фото стенда (первый источник). Places with price
// conflicts against newer promo-postere are commented explicitly.
// price: number  -> одна цена
// price: {cold,hot} -> лёд/жар цена разная
// photo: null -> нет фото, показываем emoji-заглушку (icon)
// Порядок категорий: кофе — первым (это кофейня), остальное — дальше.
// ============================================================

const CATALOG = [
  {
    id: 'espresso',
    name: 'Espresso Based',
    icon: '☕',
    items: [
      { id: 'espresso', name: 'Espresso', price: 2.5, photo: 'espresso.jpg' },
      { id: 'double-espresso', name: 'Double Espresso', price: 3.8, photo: 'espresso.jpg' },
      { id: 'americano', name: 'Americano', price: { cold: 3.5, hot: 3 }, photo: 'americano.jpg' },
      { id: 'choco-americano', name: 'Choco Americano', price: { cold: 4.5, hot: 4 }, photo: 'americano.jpg' },
      { id: 'cappuccino', name: 'Cappuccino', price: 3.5, photo: 'cappuccino.jpg' },
      { id: 'flat-white', name: 'Flat White', price: 4, photo: 'flat-white.jpg' },
      { id: 'raf-classic', name: 'Raf Classic', price: 5, photo: 'raf-classic.jpg' },
      { id: 'espresso-tonik', name: 'Espresso Tonik', desc: 'эспрессо, тоник, лёд', price: 6, photo: 'espresso-tonik.jpg', badge: 'new' },
      { id: 'bumble-coffee', name: 'Bumble Coffee', desc: 'кофе, молоко, мёд, карамель', price: 5, photo: 'bumble-coffee.jpg', badge: 'new' },
    ],
    addon: { id: 'any-syrup', name: 'Any Syrup', price: 0.5, icon: '🍯' }
  },
  {
    id: 'latte',
    name: 'Latte',
    icon: '🥛',
    items: [
      { id: 'latte', name: 'Latte', price: { cold: 4, hot: 3.5 }, photo: 'latte.jpg' },
      { id: 'latte-strawberry-dream', name: 'Latte Strawberry Dream', price: 5, photo: null, icon: '🍓' },
      { id: 'latte-irish-cream', name: 'Latte Irish Cream', price: 5, photo: 'latte.jpg' },
      { id: 'latte-tiramisu', name: 'Latte Tiramisu', price: 5, photo: 'oreo-banana-shake.jpg' },
      { id: 'latte-cinnamon', name: 'Latte Cinnamon', price: 5, photo: 'cappuccino.jpg' },
      { id: 'latte-coconut', name: 'Latte Coconut', price: 5, photo: 'pina-colada.jpg' },
      { id: 'latte-caramel', name: 'Latte Caramel', price: 5, photo: 'bumble-coffee.jpg' },
      { id: 'latte-cherry-chocolate', name: 'Latte Cherry in Chocolate', price: 5, photo: null, icon: '🍒' },
      { id: 'latte-vanilla-caramel', name: 'Latte Vanilla Caramel', price: 5, photo: 'raf-classic.jpg' },
      { id: 'latte-salted-caramel', name: 'Latte Salted Caramel', price: 5, photo: 'bumble-coffee.jpg' },
    ]
  },
  {
    id: 'coffeemix',
    name: 'Coffee Mix',
    icon: '🍫',
    items: [
      { id: 'oreo', name: 'Oreo', price: { cold: 4, hot: 3.5 }, photoCold: 'coffeemix-oreo-cold.jpg', photoHot: 'coffeemix-hot-1.jpg' },
      { id: 'nutella', name: 'Nutella', price: { cold: 4, hot: 3.5 }, photoCold: 'coffeemix-nutella-cold.jpg', photoHot: 'coffeemix-hot-2.jpg' },
      { id: 'bounty', name: 'Bounty', price: { cold: 3.5, hot: 3 }, photoCold: 'coffeemix-bounty-cold.jpg', photoHot: 'coffeemix-hot-3.jpg' },
      { id: 'kinder', name: 'Kinder', price: { cold: 4, hot: 3.5 }, photoCold: 'coffeemix-kinder-cold.jpg', photoHot: 'coffeemix-hot-1.jpg' },
      { id: 'snickers', name: 'Snickers', price: { cold: 3.5, hot: 3 }, photoCold: 'coffeemix-snickers-cold.jpg', photoHot: 'coffeemix-hot-2.jpg' },
      { id: 'kitkat', name: 'Kit Kat', price: { cold: 3.5, hot: 3 }, photoCold: 'coffeemix-kitkat-cold.jpg', photoHot: 'coffeemix-hot-3.jpg' },
    ]
  },
  {
    id: 'refreshers',
    name: 'Освежающие напитки',
    icon: '🍹',
    items: [
      { id: 'berry-pop', name: 'Berry Pop Fresh', desc: 'клубника, черника, малина', price: 5, photo: 'berry-pop-fresh.jpg', badge: 'new' },
      { id: 'strawberry-mojito', name: 'Клубничный мохито', desc: 'клубника, лайм, мята', price: 5, photo: 'strawberry-mojito.jpg', badge: 'new' },
      { id: 'cherry-mojito', name: 'Вишневый мохито', desc: 'вишня, лайм, мята', price: 5, photo: 'cherry-mojito.jpg', badge: 'new' },
      { id: 'blue-lagoon', name: 'Blue Lagoon', desc: 'ягодный микс, лайм, мята, блю курасао, содовая', price: 6, photo: 'blue-lagoon.jpg', badge: 'new' },
      { id: 'lava-lime', name: 'Lava Lime', desc: 'лайм, мята, лаймовый сироп, содовая', price: 6, photo: 'lava-lime.jpg', badge: 'new' },
      { id: 'kiwi-green-apple', name: 'Kiwi Green Apple', desc: 'киви, зелёное яблоко, сироп, лимон, содовая', price: 6, photo: 'kiwi-green-apple.jpg', badge: 'new' },
    ]
  },
  {
    id: 'fresh',
    name: 'Fresh',
    icon: '🍋',
    items: [
      { id: 'orange-fresh', name: 'Orange', desc: 'свежевыжатый апельсиновый фреш', price: 6, photo: null, icon: '🍊' },
      { id: 'mojito', name: 'Mojito', desc: 'лайм, мята, содовая', price: 5, photo: 'mojito.jpg' },
    ]
  },
  {
    id: 'made-in-coffeex',
    name: 'Made in Coffeex',
    icon: '⭐',
    items: [
      { id: 'orange-juice', name: 'Orange Juice', desc: 'фирменный апельсиновый', price: 6, photo: null, icon: '🍊' },
      { id: 'sunrise', name: 'Sunrise', desc: 'слоистый цитрусовый', price: 6, photo: null, icon: '🌅' },
      { id: 'banana-nutella', name: 'Banana Nutella', desc: 'банан, нутелла', price: 5, photo: null, icon: '🍌' },
    ]
  },
  {
    id: 'smoothie',
    name: 'Smoothie',
    icon: '🥤',
    items: [
      { id: 'banana-strawberry', name: 'Banana Strawberry', price: 5, photo: null, icon: '🍓' },
      { id: 'banana-kiwi', name: 'Banana Kiwi', price: 5, photo: null, icon: '🥝' },
    ]
  },
  {
    id: 'milkshake',
    name: 'Milkshake',
    icon: '🥛',
    items: [
      { id: 'banana-shake', name: 'Banana Shake', price: 5, photo: null, icon: '🍌' },
      { id: 'strawberry-shake', name: 'Strawberry Shake', price: 5, photo: null, icon: '🍓' },
      { id: 'oreo-banana-shake', name: 'Oreo Banana Shake', desc: 'банан, мороженое, печенье Oreo, молоко, сливки', price: 7, photo: 'oreo-banana-shake.jpg', badge: 'new' },
      { id: 'pina-colada', name: 'Pina Colada', desc: 'ананас, кокос, сливки', price: 7, photo: 'pina-colada.jpg', badge: 'new' },
    ]
  },
  {
    id: 'choco',
    name: 'Choco',
    icon: '🍫',
    items: [
      { id: 'chocolate', name: 'Chocolate', price: { cold: 2.5, hot: 2 }, photo: null, icon: '🍫' },
    ]
  },
  {
    id: '3in1',
    name: '3 in 1',
    icon: '☕',
    items: [
      { id: 'royal-armenia', name: 'Royal Armenia', price: { cold: 2.5, hot: 2 }, photo: null, icon: '☕' },
      { id: 'mac-coffee', name: 'Mac Coffee', price: { cold: 2.5, hot: 2 }, photo: null, icon: '☕' },
      { id: 'nescafe', name: 'Nescafe', price: { cold: 2.5, hot: 2 }, photo: null, icon: '☕' },
    ]
  },
];

// ============================================================
// FEATURED — "Новинки" и "Топ продаж", показываются рельсой сверху
// меню (до всех обычных категорий). Ссылаются на ТЕ ЖЕ товары по id
// — не дублируют их, чтобы корзина не путалась.
// ============================================================
const FEATURED_NEW = [
  { id: 'blue-lagoon' },
  { id: 'lava-lime' },
  { id: 'bumble-coffee' },
];
const FEATURED_TOP = [
  { id: 'mojito' },
  { id: 'banana-strawberry' },
  { id: 'latte', variant: 'cold', displayName: 'Ice Latte' },
];

// Плоский индекс id -> item (с указанием категории), для быстрого поиска в корзине/отчётах
const ITEM_INDEX = {};
CATALOG.forEach(cat => {
  cat.items.forEach(it => { ITEM_INDEX[it.id] = { ...it, categoryId: cat.id, categoryName: cat.name }; });
  if (cat.addon) ITEM_INDEX[cat.addon.id] = { ...cat.addon, categoryId: cat.id, categoryName: cat.name, isAddon: true };
});
