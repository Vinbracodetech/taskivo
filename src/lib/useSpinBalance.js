import {useEffect,useState} from 'react';
import {supabase} from './supabase';
export function useSpinBalance(userId){
 const [balance,setBalance]=useState(null);
 useEffect(()=>{let active=true;setBalance(null);if(!userId)return;
 async function load(){try{const {data,error}=await supabase.rpc('daily_spin_status');if(active)setBalance(error||!data?null:Number(data.pending_points||0));}catch{if(active)setBalance(null);}}
 load();window.addEventListener('taskivo_spin_balance_updated',load);return()=>{active=false;window.removeEventListener('taskivo_spin_balance_updated',load);};
 },[userId]);
 return balance;
}
