// Initial ayeT callback receiver: only authenticated sandbox requests are acknowledged.
// Real conversions are rejected until the approved adslot and funded ledger are configured.
const reply=(body:string,status=200)=>new Response(body,{status,headers:{"content-type":"text/plain; charset=utf-8","cache-control":"no-store"}});
Deno.serve(async req=>{
 if(req.method!=="GET")return reply("Method not allowed",405);
 const params=new URL(req.url).searchParams;
 if([...params].length===0)return reply("Taskivo ayeT callback endpoint; test setup only");
 const key=Deno.env.get("AYET_PUBLISHER_API_KEY");
 if(!key)return reply("Callback authentication not configured",503);
 const signature=req.headers.get("X-Ayetstudios-Security-Hash")||"";
 if(!/^[0-9a-f]{64}$/i.test(signature))return reply("Invalid signature",403);
 const seen=new Set<string>();
 for(const [name] of params){if(seen.has(name))return reply("Duplicate parameter",400);seen.add(name);}
 params.sort();
 const enc=new TextEncoder();
 const hmac=await crypto.subtle.importKey("raw",enc.encode(key),{name:"HMAC",hash:"SHA-256"},false,["verify"]);
 const valid=await crypto.subtle.verify("HMAC",hmac,Uint8Array.from(signature.match(/../g)!.map(x=>parseInt(x,16))),enc.encode(params.toString()));
 if(!valid)return reply("Invalid signature",403);
 if(params.get("is_sandbox")==="1")return reply("ok");
 return reply("Live conversion processing not enabled",503);
});
