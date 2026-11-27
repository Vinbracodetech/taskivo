import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const allowed = new Set(["https://taskivo.online", "https://www.taskivo.online"]);
const appId = "808a5b2fd2760f39ed2cd6ea";
const enc = new TextEncoder();

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  const headers = new Headers({"content-type":"application/json","cache-control":"no-store","vary":"Origin"});
  if (allowed.has(origin)) {
    headers.set("access-control-allow-origin",origin);
    headers.set("access-control-allow-headers","authorization, apikey, x-client-info, content-type");
    headers.set("access-control-allow-methods","POST, OPTIONS");
  }
  const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});
  if(!allowed.has(origin)) return reply({error:"Origin not permitted"},403);
  if(req.method==="OPTIONS") return new Response(null,{status:204,headers});
  if(req.method!=="POST") return reply({error:"Method not allowed"},405);
  const token=req.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1];
  if(!token) return reply({error:"Sign in first"},401);
  const url=Deno.env.get("SUPABASE_URL"), anon=Deno.env.get("SUPABASE_ANON_KEY");
  if(!url||!anon) return reply({error:"Not configured"},503);
  const supabase=createClient(url,anon,{global:{headers:{Authorization:"Bearer "+token}},auth:{persistSession:false,autoRefreshToken:false}});
  const {data,error}=await supabase.auth.getUser(token);
  if(error||!data.user||data.user.is_anonymous) return reply({error:"Sign in first"},401);
  // Fail closed until reward settlement, reversal handling and the launch review are complete.
  if(Deno.env.get("MOONETIX_LIVE_ENABLED")!=="true") return reply({enabled:false});
  const {data:profile,error:profileError}=await supabase.from("profiles").select("role").eq("id",data.user.id).single();
  if(profileError||!profile||!["admin","earner"].includes(profile.role)) return reply({enabled:false});
  const salt=Deno.env.get("MOONETIX_LINK_HASH_SALT");
  if(!salt) return reply({error:"Provider not configured"},503);
  const userId=data.user.id;
  const key=await crypto.subtle.importKey("raw",enc.encode(salt),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const bytes=new Uint8Array(await crypto.subtle.sign("HMAC",key,enc.encode(userId)));
  const hash=Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join("");
  const wall=new URL("https://wall.moonetix.com/"+appId);
  wall.search=new URLSearchParams({user_id:userId,hash}).toString();
  return reply({enabled:true,url:wall.toString()});
});