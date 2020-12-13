// アプリケーション作成用のモジュールを読み込み
const {app, BrowserWindow} = require('electron');
// const jsdom = require("jsdom");
const serialPort = require('serialport');
// const printer = require('printer');
const fs = require('fs')
const path = require('path')
const os = require('os')
const ffi = require('ffi-napi');
const ref = require('ref-napi');

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


  app.allowRendererProcessReuse = false;
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

  app.allowRendererProcessReuse = true;



  const win = new BrowserWindow({ width: 800, height: 600 })
  win.loadURL('http://github.com')

  win.webContents.on('did-finish-load', () => {
    win.webContents.print({silent:true, printBackground:true, deviceName:"Microsoft Print to PDF"});
    // Use default printing options
    // win.webContents.printToPDF({silent:true, printBackground:true, deviceName:"Microsoft Print to PDF"}).then(data => {
    //   const pdfPath = path.join(os.homedir(), 'Desktop', 'temp.pdf')
    //   fs.writeFile(pdfPath, data, (error) => {
    //     if (error) throw error
    //     console.log(`Wrote PDF successfully to ${pdfPath}`)
    //   })
    // }).catch(error => {
    //   console.log(`Failed to write PDF to ${pdfPath}: `, error)
    // })
  })

  var dllSamplePath = "./DllSample.dll";
  var dllSample = ffi.Library(dllSamplePath, {
      'HelloWorld': ['string', []]
  });

  var result = dllSample.HelloWorld();
  console.log(result);

  // printer.printDirect({data:"print from Node.JS buffer" // or simple String: "some text"
  //     , printer:'Microsoft Print to PDF' // printer name, if missing then will print to default printer
  //     , type: 'TEXT' // type: RAW, TEXT, PDF, JPEG, .. depends on platform
  //     , success:function(jobID){
  //         console.log("sent to printer with ID: "+jobID);
  //     }
  //     , error:function(err){console.log(err);}
  // });

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