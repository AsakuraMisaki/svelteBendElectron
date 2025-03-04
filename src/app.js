import { Application } from "./pixi.mjs";
// import { default as App } from "../out/eee.js";
import {render, GlobalContext} from "../out/eee.js";
class R{
  static create(){
    const app = new Application(
      {
        resizeTo:window,
        background: 0xffffff
      }
    )
    document.body.appendChild(app.view);
    let ctx = new GlobalContext();
    ctx.stage = app.stage;
    GlobalContext.current = ctx;
    globalThis.GlobalContext = GlobalContext.current;
    this.com();
  }
  static com(){
    setTimeout(()=>{
      render("App");
    }, 300)
    
  } 
}

globalThis.RRR = R;

window.onload = R.create.bind(R);

