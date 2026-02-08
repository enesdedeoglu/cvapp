import React from 'react';
import { ResumeData, ResumeTheme } from '../types';
import { ResumeTemplateRenderer } from './ResumeTemplates';

interface ResumePreviewProps {
  data: ResumeData;
  theme?: ResumeTheme;
  scale?: number;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ 
  data, 
  theme = { templateId: 'modern', primaryColor: '#4F46E5', fontFamily: 'sans' }, 
  scale = 1 
}) => {
  return (
    /* 
      Wrapper to constrain width to the scaled size. 
      This allows margin:auto to center it perfectly in the parent flex container.
    */
    <div 
      className="transition-all duration-200 ease-out print:w-full print:block"
      style={{
        width: `${210 * scale}mm`, // Explicitly set width to match visual scaled width
        margin: '0 auto', // Center horizontally
      }}
    >
      <div 
        id="resume-content"
        className="bg-white shadow-2xl print:shadow-none print:!transform-none print:!w-full print:!m-0"
        style={{ 
          width: '210mm', 
          minHeight: '297mm',
          padding: '15mm',
          // Scale logic
          transform: `scale(${scale})`,
          transformOrigin: 'top left', // Scale from the corner to fit the wrapper
          // Hack to reduce the empty vertical space caused by scaling
          marginBottom: `-${(1 - scale) * 100}%`,
        }}
      >
        <ResumeTemplateRenderer data={data} theme={theme} />
        
        {/* Footer Decoration */}
        <div className="mt-12 pt-8 border-t border-gray-100 text-center print:hidden">
           <p className="text-[10px] text-gray-300">Created with CV-Genius AI</p>
        </div>
      </div>
    </div>
  );
};