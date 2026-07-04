import { NextResponse } from 'next/server';

type LostItem = {
  id: string;
  imageUrl: string;
  category: string;
  features: string[];
  facilityName: string;
  createdAt: string;
};

const initialItems: LostItem[] = [
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
];

let items: LostItem[] = [...initialItems];

export async function GET() {
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const body = await request.json();
  const category = typeof body?.category === 'string' ? body.category.trim() : '';
  const facilityName = typeof body?.facilityName === 'string' ? body.facilityName.trim() : '';
  const features = Array.isArray(body?.features)
    ? body.features.filter((feature: unknown): feature is string => typeof feature === 'string')
    : [];
  const imageUrl = typeof body?.imageUrl === 'string' ? body.imageUrl : '';

  if (!category || !facilityName) {
    return NextResponse.json({ error: 'カテゴリーと保管場所は必須です。' }, { status: 400 });
  }

  const newItem: LostItem = {
    id: `${Date.now()}`,
    imageUrl: imageUrl || 'https://via.placeholder.com/100x100?text=新規',
    category,
    features,
    facilityName,
    createdAt: new Date().toISOString().slice(0, 10)
  };

  items = [newItem, ...items];

  return NextResponse.json(newItem, { status: 201 });
}
