# Gekizaru-Project
## フロントエンドの開発について

以下を上から順にターミナルで実行

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

以下を上から順にターミナルで実行

- cd backend  
ディレクトリを移動

Windows
- python -m venv venv
- venv\Scripts\activate
- pip install -r requirements.txt

Mac
- python3 -m venv venv
- source venv/bin/activate
- pip install -r requirements.txt

##
Flaskの起動  
- (venv)/.../backend に移動して python run.py

### venvの終了方法
deactivate

## VSCode上でPythonのコードの色分けがうまく機能していない場合
VSCodeの設定で、**extra path** と検索  
項目の追加から  
.\backend\venv\Lib\site-packages\  