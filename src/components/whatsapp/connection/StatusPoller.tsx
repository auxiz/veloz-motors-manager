
import React, { useEffect, useState } from 'react';

interface StatusPollerProps {
  userId?: string;
  checkConnectionStatus: () => Promise<void>;
}

export const StatusPoller: React.FC<StatusPollerProps> = ({
  userId,
  checkConnectionStatus
}) => {
  const [checkAttempts, setCheckAttempts] = useState(0);
  
  // Check connection status on initial load and set up polling with backoff
  useEffect(() => {
    console.log('StatusPoller component mounted');
    
    if (!userId) {
      console.log('User not logged in, skipping connection checks');
      return;
    }
    
    // Check status immediately
    checkConnectionStatus();
    
    // Set up polling for status updates with exponential backoff
    // Start with 30 seconds, max out at 5 minutes
    const minInterval = 30000; // 30 seconds
    const maxInterval = 300000; // 5 minutes
    const backoffFactor = 1.5;
    
    let currentInterval = minInterval;
    
    const scheduleNextCheck = () => {
      const timeoutId = setTimeout(async () => {
        console.log(`Checking connection status, interval: ${currentInterval / 1000}s`);
        
        try {
          await checkConnectionStatus();
          // Successful check, reset interval
          currentInterval = minInterval;
          setCheckAttempts(0);
        } catch (error) {
          // Failed check, increase backoff
          setCheckAttempts(prev => prev + 1);
          currentInterval = Math.min(currentInterval * backoffFactor, maxInterval);
          console.log(`Check failed, new interval: ${currentInterval / 1000}s`);
        }
        
        // Schedule next check
        scheduleNextCheck();
      }, currentInterval);
      
      return timeoutId;
    };
    
    const timeoutId = scheduleNextCheck();
    
    // Clean up on unmount
    return () => {
      clearTimeout(timeoutId);
    };
  }, [userId, checkConnectionStatus]);

  return null; // This is a behavior-only component with no UI
};
