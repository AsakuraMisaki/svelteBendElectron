// import { existsSync, readFileSync, writeFileSync } from "fs";

const { writeFileSync, existsSync, readFileSync } = require("fs");
const publish = process.execPath && !/node\.exe$/i.test(process.execPath);

const _log = function(_log, file="./log.txt", clear=false){
  let content = "";
  if(existsSync(file) && !clear){
    content = readFileSync(file, "utf-8");
  }
  const time = new Date().toString();
  writeFileSync(file, `${content}\n${time}\n${_log}`, "utf-8");
}

const log = function(l, file="./log.txt", clear=false){
  if(publish){
    _log(l, file, clear);
  }
  else{
    console.warn(l);
  }
}



module.exports =  {log, publish, _log};