'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function SessionTester() {
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const checkSession = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('/api/admin/check-session', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Session Valid",
          description: `Session active (ID: ${data.sessionId?.substring(0, 8)}...)`,
          variant: "default",
        });
      } else {
        toast({
          title: "Session Invalid",
          description: `${data.reason || 'Session check failed'} ${data.sessionId ? `(ID: ${data.sessionId.substring(0, 8)}...)` : ''}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: 'Failed to check session',
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const debugUser = async () => {
    try {
      const response = await fetch('/api/admin/debug-user?username=085156453246', {
        method: 'GET',
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "User Data",
          description: `Active Session: ${data.activeSessionId?.substring(0, 8) || 'None'}... | Last Login: ${data.lastLoginAt ? new Date(data.lastLoginAt).toLocaleTimeString() : 'Never'}`,
          variant: "default",
        });
      } else {
        toast({
          title: "Debug Error",
          description: data.error || 'Failed to get user data',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: 'Failed to debug user',
        variant: "destructive",
      });
    }
  };

  const forceLogoutAll = async () => {
    try {
      const response = await fetch('/api/admin/force-logout-all', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `All sessions terminated by ${data.terminatedBy}`,
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to terminate sessions',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: 'Failed to terminate sessions',
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-4 p-4 border rounded-lg">
      <Button 
        onClick={checkSession} 
        disabled={isChecking}
        variant="outline"
      >
        {isChecking ? 'Checking...' : 'Check Session'}
      </Button>
      
      <Button 
        onClick={debugUser}
        variant="secondary"
      >
        Debug User
      </Button>
      
      <Button 
        onClick={forceLogoutAll}
        variant="destructive"
      >
        Force Logout All
      </Button>
    </div>
  );
}
