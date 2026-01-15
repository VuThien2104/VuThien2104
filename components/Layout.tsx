import React, { ReactNode } from 'react';
import StarBackground from './StarBackground';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative w-full h-screen font-noto text-white overflow-hidden flex flex-col ${className}`}>
      <StarBackground />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default Layout;