import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log("Taskivo Payment Webhook Engine Initialized.");

serve(async (req) => {
  try {
      // 1. Parse the incoming payment confirmation from Stripe or Paystack
          const payload = await req.json();
              
                  // 2. Find the Task ID (Stripe and Paystack format metadata slightly differently)
                      const taskId = payload.data?.metadata?.task_id || payload.data?.object?.metadata?.task_id;

                          if (!taskId) {
                                throw new Error("No Task ID found in payment metadata.");
                                    }

                                        console.log(`Payment confirmed for Task ID: ${taskId}. Activating campaign...`);

                                            // 3. Connect to Supabase using the secure Admin Key to bypass security rules
                                                const supabaseAdmin = createClient(
                                                      Deno.env.get('SUPABASE_URL') ?? '',
                                                      
                                                            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
                                                                );

                                                                    // 4. Flip the campaign status from 'pending_payment' to 'active'
                                                                        const { error } = await supabaseAdmin
                                                                              .from('tasks')
                                                                                    .update({ status: 'active' })
                                                                                          .eq('id', taskId);

                                                                                              if (error) throw error;

                                                                                                  // 5. Send a success signal back to the payment gateway
                                                                                                      return new Response(
                                                                                                            JSON.stringify({ success: true, message: `Campaign ${taskId} is now live.` }),
                                                                                                                  { headers: { "Content-Type": "application/json" }, status: 200 }
                                                                                                                      );

                                                                                                                        } catch (error) {
                                                                                                                            console.error("Webhook Error:", error.message);
                                                                                                                                return new Response(
                                                                                                                                      JSON.stringify({ error: error.message }),
                                                                                                                                            { headers: { "Content-Type": "application/json" }, status: 400 }
                                                                                                                                                );
                                                                                                                                                  }
                                                                                                                                                  });
