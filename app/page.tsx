'use client';

import { useEffect, useState } from 'react';
import type { LostItem } from '@/types';

export default function Home() {
  const [items, setItems] = useState<LostItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setItems([
      {
        id: '1',
        imageUrl: 'https://via.placeholder.com/100x100?text=傘',
        category: '傘',
        features: ['黒', '長傘', '木製の持ち手'],
        facilityName: '〇〇駅',
        createdAt: '2026-07-04'
      },
      {
        id: '2',
        imageUrl: 'https://via.placeholder.com/100x100?text=財布',
        category: '財布',
        features: ['茶色', '小銭入れあり', 'ブランドロゴ'],
        facilityName: '〇〇駅改札内',
        createdAt: '2026-07-03'
      },
      {
        id: '3',
        imageUrl: 'https://via.placeholder.com/100x100?text=バッグ',
        category: 'バッグ',
        features: ['赤', '大きめ', 'チャーム付き'],
        facilityName: '△△商業施設',
        createdAt: '2026-07-02'
      },
      {
        id: '4',
        imageUrl: 'https://via.placeholder.com/100x100?text=スマホ',
        category: 'スマートフォン',
        features: ['黒', 'ケース付き', '画面割れあり'],
        facilityName: '□□公園',
        createdAt: '2026-07-01'
      }
    ]);
  }, []);

  const filteredItems = items.filter((item) => {
    const haystack = [item.category, ...item.features, item.facilityName].join(' ');
    return haystack.includes(searchQuery);
  });

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Lost and Found</p>
          <h1 className="text-3xl font-bold">忘れ物検索</h1>
          <p className="text-slate-600">特徴や保管場所で検索すると、該当する忘れ物をすぐに確認できます。</p>
        </header>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <label htmlFor="search" className="text-sm font-semibold text-slate-700">検索</label>
            <a href="/upload" className="text-sm font-semibold text-sky-600 hover:text-sky-700">
              画像をアップロード
            </a>
          </div>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="特徴で絞り込み (例: 黒い財布)"
            className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-sky-500"
          />
        </div>

        <section className="grid gap-4">
          {filteredItems.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex gap-4">
                <div className="h-24 w-24 rounded-lg bg-slate-100" />
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">種類: {item.category}</h2>
                  <p className="text-sm text-slate-600">特徴: {item.features.join(', ')}</p>
                  <p className="font-semibold text-sky-700">保管場所: {item.facilityName}</p>
                  <p className="text-xs text-slate-500">登録日: {item.createdAt}</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
