import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import registration from '../src/registration.js';
const url='https://summit.example/api/register-interest';
const data={name:'Test Attendee',email:'test@example.com',company:'Test Bottler',title:'CIO'};
const req=(d=data,origin='https://summit.example')=>new Request(url,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(d)});
test('validates form, rejects cross-origin and requires configuration',async()=>{
 assert.equal((await registration.fetch(req({...data,email:'invalid'}),{})).status,400);
 assert.equal((await registration.fetch(req(data,'https://other.example'),{})).status,403);
 assert.equal((await registration.fetch(req(),{})).status,503);
});
test('only reports success after Slack accepts delivery',async()=>{
 const saved=globalThis.fetch;let payload;
 try{globalThis.fetch=async(_,opts)=>{payload=JSON.parse(opts.body);return new Response('ok');};
 assert.equal((await registration.fetch(req(),{SLACK_WEBHOOK_URL:'https://example.com/test'})).status,200);
 assert.match(JSON.stringify(payload),/Test Attendee/);
 globalThis.fetch=async()=>new Response('no',{status:500});
 assert.equal((await registration.fetch(req(),{SLACK_WEBHOOK_URL:'https://example.com/test'})).status,502);
 }finally{globalThis.fetch=saved;}
});
test('Node server serves site, images, icons, metadata and registration endpoint',async()=>{
 const child=spawn(process.execPath,['server.js'],{env:{...process.env,PORT:'3197',PUBLIC_BASE_URL:'http://127.0.0.1:3197',SLACK_WEBHOOK_URL:'',NODE_ENV:'test'},stdio:['ignore','pipe','pipe']});
 try{await once(child.stdout,'data');const base='http://127.0.0.1:3197';
 const r=await fetch(base);assert.equal(r.status,200);const html=await r.text();assert.match(html,/March 11–12, 2027/);assert.match(html,/http:\/\/127.0.0.1:3197\/summit-preview.png/);
 for(const src of [...html.matchAll(/src="(\/assets\/[^"]+)"/g)].map(m=>m[1]))assert.equal((await fetch(base+src)).status,200);
 assert.equal((await fetch(base+'/favicon.svg')).status,200);
 assert.equal((await fetch(base+'/summit-preview.png')).headers.get('content-type'),'image/png');
 assert.equal((await fetch(base+'/healthz')).status,200);
 const post=await fetch(base+'/api/register-interest',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify(data)});assert.equal(post.status,503);
 assert.equal((await fetch(base+'/missing')).status,404);
 }finally{child.kill();await once(child,'exit');}
});
