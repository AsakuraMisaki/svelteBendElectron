const { Server } = require("./server");

class Helper{
  constructor(){

  }
  // 获取当前启动端口
  exec(args){
    if(args[0] && args[0].toLowerCase() == "-h"){
      if(args[1].toLowerCase() == "port"){
        return this.port();
      }
    }
  }
  port(){
    return Server.getPort();
  }
}

module.exports = {Helper};