import React, { useEffect, useState } from 'react';
import HeroScene from './components/HeroScene';
import ShopSection from './components/ShopSection';
import CollectionSection from './components/CollectionSection';
import CommunityHub from './components/CommunityHub';
import { Gamepad2, ShoppingBag, Boxes, MessageSquare } from 'lucide-react';

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

export default function App() {
  const [route, setRoute] = useState('home');
  const [collection, setCollection] = useLocalStorage('collection', []);
  const [availableCards, setAvailableCards] = useLocalStorage('availableCards', null);

  useEffect(() => {
    // Seed available cards if missing
    if (!Array.isArray(availableCards)) {
      const defaults = [
        { id: 'c-1', name: 'Blade Warden', rarity: 'common' },
        { id: 'c-2', name: 'Stormcaller', rarity: 'epic' },
        { id: 'c-3', name: 'Sunscale Dragon', rarity: 'legendary' },
        { id: 'c-4', name: 'Abyssal Oracle', rarity: 'mythic' },
        { id: 'c-5', name: 'Grove Sentinel', rarity: 'common' },
        { id: 'c-6', name: 'Voidrunner', rarity: 'epic' },
        { id: 'c-7', name: 'Crown Phoenix', rarity: 'legendary' },
        { id: 'c-8', name: 'Eternal Seraph', rarity: 'mythic' },
      ];
      setAvailableCards(defaults);
    }
  }, [availableCards, setAvailableCards]);

  function handleAddToCollection(card) {
    setCollection((prev) => [...prev, card]);
  }

  function handleAdminAddCard(card) {
    // Adds to available cards pool (used by shop)
    setAvailableCards((prev) => {
      const base = Array.isArray(prev) ? prev : [];
      return [...base, card];
    });
  }

  const NavButton = ({ icon: Icon, label, value }) => (
    <button
      onClick={() => setRoute(value)}
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
        route === value ? 'bg-white/15 text-white' : 'text-slate-200 hover:bg-white/10'
      }`}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 shadow">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold">Mythic Forge</div>
              <div className="text-xs text-slate-400">Collect. Trade. Flex.</div>
            </div>
          </div>
          <nav className="hidden sm:flex items-center gap-2">
            <NavButton icon={ShoppingBag} label="Shop" value="shop" />
            <NavButton icon={Boxes} label="Collection" value="collection" />
            <NavButton icon={MessageSquare} label="Community" value="community" />
          </nav>
        </header>

        {route === 'home' && <HeroScene onNavigate={setRoute} />}

        <main className="mt-8">
          {route === 'shop' && (
            <ShopSection onAddToCollection={handleAddToCollection} />
          )}
          {route === 'collection' && (
            <CollectionSection collection={collection} />
          )}
          {route === 'community' && (
            <CommunityHub onAdminAddCard={handleAdminAddCard} />
          )}
        </main>

        {/* Mobile quick nav */}
        <div className="sm:hidden fixed inset-x-0 bottom-4 z-20 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-2 py-2 backdrop-blur">
            <NavButton icon={ShoppingBag} label="Shop" value="shop" />
            <NavButton icon={Boxes} label="Collection" value="collection" />
            <NavButton icon={MessageSquare} label="Community" value="community" />
          </div>
        </div>

        <footer className="mt-16 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
          Season Alpha • Built for showcasing a game-like shop, collections, chat, and admin tools.
        </footer>
      </div>
    </div>
  );
}
