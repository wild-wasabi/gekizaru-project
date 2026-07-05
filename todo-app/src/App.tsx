import "./App.css";
import { useState,useEffect } from "react";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const[selectedImage,setSelectedImage]=useState<string|null>(null);
  useEffect(() => {
    localStorage.setItem("lostItems", JSON.stringify(items));
  }, [items]);
  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;
  setIsAnalyzing(true);

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
      alert("アップロードまたはAI解析に失敗しました。");
    } finally {
      setIsAnalyzing(false); 
    }
  
};
const filteredItems = items.filter(
    (item) =>
      item.label.includes(searchTerm) || item.feature.includes(searchTerm)
  );

  return (
    <div className="app">
      <header>
        <h1>紛失物リスト</h1>

        {/* 🟢 検索ボックスに値とイベントを結びつけ */}
        <input
          type="text"
          placeholder="ラベルや特徴を検索..."
          className="searchBox"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="uploadArea">
          {/* 🟢 ローディング中はボタンを無効化してぐるぐるを回す */}
          <Button
            variant="contained"
            component="label"
            startIcon={isAnalyzing ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
            size="large"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "AIが解析中..." : "画像をアップロード"}
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleUpload}
              disabled={isAnalyzing}
            />
          </Button>
        </div>
      </header>

      <main className="grid">
        {/* 🟢 items ではなく filteredItems をループする */}
        {filteredItems.map((item) => (
          <div className="card" key={item.id}>
            <img 
              src={item.image}
              alt={item.label} 
              onClick={()=>setSelectedImage(item.image)}
              style={{cursor:"pointer"}}
            />
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
        {filteredItems.length === 0 && (
          <p style={{ textAlign: "center", gridColumn: "1/-1", color: "#666" }}>
            該当する紛失物が見つかりません。
          </p>
        )}
      </main>
      <Modal
        open={selectedImage !== null} //selectedImageにURLが入っているときだけ開く
        onClose={() => setSelectedImage(null)} //背景をクリックしたらStateをnullにして閉じる
        aria-labelledby="image-modal"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} //MUIで画面中央に配置
      >
        <Box sx={{
          outline: 'none', //変な青枠を消す
          maxWidth: '90vw',
          maxHeight: '90vh',
          bgcolor: 'white', //CSSに依存せず、白背景を強制
          p: 1, //少しパディングを入れる
          borderRadius: 2,
          boxShadow: 24, //影をつける
        }}>
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="拡大画像" 
              style={{ 
                width: '100%', 
                height: 'auto', 
                maxHeight: '85vh', //画面からはみ出さないように
                objectFit: 'contain' //アスペクト比を維持して全体を表示
              }} 
            />
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default App;