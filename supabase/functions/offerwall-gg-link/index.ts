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
  if(!origins.has(origin)) return reply({error:"Origin not permitted"},403);
  const token=req.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1];
  if(!token) return reply({error:"Sign in first"},401);
  const url=Deno.env.get("SUPABASE_URL"), anon=Deno.env.get("SUPABASE_ANON_KEY"), secret=Deno.env.get("OFFERWALL_GG_SECRET");
  if(!url||!anon||!secret) return reply({error:"Provider not configured"},503);
  const supabase=createClient(url,anon,{global:{headers:{Authorization:"Bearer "+token}},auth:{persistSession:false,autoRefreshToken:false}});
  const {data,error}=await supabase.auth.getUser(token);
  if(error||!data.user||data.user.is_anonymous) return reply({error:"Sign in first"},401);
  const {data:profile,error:profileError}=await supabase.from("profiles").select("role").eq("id",data.user.id).single();
  if(profileError||!profile||!["admin","earner"].includes(profile.role)) return reply({enabled:false});
  // Restrict the live-domain pilot to the existing administrator account.
  const pilot = profile.role==="admin";
  const publicEnabled = profile.role==="earner" && Deno.env.get("OFFERWALL_GG_ENABLED")==="true";
  if(!pilot&&!publicEnabled) return reply({enabled:false});
  const ts=String(Math.floor(Date.now()/1000)), userId=data.user.id;
  const params=new URLSearchParams({appId,ts,userId});
  params.sort();
  const key=await crypto.subtle.importKey("raw",enc.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const digest=await crypto.subtle.sign("HMAC",key,enc.encode(params.toString()));
  const signature=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,"0")).join("");
  const wall=new URL("https://offerwall.gg/wall/"+appId);
  wall.search=new URLSearchParams({userId,ts,signature}).toString();
  // During the administrator pilot, check the provider's actual response before
  // rendering the iframe. Never log the signed URL, identity or secret.
  if(pilot) {
    try {
      const probe=async (link: URL)=>{
        const r=await fetch(link,{headers:{"accept":"text/html","referer":origin+"/"},redirect:"manual",signal:AbortSignal.timeout(5000)});
        const html=await r.text();
        return {status:r.status,invalid:r.status===403&&/invalid signature/i.test(html)};
      };
      const first=await probe(wall);
      console.info("offerwall entry pilot: documented form",JSON.stringify(first));
      if(first.invalid) {
        // appId is already part of the signed payload; sending it explicitly
        // keeps exactly the same authenticated parameters and expiry.
        const explicit=new URL(wall);
        explicit.searchParams.set("appId",appId);
        const second=await probe(explicit);
        console.info("offerwall entry pilot: explicit placement parameter",JSON.stringify(second));
        if(second.status===200) return reply({enabled:true,pilot,url:explicit.toString()});
        // Check whether the dashboard actually expects non-expiring signed links.
        // This diagnostic never returns a non-expiring link to the browser.
        const noTsParams=new URLSearchParams({appId,userId});
        noTsParams.sort();
        const noTsDigest=await crypto.subtle.sign("HMAC",key,enc.encode(noTsParams.toString()));
        const noTsSignature=Array.from(new Uint8Array(noTsDigest),b=>b.toString(16).padStart(2,"0")).join("");
        const noTs=new URL("https://offerwall.gg/wall/"+appId);
        noTs.search=new URLSearchParams({userId,signature:noTsSignature}).toString();
        const third=await probe(noTs);
        console.info("offerwall entry pilot: expiry configuration diagnostic",JSON.stringify(third));
        return reply({enabled:false,reason:third.status===200?"expiry_setting_mismatch":"signature_rejected"});
      }
    } catch { console.info("offerwall entry pilot: provider probe unavailable"); }
  }
  return reply({enabled:true,pilot,url:wall.toString()});
});
