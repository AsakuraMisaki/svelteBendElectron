import { Application } from "./pixi.mjs";
// import { default as App } from "../out/eee.js";
import {render} from "../out/eee.js";
class R{
  static create(){
    const app = new Application(
      {
        resizeTo:window,
        background: 0xffffff
      }
    )
    globalThis.myStage = app.stage;
    document.body.appendChild(app.view);
    
    this.com();
  }
  static com(){
    setTimeout(()=>{
      render("AA");
    }, 300)
    
  } 
}

globalThis.RRR = R;

window.onload = R.create.bind(R);

