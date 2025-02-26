// import { existsSync, readFileSync, writeFileSync } from "fs";

const { writeFileSync, existsSync, readFileSync } = require("fs");
const publish = process.execPath && !/node\.exe$/i.test(process.execPath);

const log = function(_log){
  if(publish){
    let content = "";
    if(existsSync("./log.txt")){
      content = readFileSync("./log.txt", "utf-8");
    }
    const time = new Date().toString();
    writeFileSync("./log.txt", `${content}\n${time}\n${_log}`, "utf-8");
  }
  else{
    console.warn(_log);
  }
}

module.exports =  {log, publish};