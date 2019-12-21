import React, { useState, useCallback, useRef } from 'react';

/**
 * 
 * @param {number} ms interval between ticks
 * @param {number} value current tick value
 * @param {boolean} countdown sets direction of the timer 
 */
export function useCounter(ms, countdown) {
  const [count, setCount] = useState()
  const [total, setTotal] = useState(0)
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    if (intervalRef.current !== null) {
      return;
    }

    if (countdown) {
      intervalRef.current = setInterval(() => {
        setCount(c => c - 1)
        setTotal(t => t + 1)
      }, ms)

    }
    else {
      intervalRef.current = setInterval(() => {
        setCount(c => c + 1)
        setTotal(t => t + 1)
      }, ms)
    }
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current === null) {
      return;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const reset = useCallback(() => setCount(0), []);

  return { count, total, setCount, setTotal, start, stop, reset };
}