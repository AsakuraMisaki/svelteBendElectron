const { execFile } = require('child_process');
const path = require('path');
const { esbuild } = require('./entry');



const exePath = "D:/sveltebendelectron-win32-x64-1.0.0/sveltebendelectron.exe";

// 向 .exe 传递参数
const args = ['-h', 'port']; // 替换为您的参数

// execFile(exePath, args, (error, stdout, stderr) => {
//     // if (error) {
//     //     console.error(`Error executing the file: ${error}`);
//     //     return;
//     // }
//     if (stderr) {
//         console.error(`stderr: ${stderr}`);
//     }
//     console.log(`stdout: ${stdout}`);
// });

esbuild.build({
    entryPoints: ["node_modules/superjson/dist/index.js"],
    outdir: "out",
    format: "esm",
    bundle: true
})
