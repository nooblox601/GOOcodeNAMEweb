
import React, { useEffect, useState } from 'react';
import { CodeState } from '../types';

interface PreviewProps {
  code: CodeState;
}

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <style>
              body { margin: 0; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: transparent; }
              ${code.css}
            </style>
          </head>
          <body>
            ${code.html}
            <script>${code.js}</script>
          </body>
        </html>
      `);
    }, 250);

    return () => clearTimeout(timeout);
  }, [code]);

  return (
    <div className="w-full h-full bg-[#f1f3f4] rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center relative">
      <div className="absolute top-3 left-3 flex space-x-1.5 opacity-30">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
      </div>
      <iframe
        srcDoc={srcDoc}
        title="preview"
        sandbox="allow-scripts"
        frameBorder="0"
        width="100%"
        height="100%"
        className="w-full h-full"
      />
    </div>
  );
};

export default Preview;
