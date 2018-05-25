const electron = require('electron');
// Module to control application life.
const app = electron.app;
// app.commandLine.appendSwitch('remote-debugging-port', '5555');
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
// eslint-disable-next-line
function hack_referer_header(details) {
  let refererValue = '';
  if (details.url.indexOf('://music.163.com/') !== -1) {
    refererValue = 'http://music.163.com/';
  }

  if (details.url.indexOf('.xiami.com/') !== -1) {
    refererValue = 'http://m.xiami.com/';
  }

  if ((details.url.indexOf('y.qq.com/') !== -1) ||
    (details.url.indexOf('qqmusic.qq.com/') !== -1) ||
    (details.url.indexOf('music.qq.com/') !== -1) ||
    (details.url.indexOf('imgcache.qq.com/') !== -1)) {
    refererValue = 'http://y.qq.com/';
  }

  let isRefererSet = false;
  const headers = details.requestHeaders;
  // eslint-disable-next-line
  for (let i = 0, l = headers.length; i < l; i++) {
    if ((headers[i].name === 'Referer') && (refererValue !== '')) {
      headers[i].value = refererValue;
      isRefererSet = true;
      break;
    }
  }

  if ((!isRefererSet) && (refererValue !== '')) {
    // headers.Origin = refererValue;
    headers.Referer = refererValue;
  }
  // eslint-disable-next-line
  details.requestHeaders = headers;
}

function createWindow() {
  const session = require('electron').session;

  const filter = {
    urls: ['*://music.163.com/*', '*://*.xiami.com/*', '*://*.qq.com/*',
      'https://listen1.github.io/listen1/callback.html?code=*']
  };

  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    if (details.url.startsWith('https://listen1.github.io/listen1/callback.html?code=')) {
      // eslint-disable-next-line
      const url = details.url;
      const code = url.split('=')[1];
      mainWindow.webContents.executeJavaScript(`Github.handleCallback("${code}");`);
    } else {
      hack_referer_header(details);
    }
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
