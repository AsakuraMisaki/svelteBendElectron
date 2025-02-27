const { app, BrowserWindow } = require('electron/main')
const { main } = require('./src')
const { Helper } = require('./src/argvHelper')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
  win.webContents.toggleDevTools();
}

app.whenReady().then(() => {
  // command mode
  if(process.argv.length > 1 && /^\-/i.test(process.argv[1])){
    const helper = new Helper();
    const newArgv = Array.from(process.argv);
    newArgv.shift();
    console.log(helper.exec(newArgv));
    process.exit(1);
  }
  else{
    commonCreate();
  }
})

const commonCreate = function(){
  createWindow()
  
  // main();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})