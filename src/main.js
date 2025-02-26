const { execFile } = require('child_process');
const path = require('path');



const exePath = "D:/sv.exe";

// 向 .exe 传递参数
const args = ['./sv.config.ts', 'arg2']; // 替换为您的参数

execFile(exePath, args, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing the file: ${error}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
});
