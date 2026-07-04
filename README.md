# Gekizaru-Project
## フロントエンドの開発について

- cd todo-app
ディレクトリを移動

- npm install -D
依存関係のインストール

- npm run dev
ローカルサーバの起動

- ctrl+Cでサーバーの停止
- cmd+Cでサーバーの停止


## バックエンドの開発について
### Flaskの環境構築
- cd backend

Windows
**1** python -m venv venv
**2** venv\Scripts\activate

Mac
**1** python3 -m venv venv
**2** source venv/bin/activate

Windows & Mac
**3**** pip install -r requirements.txt

## VSCode上でPythonのコードの色分けがうまく機能していない場合
VSCodeの設定で、**extra path** と検索
項目の追加から
.\backend\venv\Lib\site-packages\
