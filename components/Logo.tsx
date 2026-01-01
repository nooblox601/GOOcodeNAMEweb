
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center text-3xl font-bold cursor-default select-none transition-transform hover:scale-105 duration-300">
      <span className="text-[#4285F4]">&lt;g</span>
      <span className="text-[#EA4335]">o</span>
      <span className="text-[#FBBC05]">o</span>
      <span className="text-[#4285F4]">g</span>
      <span className="text-[#34A853]">l</span>
      <span className="text-[#EA4335]">e</span>
      <span className="text-[#5F6368]">&gt;.js</span>
    </div>
  );
};

export default Logo;
