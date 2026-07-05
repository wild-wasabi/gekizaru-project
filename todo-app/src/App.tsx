import "./App.css";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem"; 
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl"; 

type LostItem = {
  id: number;
  image: string;
  label: string;
  feature: string;
  isFound?: boolean;
  finderName?: string;
  location?: string; 
  foundDate?: string;
};

const initialItems: LostItem[] = [];

const CLOUD_NAME = "dluf5vsfs";
const UPLOAD_PRESET = "hackathon";
const PASSWORD = "admin";

// 選択できる場所のリスト
const LOCATION_OPTIONS = ["未指定", "大学学生課", "情報科事務室","物理学科事務室","地理学科事務室","心理学科事務室",
"社会福祉学科事務室","社会学科事務室","社会学科事務室","体育学科事務室","数学科事務室","化学科事務室","教育学科事務室",
"生命科学科事務室","英文学科事務室","史学科事務室","国文学科事務室","中国語中国文化学科事務室","地球科学科事務室","ドイツ文学科事務室"
,"哲学科事務室"];

function App() {
  const [items, setItems] = useState<LostItem[]>(() => {
    const saved = localStorage.getItem("lostItems");
    if (saved) return JSON.parse(saved) as LostItem[];
    return initialItems;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    localStorage.setItem("lostItems", JSON.stringify(items));
  }, [items]);

  const handleAdminLogin = () => {
    if (isAdmin) {
      setIsAdmin(false);
      alert("ログアウトしました。");
      return;
    }
    const passwordInput = prompt("管理者パスワードを入力してください");
    if (passwordInput === PASSWORD) {
      setIsAdmin(true);
      alert("管理者モードでログインしました。");
    } else if (passwordInput !== null) {
      alert("パスワードが違います。");
    }
  };

  // 管理者専用の削除機能
  const handleRealDelete = (id: number) => {
    if (!window.confirm("この忘れ物データを完全に削除してもよろしいですか？")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    alert("データを削除しました。");
  };

  // 保管場所を変更する機能
  const handleLocationChange = (id: number, newLocation: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, location: newLocation } : item
      )
    );
  };

  const handleDateChange = (id: number, newDate: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, foundDate: newDate } : item
      )
    );
  };

  const handleMarkAsFound = (id: number) => {
    if (!isAdmin) {
      const passwordInput = prompt("管理者パスワードを入力してください");
      if (passwordInput == null) return;
      if (passwordInput !== PASSWORD) {
        alert("パスワードが違います。");
        return;
      }
      setIsAdmin(true);
    }

  const today = new Date().toISOString().split('T')[0];

    const nameInput = prompt("持ち主のお名前を入力してください");
    if (!nameInput) {
      alert("名前を入力してください。");
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isFound: true, finderName: nameInput }
          : item
      )
    );
    alert("ステータスを更新しました！");
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!isAdmin) {
      alert("画像のアップロードは管理者のみ可能です。ログインしてください。");
      return;
    }
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();

      const aiResponse = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: data.secure_url }),
      });
      const ai = await aiResponse.json();  

      const newItem = {
        id: Date.now(),
        image: data.secure_url,
        label: ai.label,
        feature: ai.feature,
        isFound: false,
        finderName: "",
        location: "未指定",
        foundDate: "",
      };

      setItems((prev) => [newItem, ...prev]);
    } catch (err) {
      console.error(err);
      alert("アップロードまたはAI解析に失敗しました。");
    } finally {
      setIsAnalyzing(false); 
    }
  };

  // 検索機能
  const filteredItems = items.filter(
    (item) =>
      item.label.includes(searchTerm) || 
      item.feature.includes(searchTerm) ||
      (item.location && item.location.includes(searchTerm))
  );

  return (
    <div className="app">
      <header>
        <h1>紛失物リスト {isAdmin && <span style={{ fontSize: "14px", color: "#d32f2f", verticalAlign: "middle", border: "1px solid", padding: "2px 6px", borderRadius: "4px" }}>管理者モード</span>}</h1>

        <input
          type="text"
          placeholder="ラベル、特徴、保管場所を検索..."
          className="searchBox"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="uploadArea" style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
          <Button
            variant="contained"
            component="label"
            startIcon={isAnalyzing ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
            size="large"
            disabled={isAnalyzing || !isAdmin}
          >
            {!isAdmin ? "画像アップロード（管理者専用）" : isAnalyzing ? "AIが解析中..." : "画像をアップロード"}
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleUpload}
              disabled={isAnalyzing || !isAdmin}
            />
          </Button>

          <Button
            variant="outlined"
            color={isAdmin ? "error" : "primary"}
            onClick={handleAdminLogin}
            size="large"
          >
            {isAdmin ? "管理者ログアウト" : "管理者ログイン"}
          </Button>
        </div>
      </header>

      <main className="grid">
        {filteredItems.map((item) => (
          <div className={`card ${item.isFound ? "found" : ""}`} key={item.id}>
            <img 
              src={item.image}
              alt={item.label} 
              onClick={() => setSelectedImage(item.image)}
              style={{ cursor: "pointer" }}
            />
            <div className="cardBody">
              <h3>{item.label}</h3>
              <p>{item.feature}</p>
              
              {/* 追加：保管場所の表示・選択欄 */}
              <div style={{ marginTop: "10px", marginBottom: "15px" }}>
                <span style={{ fontSize: "13px", color: "#555", display: "block", marginBottom: "4px" }}>📍 保管場所:</span>
                {isAdmin ? (
                  // 管理者の場合はドロップダウンで選択可能
                  <FormControl size="small" fullWidth>
                    <Select
                      value={item.location || "未指定"}
                      onChange={(e) => handleLocationChange(item.id, e.target.value)}
                      style={{ fontSize: "14px", background: "#fff" }}
                    >
                      {LOCATION_OPTIONS.map((loc) => (
                        <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  // 一般ユーザーの場合はテキスト表示のみ
                  <span style={{ fontSize: "15px", fontWeight: "bold", color: "#1976d2" }}>
                    {item.location || "未指定"}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: "15px" }}>
                <span style={{ fontSize: "13px", color: "#555", display: "block", marginBottom: "4px" }}>🔍 発見日:</span>
                {isAdmin ? (
                  // 管理者の場合はカレンダーからいつでも修正・追記可能
                  <input
                    type="date"
                    value={item.foundDate || ""}
                    onChange={(e) => handleDateChange(item.id, e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      fontSize: "14px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      boxSizing: "border-box"
                    }}
                  />
                ) : (
                  // 一般ユーザーにはテキスト表示のみ
                  <span style={{ fontSize: "15px", fontWeight: "bold", color: "#e65100" }}>
                    {item.foundDate ? item.foundDate.replace(/-/g, "/") : "不明"}
                  </span>
                )}
              </div>
              
              {item.isFound ? (
                <div className="statusBadge">
                  {isAdmin ? (
                    <>返却済み:受取人<strong>{item.finderName || "未登録"} 様</strong></>
                  ) : (
                    <>返却済み</>
                  )}
                </div>
              ) : isAdmin?(
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleMarkAsFound(item.id)}
                    fullWidth
                  >
                    発見済みにする
                  </Button>
                  
                  {/* 管理者モードのときだけ「完全削除」ボタンを表示 */}
                  {isAdmin && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRealDelete(item.id)}
                    >
                      削除
                    </Button>
                  )}
                </div>
              ):(
                <div className="statusBadge keepingBadge">
                  保管中（未受け取り）
                </div>
              )}
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
        open={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        aria-labelledby="image-modal"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{
          outline: 'none',
          maxWidth: '90vw',
          maxHeight: '90vh',
          bgcolor: 'white',
          p: 1,
          borderRadius: 2,
          boxShadow: 24,
        }}>
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="拡大画像" 
              style={{ width: '100%', height: 'auto', maxHeight: '85vh', objectFit: 'contain' }} 
            />
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default App;