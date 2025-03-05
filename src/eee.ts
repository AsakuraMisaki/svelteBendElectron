import { mount } from 'svelte';
import App from './App.svelte';
import AA from './AA.svelte';
import { GlobalContext } from './sdk';


const offline = document.createElement("div");
const all = { App, AA };
const render = (key)=>{
	const app = mount(all[key], {
		target: offline,
		
	});
}
export {render, GlobalContext};

