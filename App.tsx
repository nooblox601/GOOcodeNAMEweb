
import React, { useState, useCallback, useEffect } from 'react';
import Logo from './components/Logo';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { CodeState, TabType } from './types';
import { generateDoodleCode } from './services/geminiService';
import { Sparkles, Play, RotateCcw, Ghost } from 'lucide-react';

const INITIAL_CODE: CodeState = {
  html: `<div class="doodle-container">
  <div class="circle"></div>
  <h1>Happy Coding!</h1>
</div>`,
  css: `.doodle-container {
  text-align: center;
}
.circle {
  width: 100px;
  height: 100px;
  background: #4285F4;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: bounce 2s infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}`,
  js: `console.log("Welcome to the <google>.js Doodle!");`
};

const App: React.FC = () => {
  const [code, setCode] = useState<CodeState>(INITIAL_CODE);
  const [activeTab, setActiveTab] = useState<TabType>('html');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleCodeChange = (value: string) => {
    setCode(prev => ({ ...prev, [activeTab]: value }));
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const generated = await generateDoodleCode(prompt);
      setCode(generated);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setCode(INITIAL_CODE);
    setPrompt('');
  };

  const handleLucky = async () => {
    const luckyPrompts = [
      "A colorful particle explosion",
      "A jumping Google logo",
      "A retro 8-bit game scene",
      "A morphing lava lamp animation",
      "A procedural flower garden",
      "Floating geometric shapes in space"
    ];
    const randomPrompt = luckyPrompts[Math.floor(Math.random() * luckyPrompts.length)];
    setPrompt(randomPrompt);
    setIsGenerating(true);
    try {
      const generated = await generateDoodleCode(randomPrompt);
      setCode(generated);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#f8f9fa] overflow-hidden">
      {/* Header */}
      <header className="px-8 py-4 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md z-10">
        <Logo />
        
        <div className="flex-1 max-w-2xl px-12">
          <div className="relative flex items-center group">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What kind of doodle should we build today?"
              className="w-full px-6 py-3 bg-[#f1f3f4] border border-transparent rounded-full focus:bg-white focus:border-[#4285F4] focus:shadow-md transition-all outline-none text-sm group-hover:bg-[#e8eaed]"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <div className="absolute right-2 flex space-x-1">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`p-2 rounded-full text-white transition-all ${isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#4285F4] hover:bg-[#3367d6] shadow-sm'}`}
              >
                {isGenerating ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={handleLucky}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Ghost className="w-4 h-4 text-[#FBBC05]" />
            <span>I'm Feeling Lucky</span>
          </button>
          <button 
            onClick={handleReset}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Reset to default"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex p-4 gap-4 overflow-hidden">
        {/* Sidebar Mini-Activity Bar */}
        <div className="w-16 flex flex-col items-center py-4 space-y-6 bg-white rounded-2xl border border-gray-100 hidden md:flex">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
             <Play className="w-6 h-6" />
          </div>
          <div className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer">
             <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1">
            <Editor 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              code={code[activeTab]} 
              onChange={handleCodeChange} 
            />
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 flex flex-col min-w-0">
           <Preview code={code} />
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-8 bg-[#4285F4] text-white flex items-center justify-between px-6 text-[10px] uppercase font-bold tracking-widest">
        <div className="flex items-center space-x-4">
          <span>Main Line: 42</span>
          <span>UTF-8</span>
          <span>{activeTab === 'js' ? 'JavaScript' : activeTab.toUpperCase()} Mode</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
            Connected to Gemini API
          </div>
        </div>
      </footer>

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-[#4285F4] border-r-[#EA4335] border-b-[#FBBC05] border-l-[#34A853] rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-bold text-gray-700 animate-pulse italic">
            Generating your <span className="text-[#4285F4]">&lt;google&gt;</span>.js doodle...
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
