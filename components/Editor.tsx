
import React from 'react';
import { TabType } from '../types';

interface EditorProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  code: string;
  onChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ activeTab, setActiveTab, code, onChange }) => {
  const tabs: TabType[] = ['html', 'css', 'js'];
  
  const getColors = (tab: TabType) => {
    switch(tab) {
      case 'html': return 'text-orange-500 border-orange-500 bg-orange-50';
      case 'css': return 'text-blue-500 border-blue-500 bg-blue-50';
      case 'js': return 'text-yellow-600 border-yellow-600 bg-yellow-50';
      default: return 'text-gray-500 border-gray-500';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-200 border-b-2 ${
              activeTab === tab 
                ? getColors(tab)
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            {tab === 'js' ? 'JavaScript' : tab}
          </button>
        ))}
      </div>
      <div className="flex-1 relative">
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="w-full h-full p-4 code-font text-sm leading-relaxed outline-none resize-none bg-transparent text-[#202124]"
          placeholder={`Write your ${activeTab.toUpperCase()} code here...`}
        />
        <div className="absolute top-2 right-4 text-xs text-gray-300 font-mono pointer-events-none">
          {activeTab.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default Editor;
