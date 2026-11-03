import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import registration from './src/registration.js';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'public');
const originalOrigin='https://london-bottler-summit-2027.gardennewt19.chatgpt.site';
const types={'.html':'text/html; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg'};
const server=http.createServer(async(req,res)=>{
 try{
  const proto=process.env.NODE_ENV==='production'?'https':'http';
  const origin=process.env.PUBLIC_BASE_URL?.replace(/\/$/,'')||`${proto}://${req.headers.host}`;
  const url=new URL(req.url,origin);
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  if(url.pathname==='/healthz'){res.writeHead(200,{'Content-Type':'application/json'});res.end('{"ok":true}');return;}
  if(url.pathname==='/api/register-interest'){
   let size=0;const chunks=[];
   for await(const chunk of req){size+=chunk.length;if(size>12000){res.writeHead(413,{'Content-Type':'application/json'});res.end('{"error":"Request too large"}');return;}chunks.push(chunk);}
   const headers=new Headers();for(const[k,v]of Object.entries(req.headers))if(v!==undefined)headers.set(k,Array.isArray(v)?v.join(','):v);
   const method=req.method;const body=['GET','HEAD'].includes(method)?undefined:Buffer.concat(chunks);
   const response=await registration.fetch(new Request(url,{method,headers,body}),{SLACK_WEBHOOK_URL:process.env.SLACK_WEBHOOK_URL});
   res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));return;
  }
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end('Method not allowed');return;}
  const pathname=decodeURIComponent(url.pathname);
  const filename=pathname==='/'?'/index.html':pathname;
  if(!(filename==='/index.html'||filename==='/favicon.svg'||filename==='/summit-preview.png'||/^\/assets\/[a-f0-9]+\.(webp|png|jpeg|jpg|gif)$/.test(filename))){res.writeHead(404);res.end('Not found');return;}
  let content=await readFile(path.join(root,filename));
  if(filename==='/index.html')content=Buffer.from(content.toString().replaceAll(originalOrigin,origin));
  res.writeHead(200,{'Content-Type':types[path.extname(filename)]||'application/octet-stream','Cache-Control':filename==='/index.html'?'no-cache':'public, max-age=86400'});
  res.end(req.method==='HEAD'?undefined:content);
 }catch{if(!res.headersSent)res.writeHead(500,{'Content-Type':'application/json'});res.end('{"error":"Unable to process request"}');}
});
server.listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('Bottler Summit server ready'));
process.on('SIGTERM',()=>server.close(()=>process.exit(0)));
