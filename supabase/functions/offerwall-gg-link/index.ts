import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const origins = new Set(["https://www.taskivo.online","https://taskivo.online"]);
const appId = "8542a96e28f4b8ade0318ce71a324144";
const enc = new TextEncoder();

Deno.serve(async (req) => {
  const origin=req.headers.get("origin") || "";
  const headers = new Headers({"content-type":"application/json","cache-control":"no-store","vary":"Origin"});
  if(origins.has(origin)) {
    headers.set("access-control-allow-origin",origin);
    headers.set("access-control-allow-headers","authorization, apikey, x-client-info, content-type");
    headers.set("access-control-allow-methods","POST, OPTIONS");
  }
  const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});
  if(req.method==="OPTIONS") return new Response(null,{status:204,headers});
  if(req.method!=="POST") return reply({error:"Method not allowed"},405);
  const token=req.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1];
  if(!token) return reply({error:"Sign in first"},401);
  const url=Deno.env.get("SUPABASE_URL"), anon=Deno.env.get("SUPABASE_ANON_KEY"), secret=Deno.env.get("OFFERWALL_GG_SECRET");
  if(!url||!anon||!secret) return reply({error:"Provider not configured"},503);
  const supabase=createClient(url,anon,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data,error}=await supabase.auth.getUser(token);
  if(error||!data.user||data.user.is_anonymous) return reply({error:"Sign in first"},401);
  // This remains disabled until wallet security and settlement are ready.
  if(Deno.env.get("OFFERWALL_GG_ENABLED")!=="true") return reply({enabled:false});
  const ts=String(Math.floor(Date.now()/1000)), userId=data.user.id;
  const params=new URLSearchParams({appId,ts,userId});
  params.sort();
  const key=await crypto.subtle.importKey("raw",enc.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const digest=await crypto.subtle.sign("HMAC",key,enc.encode(params.toString()));
  const signature=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,"0")).join("");
  const wall=new URL("https://offerwall.gg/wall/"+appId);
  wall.search=new URLSearchParams({userId,ts,signature}).toString();
  return reply({enabled:true,url:wall.toString()});
});
