import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const reply = (body: string, status = 200) => new Response(body, { status, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
const enc = new TextEncoder();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
Deno.serve(async (req) => {
  if (req.method !== "GET") return reply("Method not allowed", 405);
  const q = new URL(req.url).searchParams;
  for (const name of ["user","tx","status","reward","hash"]) {
    if (q.getAll(name).length !== 1) return reply("Invalid parameters",400);
  }
  const user=q.get("user")!, tx=q.get("tx")!, status=q.get("status")!, reward=q.get("reward")!, hash=q.get("hash")!;
  if (!user || user.length>200 || !tx || tx.length>200 || /[:\u0000-\u001f]/.test(user+tx) || !["1","2"].includes(status) || !/^\d{1,9}(?:\.0{1,6})?$/.test(reward) || !/^[a-f0-9]{64}$/.test(hash)) return reply("Invalid parameters",400);
  const secret=Deno.env.get("MOONETIX_POSTBACK_KEY"), url=Deno.env.get("SUPABASE_URL"), service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!secret || !url || !service) return reply("Not configured",503);
  try {
    const key=await crypto.subtle.importKey("raw",enc.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["verify"]);
    const valid=await crypto.subtle.verify("HMAC",key,Uint8Array.from(hash.match(/../g)!.map(x=>parseInt(x,16))),enc.encode([tx,user,reward,status].join(":")));
    if (!valid) return reply("Invalid signature",403);
    const test=tx.startsWith("test_");
    if (test ? uuid.test(user) : !uuid.test(user)) return reply("Invalid user for event mode",400);
    const db=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
    if (!test) {
      const {data,error}=await db.from("profiles").select("id").eq("id",user).maybeSingle();
      if(error) return reply("Storage unavailable",503);
      if(!data) return reply("Unknown user",400);
    }
    // Stage authenticated events only. No wallet mutations, including on reversals.
    // Never use unsigned payout or event_id to calculate or deduplicate rewards.
    const row={transaction_id:tx,status:Number(status),external_user_id:user,reward_points:Number(reward),is_test:test};
    const {error}=await db.from("moonetix_events").insert(row);
    if (!error) return reply("ok");
    if (error.code!=="23505") return reply("Storage unavailable",503);
    const {data,error:readError}=await db.from("moonetix_events").select("external_user_id,reward_points,is_test").eq("transaction_id",tx).eq("status",Number(status)).single();
    if(readError||!data) return reply("Storage unavailable",503);
    if(data.external_user_id!==user||Number(data.reward_points)!==Number(reward)||data.is_test!==test) return reply("Conflicting event",409);
    return reply("ok");
  } catch { return reply("Storage unavailable",503); }
});