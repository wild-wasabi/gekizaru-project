import "./App.css";

const items = [
  {
    id: 1,
    image: "https://picsum.photos/300?1",
    label: "スマホ",
    feature: "青色ケース",
  },
  {
    id: 2,
    image: "https://picsum.photos/300?2",
    label: "傘",
    feature: "黒色",
  },
  {
    id: 3,
    image: "https://picsum.photos/300?3",
    label: "財布",
    feature: "茶色",
  },
  {
    id: 4,
    image: "https://picsum.photos/300?4",
    label: "イヤホン",
    feature: "白色",
  },
  {
    id: 5,
    image: "https://picsum.photos/300?5",
    label: "鍵",
    feature: "シルバー",
  },
  {
    id: 6,
    image: "https://picsum.photos/300?6",
    label: "水筒",
    feature: "青色",
  },
];

function App() {
  return (
    <div className="app">
      <header>
        <h1>紛失物リスト</h1>

        <input
          type="text"
          placeholder="ラベルや特徴を検索..."
          className="searchBox"
        />
      </header>

      <main className="grid">
        {items.map((item) => (
          <div className="card" key={item.id}>
            <img src={item.image} alt={item.label} />

            <div className="cardBody">
              <h3>{item.label}</h3>
              <p>{item.feature}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;