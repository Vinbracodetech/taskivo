# Offerwall.GG staging setup

Placement: Taskivo, 533 PTS per USD of publisher revenue. The existing wallet values each PTS at USD 0.00075, so 533 PTS represents about 39.975% of the publisher commission. Do not deduct the share twice.

1. Back up the existing Taskivo Supabase database. Confirm the project is eartsscxtqxaelopmjmq, not Pagmich. Review the SQL migration, especially the profiles(id) UUID foreign key. Apply only after confirmation.
2. In Taskivo Edge Function secrets create OFFERWALL_GG_SECRET using the secret from the publisher dashboard. Never commit or paste it in chat. Supabase injects SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
3. Deploy the function offerwall-gg-postback with JWT verification disabled for this function alone. It authenticates every callback using the provider's HMAC signature. CLI: supabase functions deploy offerwall-gg-postback --no-verify-jwt --project-ref eartsscxtqxaelopmjmq
4. In Offerwall.GG placement settings set:
   https://eartsscxtqxaelopmjmq.supabase.co/functions/v1/offerwall-gg-postback?user={userId}&tx={transactionId}&amount={currencyAmount}&sig={signature}&status={status}&test={test}
5. Test using a made-up non-UUID user ID, never a real user ID. Expect HTTP 200 and no ledger insert. The HMAC does not sign the test flag, so keep test IDs outside the valid UUID namespace. Verify duplicate and reversal handling with authorized sandbox fixtures before enabling.
6. Keep the offerwall disabled until the placement is approved, signed-link format is verified with the provider, payout funding/settlement controls are implemented, and Nigerian inventory is confirmed. No task rewards are withdrawable based solely on a postback. Reconcile provider statement, reversals and bank receipts before implementing release to the existing wallet.
7. Check existing profiles RLS, role authorization, withdrawal atomicity and reward RPCs before any launch. The current frontend has direct balance writes; this migration does not fix those paths.
