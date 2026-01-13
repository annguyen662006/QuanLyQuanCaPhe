import React from 'react';
import { cn } from '../lib/utils';

interface FullScreenLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const FullScreenLayout: React.FC<FullScreenLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn("min-h-screen w-full flex items-center justify-center bg-[#111827] overflow-hidden relative", className)}>
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="relative z-10 w-full flex justify-center p-4">
        {children}
      </div>
    </div>
  );
};

export default FullScreenLayout;