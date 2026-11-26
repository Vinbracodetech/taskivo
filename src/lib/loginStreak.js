import {supabase} from './supabase';
export const loginSchedule=[3,5,10,15,20,25,30,40,50,60,70,80,90,100];
export async function claimLoginReward(){
 const {data,error}=await supabase.rpc('claim_daily_login');
 if(error||!data)throw error||new Error('Login reward unavailable');
 if(data.awarded_points!=null)window.dispatchEvent(new CustomEvent('taskivo_points_updated',{detail:{points:Number(data.awarded_points),emoji:'🔥'}}));
 window.dispatchEvent(new CustomEvent('taskivo_login_streak_updated',{detail:data}));
 return data;
}
