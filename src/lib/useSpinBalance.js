import {useEffect,useState} from 'react';
import {supabase} from './supabase';
export function useLoginStreakBalance(userId){
 const [balance,setBalance]=useState(null);
 useEffect(()=>{let active=true;let revision=0;setBalance(null);if(!userId)return;
 async function load(){const n=++revision;try{const {data,error}=await supabase.rpc('daily_login_status');if(active&&n===revision)setBalance(error||!data?null:Number(data.credited_points||0));}catch{if(active&&n===revision)setBalance(null);}}
 function update(e){++revision;if(active)setBalance(Number(e.detail?.credited_points||0));}
 load();window.addEventListener('taskivo_login_streak_updated',update);return()=>{active=false;window.removeEventListener('taskivo_login_streak_updated',update);};
 },[userId]);return balance;
}
