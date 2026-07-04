import "./App.css";
import { useState,useEffect } from "react";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

type LostItem = {
  id: number;
  image: string;
  label: string;
  feature: string;
};

const initialItems: LostItem[] = [];

const CLOUD_NAME = "dluf5vsfs";
const UPLOAD_PRESET = "hackathon";

function App() {
  const [items, setItems] = useState<LostItem[]>(() => {
    const saved = localStorage.getItem("lostItems");

    if (saved) {
      return JSON.parse(saved) as LostItem[];
    }

    return initialItems;
  });
  
  useEffect(() => {
    localStorage.setItem("lostItems", JSON.stringify(items));
  }, [items]);
  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];

  if (!file) return;

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    console.log(data);

    const aiResponse = await fetch(
      "http://127.0.0.1:5000/analyze",
      {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              image: data.secure_url,
          }),
      }
    );

    const ai = await aiResponse.json();  
     
    const newItem = {
      id: Date.now(),
      image: data.secure_url,
      label: ai.label,
      feature: ai.feature,
    };

    setItems((prev) => [newItem, ...prev]);

  } catch (err) {
    console.error(err);
  }
  
};
  return (
    <div className="app">
      <header>
        <h1>紛失物リスト</h1>

        <input
          type="text"
          placeholder="ラベルや特徴を検索..."
          className="searchBox"
        />

    <div className="uploadArea">
      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
        size="large"
      >
      画像をアップロード
       <input
        hidden
        accept="image/*"
        type="file"
        onChange={handleUpload}
      />
      </Button>
    </div>
      </header>

      <main className="grid">
        {items.map((item) => (
          <div className="card" key={item.id}>
            <img src={item.image} alt={item.label} />

            <div className="cardBody">
              <h3>{item.label}</h3>
              <p>{item.feature}</p>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(item.id)}
                >
                削除
              </Button>
            </div>
    </div>
))}
      </main>
    </div>
    
  );
}

export default App;