import React, { useEffect, useState } from 'react';
import { Crown, Star } from 'lucide-react';

const RARITY_BADGE = {
  common: 'text-slate-300',
  epic: 'text-indigo-300',
  legendary: 'text-amber-300',
  mythic: 'text-fuchsia-300',
};

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

export default function CollectionSection({ collection }) {
  const [filter, setFilter] = useState('all');

  const filtered = collection.filter((c) => (filter === 'all' ? true : c.rarity === filter));

  return (
    <section id="collection" className="mt-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-amber-400" />
          <h2 className="text-2xl font-bold text-white">Your Collection</h2>
        </div>
        <div className="flex gap-2">
          {['all', 'common', 'epic', 'legendary', 'mythic'].map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`rounded-md px-3 py-1.5 text-sm capitalize ${
                filter === r ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 text-slate-400">No cards yet. Open a chest or buy a card to start your collection.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map((card, idx) => (
            <div key={`${card.id}-${idx}`} className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-3 text-white">
              <div className="flex items-center justify-between text-xs">
                <span className={`uppercase tracking-wide ${RARITY_BADGE[card.rarity]}`}>{card.rarity}</span>
                <span className="rounded bg-white/10 px-1.5 py-0.5">{card.id}</span>
              </div>
              <div className="mt-8 text-lg font-bold">{card.name}</div>
              <div className="mt-2 text-xs text-slate-300 flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-300" /> Mint #{idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
