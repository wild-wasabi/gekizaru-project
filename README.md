# Gekizaru-Project

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
- python -m venv venv
- venv\Scripts\activate

Mac
- python3 -m venv venv
- source venv/bin/activate

Windows & Mac
- pip install -r requirements.txt

# VSCode上でPythonのコードの色分けがうまく機能していない場合
VSCodeの設定で、**extra path** と検索
項目の追加から
**.\backend\venv\Lib\site-packages\ **
