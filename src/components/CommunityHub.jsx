import React, { useEffect, useState } from 'react';
import { MessageCircle, Shield, Upload, ImagePlus } from 'lucide-react';

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

export default function CommunityHub({ onAdminAddCard }) {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useLocalStorage('chatMessages', [
    { user: 'System', text: 'Welcome to the community! Type /open to showcase a random card from your collection.' },
  ]);
  const [input, setInput] = useState('');

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (trimmed === '/help') {
      setMessages((m) => [...m, { user: 'System', text: 'Commands: /help, /open, /profile' }]);
    } else if (trimmed === '/profile') {
      setMessages((m) => [...m, { user: 'You', text: 'Profile: Collector rank Bronze. Total pulls: 12.' }]);
    } else if (trimmed === '/open') {
      const collectionRaw = localStorage.getItem('collection');
      const collection = collectionRaw ? JSON.parse(collectionRaw) : [];
      if (collection.length === 0) {
        setMessages((m) => [...m, { user: 'You', text: 'I tried to flex but I have no cards yet 😅' }]);
      } else {
        const pick = collection[Math.floor(Math.random() * collection.length)];
        setMessages((m) => [...m, { user: 'You', text: `Flexing: ${pick.name} (${pick.rarity.toUpperCase()})` }]);
      }
    } else {
      setMessages((m) => [...m, { user: 'You', text: trimmed }]);
    }
    setInput('');
  }

  // Admin upload form
  const [form, setForm] = useState({ name: '', rarity: 'common', id: '' });
  function handleUpload(e) {
    e.preventDefault();
    if (!form.name || !form.rarity) return;
    const id = form.id || `c-${Math.random().toString(36).slice(2, 7)}`;
    onAdminAddCard({ id, name: form.name, rarity: form.rarity });
    setForm({ name: '', rarity: 'common', id: '' });
    alert('Card added to the shop pool!');
  }

  return (
    <section id="community" className="mt-12">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-emerald-400" />
        <h2 className="text-2xl font-bold text-white">Community & Admin</h2>
      </div>

      <div className="mt-4 inline-flex rounded-lg border border-white/10 bg-white/5 p-1 text-white">
        {[
          { key: 'chat', label: 'Chat' },
          { key: 'admin', label: 'Admin Panel' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-md px-4 py-1.5 text-sm ${activeTab === tab.key ? 'bg-white/15' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'chat' ? (
        <div className="mt-4 grid grid-rows-[1fr_auto] h-80 rounded-xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 p-4">
          <div className="space-y-2 overflow-y-auto pr-2">
            {messages.map((m, i) => (
              <div key={i} className="text-sm">
                <span className="font-semibold text-white">{m.user}:</span>{' '}
                <span className="text-slate-300">{m.text}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Type a message or /help"
            />
            <button onClick={handleSend} className="rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-500">
              Send
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpload} className="mt-4 rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-4 text-white space-y-3">
          <div className="flex items-center gap-2 text-slate-300">
            <Shield className="h-5 w-5 text-indigo-300" /> Only admins should use this section.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400">Card Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="E.g., Nightblade" />
            </div>
            <div>
              <label className="text-xs text-slate-400">Rarity</label>
              <select value={form.rarity} onChange={(e) => setForm({ ...form, rarity: e.target.value })} className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="common">Common</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
                <option value="mythic">Mythic</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400">Custom ID (optional)</label>
              <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., c-999" />
            </div>
          </div>
          <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500">
            <Upload className="h-4 w-4" /> Upload Card to Shop
          </button>
        </form>
      )}
    </section>
  );
}
