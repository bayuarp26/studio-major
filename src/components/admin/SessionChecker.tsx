'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function SessionChecker() {
  const router = useRouter();
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRedirectingRef = useRef(false);
  const currentSessionIdRef = useRef<string | null>(null);

  const handleSessionInvalid = async (reason: string) => {
    if (isRedirectingRef.current) return;
    
    isRedirectingRef.current = true;
    
    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    console.log('Session terminated, reason:', reason);

    // Show toast notification
    toast({
      title: "Session Terminated", 
      description: "Your session has been terminated by another admin login.",
      variant: "destructive",
    });

    // Clean logout
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    
    // Redirect after showing toast
    setTimeout(() => {
      router.push('/admin/login?error=Session terminated by another login.');
    }, 1500);
  };

  const checkSession = async () => {
    if (isRedirectingRef.current) return;

    try {
      const response = await fetch('/api/admin/check-session', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-cache'
      });

      if (response.ok) {
        const data = await response.json();
        
        // First check - initialize session ID
        if (!currentSessionIdRef.current) {
          currentSessionIdRef.current = data.sessionId;
          console.log('SessionChecker initialized with sessionId:', data.sessionId);
          return;
        }
        
        // Check if session ID changed (new login detected)
        if (data.sessionId !== currentSessionIdRef.current) {
          console.log('Session replaced:', currentSessionIdRef.current, '->', data.sessionId);
          await handleSessionInvalid('Session replaced by newer login');
          return;
        }
        
      } else {
        // Session is invalid
        const data = await response.json();
        await handleSessionInvalid(data.reason || 'Session validation failed');
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };

  useEffect(() => {
    if (isRedirectingRef.current) return;

    // Start session monitoring immediately
    checkSession();

    // Check every 15 seconds (more efficient, less database load)
    intervalRef.current = setInterval(checkSession, 15000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return null;
}
