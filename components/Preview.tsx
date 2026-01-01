
import React, { useEffect, useState } from 'react';
import { CodeState } from '../types';

interface PreviewProps {
  code: CodeState;
  transparent?: boolean;
}

const Preview: React.FC<PreviewProps> = ({ code, transparent = false }) => {
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <style>
              body { 
                margin: 0; 
                padding: 0;
                font-family: 'Product Sans', sans-serif; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                height: 100vh; 
                background: transparent; 
                overflow: hidden; 
              }
              ${code.css}
            </style>
          </head>
          <body>
            ${code.html}
            <script>
              try {
                ${code.js}
              } catch (e) {
                console.error("Doodle Error:", e);
              }
            </script>
          </body>
        </html>
      `);
    }, 200);

    return () => clearTimeout(timeout);
  }, [code]);

  return (
    <div className={`w-full h-full overflow-hidden relative ${transparent ? 'bg-transparent' : 'bg-[#f1f3f4] rounded-2xl border border-gray-100'}`}>
      <iframe
        srcDoc={srcDoc}
        title="doodle-preview"
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
