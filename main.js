const { app, BrowserWindow } = require('electron/main')
const { main } = require('./src')
const chokidar = require('chokidar');
const path = require('path');
const { Helper } = require('./src/argvHelper')
let changing = false;
const watch = (win)=>{
  const watchPaths = [
    path.resolve(__dirname, 'src'),
  ];
  console.log(watchPaths);
  // 监听文件变化
  const watcher = chokidar.watch(watchPaths, {
    ignored: /node_modules/,
    persistent: true
  });
  
  
  watcher.on('change', (filePath) => {
    if(changing) return;
    changing = true;
    console.log(`\nFile changed: ${filePath}`);
    try{
      main(()=>{
        win.reload();
        changing = false;
      })
    }catch(e){
      console.error(e);
      process.exit(0);
    }
  });
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1700,
    height: 600
  })
  
  win.loadFile('index.html')
  win.webContents.toggleDevTools();
  watch(win);
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
    try{
      main(()=>{
        commonCreate();
      })
    }catch(e){
      console.error(e);
      process.exit(0);
    }
    
    
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