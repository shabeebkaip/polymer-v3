"use client";

import React from 'react';
import { useProductRequestDetailStore } from '@/stores/user';

const TestComponent = () => {
  console.log('Testing store import...');
  
  try {
    const store = useProductRequestDetailStore();
    console.log('Store imported successfully:', typeof store);
    return <div>Store test successful</div>;
  } catch (error) {
    console.error('Store import error:', error);
    return <div>Store test failed: {error?.toString()}</div>;
  }
};

export default TestComponent;
