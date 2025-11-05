import React from 'react';
import Spline from '@splinetool/react-spline';
import { Sparkles, Crown } from 'lucide-react';

export default function HeroScene({ onNavigate }) {
  return (
    <section className="relative h-[60vh] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/7a3TgQqB5rNv1zj5/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs backdrop-blur">
          <Sparkles className="h-4 w-4 text-yellow-300" />
          New season launched: Mythic Hunt
        </div>
        <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
          Forge your legend. Collect, Trade, Conquer.
        </h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Open chests, pull rare cards, and build your dream collection. Join the community to flex your pulls and strategize.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => onNavigate('shop')} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 transition">
            <Crown className="h-4 w-4" /> Enter the Shop
          </button>
          <button onClick={() => onNavigate('community')} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition">
            Join Community
          </button>
        </div>
      </div>
    </section>
  );
}
