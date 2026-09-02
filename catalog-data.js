// ============================================================
// CATALOG — Coffeex Akhalkalaki
// Полностью пересобран под новый физический стенд меню (фото
// стенда — единственный источник цен/группировки/фото).
// price: number                    -> одна цена, без размеров
// price: {S,M,L}                   -> цена по размерам (не все три
//                                      размера обязательны — только
//                                      те, что есть на стенде)
// price: {hot:{S,M}, cold:{S,M}}   -> и HOT/ICE, и размер сразу
//                                      (сейчас только Coffee Mix)
// photo: null -> нет фото, показываем emoji-заглушку (icon)
// ============================================================

const CATALOG = [
  {
    id: 'classic-coffee',
    name: 'Classic Coffee',
    icon: '☕',
    items: [
      { id: 'espresso', name: 'Espresso', price: { S: 3 }, photo: 'classic-hot.jpg' },
      { id: 'double-espresso', name: 'Double Espresso', price: { S: 4 }, photo: 'classic-hot.jpg' },
      { id: 'americano', name: 'Americano', price: { S: 4 }, photo: 'classic-hot.jpg' },
      { id: 'double-americano', name: 'Double Americano', price: { S: 5 }, photo: 'classic-hot.jpg' },
      { id: 'cappuccino', name: 'Cappuccino', price: { S: 5, M: 6 }, photo: 'classic-hot.jpg' },
      { id: 'latte', name: 'Latte', price: { S: 5, M: 6 }, photo: 'classic-hot.jpg' },
      { id: 'flat-white', name: 'Flat White', price: { M: 6 }, photo: 'classic-hot.jpg' },
      { id: 'raf', name: 'Raf', price: { S: 6, M: 8 }, photo: 'classic-hot.jpg' },
      { id: 'ice-latte', name: 'Ice Latte', price: { S: 5, M: 6 }, photo: 'classic-ice.jpg' },
      { id: 'ice-americano', name: 'Ice Americano', price: { S: 4.5 }, photo: 'classic-ice.jpg' },
      { id: 'ice-flat-white', name: 'Ice Flat White', price: { S: 6.5 }, photo: 'classic-ice.jpg' },
    ]
  },
  {
    id: 'tea',
    name: 'Tea',
    icon: '🍵',
    items: [
      { id: 'black-tea', name: 'Black Tea', price: { S: 2, M: 3 }, photo: 'tea.jpg' },
      { id: 'green-tea', name: 'Green Tea', price: { S: 2, M: 3 }, photo: 'tea.jpg' },
      { id: 'fruit-tea', name: 'Fruit Tea', price: { S: 2, M: 3 }, photo: 'tea.jpg' },
    ]
  },
  {
    id: 'coffeemix',
    name: 'Coffee Mix',
    icon: '🍫',
    items: [
      { id: 'oreo', name: 'Oreo', price: { hot: { S: 4, M: 5 }, cold: { S: 5, M: 6 } }, photo: 'mix-oreo.jpg', badge: 'bestseller' },
      { id: 'kitkat', name: 'Kit Kat Crush', price: { hot: { S: 4.5, M: 6 }, cold: { S: 5, M: 7 } }, photo: 'mix-kitkat.jpg' },
      { id: 'nutella', name: 'Nutella Dream', price: { hot: { S: 4, M: 5 }, cold: { S: 5, M: 6 } }, photo: 'mix-nutella.jpg' },
      { id: 'bounty', name: 'Bounty', price: { hot: { S: 4, M: 5 }, cold: { S: 5, M: 6 } }, photo: 'mix-bounty.jpg' },
      { id: 'kinder', name: 'Kinder Cloud', price: { hot: { S: 4, M: 6 }, cold: { S: 5, M: 7 } }, photo: 'mix-kinder.jpg' },
      { id: 'snickers', name: 'Snickers Boom', price: { hot: { S: 4.5, M: 6 }, cold: { S: 5, M: 7 } }, photo: 'mix-snickers.jpg' },
    ]
  },
  {
    id: 'fresh',
    name: 'Fresh',
    icon: '🍊',
    items: [
      { id: 'orange-juice', name: 'Orange Juice', price: { S: 5, M: 6, L: 7 }, photo: 'fresh-orange.jpg' },
      { id: 'mojito', name: 'Mojito', price: { S: 5, M: 6, L: 7 }, photo: 'fresh-mojito.jpg', badge: 'bestseller' },
      { id: 'strawberry-mojito', name: 'Strawberry Mojito', price: { S: 5, M: 6, L: 7 }, photo: 'fresh-strawberry-mojito.jpg', badge: 'new' },
    ]
  },
  {
    id: 'fresh-coffee',
    name: 'Fresh Coffee',
    icon: '🧊',
    items: [
      { id: 'bumble-coffee', name: 'Bumble Coffee', price: { S: 5, M: 7, L: 10 }, photo: 'fc-bumble.jpg' },
      { id: 'cherry-bumble-coffee', name: 'Cherry Bumble Coffee', price: { S: 5, M: 7, L: 10 }, photo: 'fc-cherry-bumble.jpg' },
      { id: 'espresso-tonic', name: 'Espresso Tonic', price: { S: 5, M: 7, L: 10 }, photo: 'fc-espresso-tonic.jpg' },
    ]
  },
  {
    id: 'milkshakes',
    name: 'Milkshakes',
    icon: '🥤',
    items: [
      { id: 'milk-banana-strawberry', name: 'Banana Strawberry', price: { S: 7, M: 8, L: 10 }, photo: 'milk-banana-strawberry.jpg' },
      { id: 'milk-banana-raspberry', name: 'Banana Raspberry', price: { S: 7, M: 8, L: 10 }, photo: 'milk-banana-raspberry.jpg' },
      { id: 'milk-banana-nutella', name: 'Banana Nutella', price: { S: 5, M: 6, L: 7 }, photo: 'milk-banana-nutella.jpg', badge: 'bestseller' },
      { id: 'milk-oreo-banana', name: 'Oreo Banana', price: { S: 5, M: 6, L: 7 }, photo: 'milk-oreo-banana.jpg' },
    ]
  },
  {
    id: 'smoothie',
    name: 'Smoothie',
    icon: '🍓',
    items: [
      { id: 'smoothie-banana-strawberry', name: 'Banana Strawberry', price: { S: 6, M: 7, L: 8 }, photo: 'smoothie-banana-strawberry.jpg', badge: 'bestseller' },
      { id: 'smoothie-lime-strawberry', name: 'Lime Strawberry', price: { S: 8, M: 9, L: 10 }, photo: 'smoothie-lime-strawberry.jpg' },
      { id: 'smoothie-kiwi-green-apple', name: 'Kiwi Green Apple', price: { S: 6, M: 7, L: 8 }, photo: 'smoothie-kiwi-green-apple.jpg' },
      { id: 'smoothie-banana-kiwi', name: 'Banana Kiwi', price: { S: 6, M: 7, L: 8 }, photo: 'smoothie-banana-kiwi.jpg' },
    ]
  },
  {
    id: 'made-in-coffeex',
    name: 'Made in Coffeex',
    icon: '⭐',
    items: [
      { id: 'blue-lagoon', name: 'Blue Lagoon', price: { S: 6, M: 7, L: 8 }, photo: 'made-blue-lagoon.jpg', badge: 'new' },
      { id: 'lava-lime', name: 'Lava Lime', price: { S: 6, M: 7, L: 8 }, photo: 'made-lava-lime.jpg', badge: 'new' },
      { id: 'pina-colada', name: 'Pina Colada', price: { S: 7, M: 8, L: 9 }, photo: 'made-pina-colada.jpg', badge: 'new' },
    ]
  },
];

// ============================================================
// FEATURED — "Новинки" и "Топ продаж", рельса сверху меню.
// Строится автоматически из badge на товарах (badge:'new' /
// badge:'bestseller'), вручную ничего поддерживать не надо —
// один источник правды это CATALOG выше.
// ============================================================
const FEATURED_NEW = [];
const FEATURED_TOP = [];
CATALOG.forEach(cat => {
  cat.items.forEach(it => {
    if (it.badge === 'new') FEATURED_NEW.push({ id: it.id });
    if (it.badge === 'bestseller') FEATURED_TOP.push({ id: it.id });
  });
});

// Плоский индекс id -> item (с указанием категории), для быстрого поиска в корзине/отчётах
const ITEM_INDEX = {};
CATALOG.forEach(cat => {
  cat.items.forEach(it => { ITEM_INDEX[it.id] = { ...it, categoryId: cat.id, categoryName: cat.name }; });
  if (cat.addon) ITEM_INDEX[cat.addon.id] = { ...cat.addon, categoryId: cat.id, categoryName: cat.name, isAddon: true };
});
