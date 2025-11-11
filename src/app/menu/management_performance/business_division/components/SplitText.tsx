'use client';

import { useEffect, useState } from 'react';

export function SplitText() {
  const [isSplit, setIsSplit] = useState(false);
  const combinedText = "하나로TNS";
  const leftSplitText = "2025년";
  const centerSplitText = "하나로TNS";
  const rightSplitText = "사업부별실적";
  
  const leftText = (
    <div className={`absolute transition-all duration-500 ease-in-out whitespace-nowrap text-white ${
      isSplit ? '-translate-x-[140%] text-blue-300' : 'translate-x-0 opacity-0'
    }`}>
      {leftSplitText}
    </div>
  );

  const centerSplitTextElement = (
    <div className={`absolute transition-all duration-500 ease-in-out whitespace-nowrap text-white ${
      isSplit ? 'text-green-300' : 'translate-y-0 opacity-0'
    }`}>
      {centerSplitText}
    </div>
  );
  
  const rightText = (
    <div className={`absolute transition-all duration-500 ease-in-out whitespace-nowrap text-white ${
      isSplit ? 'translate-x-[110%] text-rose-300' : 'translate-x-0 opacity-0'
    }`}>
      {rightSplitText}
    </div>
  );

  const combinedTextElement = (
    <div className={`absolute transition-all duration-500 ease-in-out whitespace-nowrap text-white ${
      isSplit ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
    }`}>
      {combinedText}
    </div>
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplit(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative py-3">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
        <span className="sr-only">{combinedText}</span>
        
        <div className="relative flex justify-center items-center min-h-[1.2em]">
          <div className="relative w-[600px] h-[1.2em] flex justify-center items-center overflow-visible">
            <div className="absolute inset-0 flex justify-center items-center">
              {combinedTextElement}
              {leftText}
              {centerSplitTextElement}
              {rightText}
            </div>
          </div>
        </div>
      </h2>

      <div className={`absolute inset-0 transition-all duration-500 pointer-events-none ${
        isSplit ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-green-500/20 to-rose-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-white/5 blur-xl rounded-full scale-105" />
      </div>
    </div>
  );
}

