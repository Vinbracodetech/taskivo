import {useEffect,useState} from 'react';
import {supabase} from './supabase';
export function useWalletSummary(userId,view){
 const [state,setState]=useState(null);
 useEffect(()=>{
  let live=true,sequence=0;
  if(!userId){setState(null);return;}
  async function load(){
   const n=++sequence;
   try{const {data,error}=await supabase.rpc('wallet_points_summary');
    if(!live||n!==sequence)return;
    setState({userId,total:error||!data?null:Number(data.total_points),readingCount:error||!data?null:Number(data.reading_count)});
   }catch{if(live&&n===sequence)setState({userId,total:null,readingCount:null});}
  }
  function refresh(){if(!document.hidden)load();}
  refresh();
  const timer=setInterval(refresh,60000);
  const events=['taskivo_points_updated','taskivo_reading_balance_updated','taskivo_login_streak_updated','focus'];
  events.forEach(e=>window.addEventListener(e,refresh));
  document.addEventListener('visibilitychange',refresh);
  return()=>{live=false;clearInterval(timer);events.forEach(e=>window.removeEventListener(e,refresh));document.removeEventListener('visibilitychange',refresh);};
 },[userId,view]);
 return state?.userId===userId?state:{total:null,readingCount:null};
}
