// src/lib/security.js
import { supabase } from './supabase';

export async function enforceDeviceFingerprint(userId) {
  if (!userId) return;

  // 1. Check if the device already has a permanent tracker
  let deviceId = localStorage.getItem('taskivo_device_hash');
  
  // 2. If not, generate one based on their hardware/browser footprint
  if (!deviceId) {
    const footprint = navigator.userAgent + screen.width + screen.height + navigator.hardwareConcurrency;
    // Simple hash function to create a short ID
    let hash = 0;
    for (let i = 0; i < footprint.length; i++) {
      hash = Math.imul(31, hash) + footprint.charCodeAt(i) | 0;
    }
    deviceId = `dev_${Math.abs(hash)}_${Date.now()}`;
    localStorage.setItem('taskivo_device_hash', deviceId);
  }

  // 3. Silently save this device ID to their Supabase profile
  await supabase
    .from('profiles')
    .update({ device_id: deviceId })
    .eq('id', userId)
    .is('device_id', null); // Only update if they don't have one yet
}
