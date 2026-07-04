'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [features, setFeatures] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null;
      if (result) {
        setPreviewUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!category.trim() || !facilityName.trim()) {
      setMessage('カテゴリーと保管場所は必須です。');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    const featureList = features
      .split(',')
      .map((feature) => feature.trim())
      .filter(Boolean);

    try {
      const response = await fetch('/api/lost-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category,
          features: featureList,
          facilityName,
          imageUrl: previewUrl || ''
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '登録に失敗しました。');
      }

      setMessage(`${data.category} を ${data.facilityName} に登録しました。一覧へ戻ります。`);
      setCategory('');
      setFeatures('');
      setFacilityName('');
      setPreviewUrl(null);

      window.setTimeout(() => {
        router.push('/');
      }, 800);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '登録に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Upload</p>
            <h1 className="text-3xl font-bold">画像をアップロード</h1>
            <p className="mt-2 text-slate-600">忘れ物の写真と情報を登録できます。</p>
          </div>
          <Link href="/" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100">
            一覧へ戻る
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">画像ファイル</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>

          {previewUrl ? (
            <img src={previewUrl} alt="プレビュー" className="h-48 w-full rounded-lg object-cover" />
          ) : (
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
              画像プレビューがここに表示されます
            </div>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">カテゴリ</span>
            <input
              type="text"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="例: 傘"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">特徴（カンマ区切り）</span>
            <input
              type="text"
              value={features}
              onChange={(event) => setFeatures(event.target.value)}
              placeholder="例: 黒, 長傘"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">保管場所</span>
            <input
              type="text"
              value={facilityName}
              onChange={(event) => setFacilityName(event.target.value)}
              placeholder="例: 〇〇駅"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? '登録中...' : 'アップロードする'}
          </button>

          {message ? <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">{message}</p> : null}
        </form>
      </div>
    </main>
  );
}
