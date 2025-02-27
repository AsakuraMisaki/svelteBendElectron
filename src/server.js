const { readFileSync } = require("fs");
const { log } = require('./env.js');
const WebSocket = require('ws');
const net = require('net');

const file = "./server.txt";
const EventType = {
  Built: "built", Project: "project"
}

class Server{
  constructor(){
    this._port = 8000;
    this.main();
  }
  // 获取当前启动端口
  static getPort() {
    const content = readFileSync(file, "utf-8");
    return content.split(/\n/)[1];
  }
  checkPort(port) {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.unref();
      server.on('error', () => resolve(false));
      server.listen(port, () => {
        server.close(() => resolve(true));
      });
    });
  }
  async checkPorts(start, end) {
    for (let port = start; port <= end; port++) {
      const available = await this.checkPort(port);
      if (available) {
        this._port = port;
        return;
      }
    }
  }
  onMessage(message){
    try{
      const d = JSON.parse(message);
      if(d.type == EventType.Project){
        console.warn(d);
        //ipc front
      }
    }catch(e){
      console.error(e);
    }
  }
  async main() {
    await checkPorts(8000, 8100);
    // 创建 WebSocket 服务器，监听在指定的端口
    const wss = new WebSocket.Server({ port: this._port });
    // 记录当前启动端口
    log(this._port, file, true);
    // 处理新的连接
    wss.on('connection', (ws) => {
      console.log('New client connected');
      // 处理客户端消息
      ws.on('message', (message) => {
        this.onMessage(message);
      })
    });
  
    console.log(`WebSocket server is running on ws://localhost:${this._port}`);
  }
}

module.exports = {Server, EventType};



