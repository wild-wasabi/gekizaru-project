'use client';

import { useEffect, useState } from 'react';
import type { LostItem } from '@/types';

export default function Home() {
  const [items, setItems] = useState<LostItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/lost-items');
        if (!response.ok) {
          throw new Error('忘れ物データの取得に失敗しました');
        }

        const data = await response.json();
        setItems(data);
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return true;
    }

    const haystack = [item.category, ...item.features, item.facilityName].join(' ').toLowerCase();
    return haystack.includes(query);
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
          {isLoading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-600">
              読み込み中です...
            </div>
          ) : errorMessage ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
              {errorMessage}
            </div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex gap-4">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.category} className="h-24 w-24 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-500">
                      画像なし
                    </div>
                  )}
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold">種類: {item.category}</h2>
                    <p className="text-sm text-slate-600">特徴: {item.features.join(', ')}</p>
                    <p className="font-semibold text-sky-700">保管場所: {item.facilityName}</p>
                    <p className="text-xs text-slate-500">登録日: {item.createdAt}</p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-600">
              該当する忘れ物は見つかりませんでした。
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
