// watcher.js
const { exec, spawn } = require('child_process');
const chokidar = require('chokidar');
const path = require('path');

// 配置要监听的文件路径（根据项目结构调整）
const watchPaths = [
  path.resolve(__dirname, './src/*.{svelte}'),
];

// 启动 Electron 进程
let electronProcess = spawn('npx', ['electron', '.'], {
  stdio: 'inherit' // 将 Electron 的输出直接显示在终端
});

// 监听文件变化
const watcher = chokidar.watch(watchPaths, {
  ignored: /node_modules/,
  persistent: true
});

watcher.on('change', (filePath) => {
  console.log(`\nFile changed: ${filePath}`);
  
  // 发送中断信号让 Electron 优雅退出
  electronProcess.kill('SIGINT');
  
  // 等待进程完全关闭后重新启动（避免端口冲突）
  electronProcess.once('exit', () => {
    console.log('Electron process restarted');
    
    // 重新启动 Electron
    electronProcess = spawn('npx', ['electron', '.'], {
      stdio: 'inherit'
    });
  });
});

// 处理手动终止命令（Ctrl+C）
// process.on('SIGINT', () => {
//   console.log('\nShutting down watcher...');
//   watcher.close();
//   electronProcess.kill('SIGINT');
//   process.exit(0);
// });