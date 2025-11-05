import React, { useMemo, useState, useEffect } from 'react';
import { ShoppingBag, Package, Coins, Crown, Star } from 'lucide-react';

const RARITY_COLORS = {
  common: 'bg-slate-700 border-slate-500',
  epic: 'bg-indigo-700 border-indigo-500',
  legendary: 'bg-amber-700 border-amber-500',
  mythic: 'bg-fuchsia-700 border-fuchsia-500',
};

const RARITY_WEIGHTS = {
  common: 0.7,
  epic: 0.2,
  legendary: 0.08,
  mythic: 0.02,
};

const DEFAULT_CARDS = [
  { id: 'c-1', name: 'Blade Warden', rarity: 'common' },
  { id: 'c-2', name: 'Stormcaller', rarity: 'epic' },
  { id: 'c-3', name: 'Sunscale Dragon', rarity: 'legendary' },
  { id: 'c-4', name: 'Abyssal Oracle', rarity: 'mythic' },
  { id: 'c-5', name: 'Grove Sentinel', rarity: 'common' },
  { id: 'c-6', name: 'Voidrunner', rarity: 'epic' },
  { id: 'c-7', name: 'Crown Phoenix', rarity: 'legendary' },
  { id: 'c-8', name: 'Eternal Seraph', rarity: 'mythic' },
];

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}

export default function ShopSection({ onAddToCollection }) {
  const [coins, setCoins] = useLocalStorage('coins', 500);
  const [availableCards, setAvailableCards] = useLocalStorage('availableCards', DEFAULT_CARDS);
  const [chests] = useState([
    { id: 'ch-basic', name: 'Adventurer Chest', price: 50, icon: Package, description: 'Best value starter chest.' },
    { id: 'ch-royal', name: 'Royal Vault', price: 200, icon: Crown, description: 'Increased chance for legendary+.' },
  ]);

  const cardPoolByRarity = useMemo(() => {
    return availableCards.reduce((acc, c) => {
      acc[c.rarity] = acc[c.rarity] || [];
      acc[c.rarity].push(c);
      return acc;
    }, {});
  }, [availableCards]);

  function pickRarity() {
    const r = Math.random();
    let acc = 0;
    for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
      acc += weight;
      if (r <= acc) return rarity;
    }
    return 'common';
  }

  function openChest(type) {
    const cost = type === 'ch-royal' ? 200 : 50;
    if (coins < cost) return alert('Not enough coins.');
    setCoins(c => c - cost);

    // Slightly better odds for royal chest
    const boostedWeights = type === 'ch-royal'
      ? { common: 0.55, epic: 0.25, legendary: 0.15, mythic: 0.05 }
      : RARITY_WEIGHTS;

    const roll = () => {
      const r = Math.random();
      let acc = 0;
      for (const [rarity, weight] of Object.entries(boostedWeights)) {
        acc += weight;
        if (r <= acc) return rarity;
      }
      return 'common';
    };

    const rarity = roll();
    const pool = cardPoolByRarity[rarity] || availableCards;
    const pulled = pool[Math.floor(Math.random() * pool.length)];
    onAddToCollection(pulled);
    alert(`You pulled: ${pulled.name} (${rarity.toUpperCase()})`);
  }

  function buyCard(card) {
    const price = card.rarity === 'mythic' ? 400 : card.rarity === 'legendary' ? 250 : card.rarity === 'epic' ? 120 : 40;
    if (coins < price) return alert('Not enough coins.');
    setCoins(c => c - price);
    onAddToCollection(card);
  }

  return (
    <section id="shop" className="mt-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Shop</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white">
          <Coins className="h-4 w-4 text-yellow-300" /> {coins} Coins
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {chests.map((c) => (
          <div key={c.id} className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-5 text-white">
            <div className="flex items-center gap-3">
              <c.icon className="h-6 w-6 text-indigo-300" />
              <div className="font-semibold">{c.name}</div>
              <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-xs">
                <Coins className="h-3 w-3 text-yellow-300" /> {c.price}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-300">{c.description}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => openChest(c.id)} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500">Open</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-300" />
          <h3 className="text-lg font-semibold text-white">Featured Cards</h3>
        </div>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {availableCards.map((card) => (
            <div key={card.id} className={`group rounded-xl border ${RARITY_COLORS[card.rarity]} p-3 text-white transition hover:scale-[1.02]`}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide opacity-80">{card.rarity}</span>
                <span className="text-[10px] rounded bg-white/10 px-1.5 py-0.5">ID {card.id}</span>
              </div>
              <div className="mt-6 text-lg font-bold">{card.name}</div>
              <button onClick={() => buyCard(card)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20">
                <Package className="h-4 w-4" /> Buy
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
