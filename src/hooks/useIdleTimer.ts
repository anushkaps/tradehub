import { useEffect, useRef } from 'react';
import { signOut } from '../services/authService';
import { toast } from 'react-toastify';

interface UseIdleTimerProps {
  timeout?: number; // in minutes
  onTimeout?: () => void;
  onActivity?: () => void;
}

export const useIdleTimer = ({
  timeout = 30,
  onTimeout,
  onActivity,
}: UseIdleTimerProps = {}) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      await signOut();
      toast.info('You have been logged out due to inactivity');
      if (onTimeout) {
        onTimeout();
      }
    }, timeout * 60 * 1000);

    if (onActivity) {
      onActivity();
    }
  };

  useEffect(() => {
    const events = [
      'mousemove',
      'keydown',
      'mousedown',
      'touchstart',
      'scroll',
      'resize',
    ];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });
    resetTimer();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [timeout, onTimeout, onActivity]);

  return { resetTimer };
};
