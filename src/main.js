// アプリケーション作成用のモジュールを読み込み
const {app, BrowserWindow} = require('electron');
// const jsdom = require("jsdom");
const serialPort = require('serialport');

// メインウィンドウ
let mainWindow;

function createWindow() {
  // メインウィンドウを作成します
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    width: 800, height: 600,
  });

  // メインウィンドウに表示するURLを指定します
  // （今回はmain.jsと同じディレクトリのindex.html）
  mainWindow.loadFile('index.html');

  // デベロッパーツールの起動
  mainWindow.webContents.openDevTools();


  serialPort.list().then(ports => {
    ports.forEach(function(port) {
      console.log(port.path);
      console.log(port.pnpId);
      console.log(port.manufacturer);
    });
  });

  serialPort.list(function(err, ports) {
    ports.forEach(function(port){
      console.log(port);
    });
  });

//   const dom = new jsdom.JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
//   dom.window.print({silent:true, printBackground:true, deviceName:"Microsoft Print to PDF"});
//   let doc = domparser.parseFromString('<html><body>Hello<br>World!!</body></html>', "text/html");
//   doc.print({silent:true, printBackground:true, deviceName:"Microsoft Print to PDF"});

  // メインウィンドウが閉じられたときの処理
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

//  初期化が完了した時の処理
app.on('ready', createWindow);

// 全てのウィンドウが閉じたときの処理
app.on('window-all-closed', () => {
  // macOSのとき以外はアプリケーションを終了させます
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
// アプリケーションがアクティブになった時の処理(Macだと、Dockがクリックされた時）
app.on('activate', () => {
  // メインウィンドウが消えている場合は再度メインウィンドウを作成する
  if (mainWindow === null) {
    createWindow();
  }
});