import React, { useState, useEffect, useRef } from 'react';

export const useInterval = (
  callback: Function,
  delay: number,
  dependencies: Array<any>
) => {
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(callback, delay);
      return () => clearInterval(id);
    }
  }, [delay, ...dependencies]);
};
