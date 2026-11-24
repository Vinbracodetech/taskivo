import {useEffect,useState} from 'react';
import {supabase} from './supabase';
export function useReadingBalance(userId){
 const [balance,setBalance]=useState(null);
 useEffect(()=>{let active=true;setBalance(null);if(!userId)return;
 async function load(){try{const {data,error}=await supabase.from('reading_task_completions').select('points').eq('user_id',userId);if(active)setBalance(error?null:(data||[]).reduce((sum,row)=>sum+Number(row.points||0),0));}catch{if(active)setBalance(null);}}
 load();window.addEventListener('taskivo_reading_balance_updated',load);return()=>{active=false;window.removeEventListener('taskivo_reading_balance_updated',load);};
 },[userId]);
 return balance;
}
