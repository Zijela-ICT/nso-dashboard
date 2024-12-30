'use client';
import { useState } from 'react';

export const useForceUpdate = () => {
  const [, setValue] = useState(0);
  return () => setValue((v) => v + 1);
};
