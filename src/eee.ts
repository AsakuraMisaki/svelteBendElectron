import { mount } from 'svelte';
import App from './App.svelte';
import AA from './AA.svelte';

const offline = document.createElement("div");
const all = { App, AA };
const render = (key)=>{
	const app = mount(all[key], {
		target: document.body,
		
	});
}
export {render};

