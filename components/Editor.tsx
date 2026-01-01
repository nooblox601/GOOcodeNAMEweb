
import React from 'react';
import { TabType } from '../types';

interface EditorProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  code: string;
  onChange: (value: string) => void;
  minimal?: boolean;
}

// Fixed: Added setActiveTab to the destructured props so it can be used within the component
const Editor: React.FC<EditorProps> = ({ activeTab, setActiveTab, code, onChange, minimal = false }) => {
  return (
    <div className={`flex flex-col h-full bg-[#0f172a] overflow-hidden ${minimal ? '' : 'rounded-2xl shadow-sm border border-slate-800'}`}>
      {!minimal && (
        <div className="flex border-b border-slate-800 bg-[#1e293b]/50">
          {(['html', 'css', 'js'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-200 border-b-2 ${
                activeTab === tab 
                  ? 'text-blue-400 border-blue-400 bg-blue-500/10'
                  : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}
      <div className="flex-1 relative">
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="w-full h-full p-6 font-mono text-sm leading-relaxed outline-none resize-none bg-transparent text-slate-300 focus:text-white transition-colors"
          placeholder={`// Edit ${activeTab.toUpperCase()} code here...`}
        />
        <div className="absolute top-4 right-6 text-[10px] text-slate-700 font-mono pointer-events-none uppercase tracking-[0.2em] font-bold">
          {activeTab} engine
        </div>
      </div>
    </div>
  );
};

export default Editor;
