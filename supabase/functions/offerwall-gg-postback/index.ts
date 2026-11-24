import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const response = (body: string, status = 200) => new Response(body,{status,headers:{"content-type":"text/plain; charset=utf-8","cache-control":"no-store"}});
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const enc = new TextEncoder();

async function signature(secret: string, payload: string, supplied: string) {
  if (!/^[a-fA-F0-9]{64}$/.test(supplied)) return false;
  const key = await crypto.subtle.importKey("raw",enc.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["verify"]);
  const bytes = Uint8Array.from(supplied.match(/../g)!.map(v=>parseInt(v,16)));
  return crypto.subtle.verify("HMAC",key,bytes,enc.encode(payload));
}

Deno.serve(async (req) => {
  if (req.method !== "GET") return response("method not allowed",405);
  const secret=Deno.env.get("OFFERWALL_GG_SECRET");
  const url=Deno.env.get("SUPABASE_URL");
  const service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if(!secret || !url || !service) return response("not configured",503);
  const q=new URL(req.url).searchParams;
  for(const name of ["user","tx","amount","sig","status","test"]) {
    if(q.getAll(name).length!==1) return response("invalid parameters",400);
  }
  const user=q.get("user")!, tx=q.get("tx")!, amount=q.get("amount")!, sig=q.get("sig")!, status=q.get("status")!, test=q.get("test")!;
  if(!user || user.length>200 || !tx || tx.length>200 || /[:\u0000-\u001f]/.test(user+tx) || !/^-?\d{1,12}(?:\.\d{1,6})?$/.test(amount)) return response("invalid parameters",400);
  if(!await signature(secret,user+":"+tx+":"+amount,sig)) return response("invalid signature",403);
  // The provider's HMAC covers user, tx and amount only. Test callbacks must use
  // an intentionally non-UUID test user; never use a real account for tests.
  // Acknowledge tests without touching the database.
  if(test==="1") return response("ok");
  if(test!=="" && test!=="0") return response("invalid test flag",400);
  if(!uuid.test(user)) return response("invalid user",400);
  const pts=Number(amount);
  if(!Number.isFinite(pts)||pts===0) return response("invalid amount",400);
  const kind=pts>0?"credited":"reversed";
  if(status!==kind) return response("invalid status",400);
  // No wallet balance changes. An authenticated provider event records a pending
  // credit or reversal; unsigned payoutUsd/offerName fields are not trusted.
  const db=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
  try {
    const event={transaction_id:tx,event_type:kind,user_id:user,amount_pts:amount};
    const {error}=await db.from("offerwall_gg_events").insert(event);
    if(!error) return response("ok");
    if(error.code!=="23505") return response("storage unavailable",503);
    const {data,error:readError}=await db.from("offerwall_gg_events").select("user_id,amount_pts").eq("transaction_id",tx).eq("event_type",kind).single();
    if(readError || !data) return response("storage unavailable",503);
    if(data.user_id.toLowerCase()!==user.toLowerCase() || Number(data.amount_pts)!==pts) return response("conflicting event",409);
    return response("ok");
  } catch { return response("storage unavailable",503); }
});
