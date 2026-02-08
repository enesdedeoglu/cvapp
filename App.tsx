import React, { useState, useEffect, useRef } from 'react';
import { ResumeForm } from './components/ResumeForm';
import { ResumePreview } from './components/ResumePreview';
import { DesignPanel } from './components/DesignPanel';
import { ResumeData, ResumeTheme } from './types';
import { INITIAL_RESUME_STATE, MOCK_RESUME_STATE } from './constants';
import { Eye, Download, Sparkles, Pencil, Palette, Loader2 } from 'lucide-react';

const INITIAL_THEME: ResumeTheme = {
  templateId: 'modern',
  primaryColor: '#4F46E5',
  fontFamily: 'sans',
};

function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_STATE);
  const [resumeTheme, setResumeTheme] = useState<ResumeTheme>(INITIAL_THEME);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [sidebarTab, setSidebarTab] = useState<'content' | 'design'>('content');
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Dynamic scaling state
  const [previewScale, setPreviewScale] = useState(1);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Load mock data for demonstration if empty
  useEffect(() => {
    // Only set mock data if everything is empty
    if (!resumeData.personalDetails.fullName) {
      setResumeData(MOCK_RESUME_STATE);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate the perfect scale for the resume preview
  useEffect(() => {
    const calculateScale = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth;
        // A4 width in pixels at 96 DPI is approximately 794px (210mm)
        const a4WidthPx = 794; 
        // Add some padding (32px = 1rem left + 1rem right) so it doesn't touch edges
        const padding = 32; 
        
        const availableWidth = containerWidth - padding;
        
        // Calculate ratio
        let newScale = availableWidth / a4WidthPx;
        
        // Clamp scale: Max 1 (don't zoom in on huge screens), Min 0.1
        if (newScale > 1) newScale = 1;
        
        setPreviewScale(newScale);
      }
    };

    // Use ResizeObserver to handle container resizing (sidebar toggle, window resize, mobile orientation)
    const observer = new ResizeObserver(() => {
      // Wrap in requestAnimationFrame to avoid "ResizeObserver loop limit exceeded"
      requestAnimationFrame(calculateScale);
    });

    if (previewContainerRef.current) {
      observer.observe(previewContainerRef.current);
    }

    // Initial calculation
    calculateScale();

    return () => {
      observer.disconnect();
    };
  }, [activeTab]); // Re-run when tab changes as container visibility changes

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    
    // Get the element
    const element = document.getElementById('resume-content');
    if (!element) {
      setIsDownloading(false);
      return;
    }

    try {
      // Options for html2pdf
      const opt = {
        margin: 0,
        filename: `${resumeData.personalDetails.fullName || 'Resume'}_CV-Genius.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Since the ResumePreview component might be scaled (css transform) for preview,
      // we need to ensure we capture a version that is 1:1 scale (A4 size).
      // html2pdf usually captures the rendered state.
      
      // Clone the element to manipulate it for PDF generation without affecting UI
      const clone = element.cloneNode(true) as HTMLElement;
      
      // Reset transform on clone to ensure it's not captured as a mini-preview
      clone.style.transform = 'none';
      clone.style.margin = '0';
      clone.style.boxShadow = 'none';
      
      // We need to append it to the document to render it, but hide it
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.top = '-9999px';
      container.style.left = '0px';
      container.appendChild(clone);
      document.body.appendChild(container);

      // Generate PDF from the clone
      if (typeof window.html2pdf !== 'undefined') {
         await window.html2pdf().set(opt).from(clone).save();
      } else {
         alert("PDF library loading... Please try again in a few seconds.");
      }

      // Cleanup
      document.body.removeChild(container);
      
    } catch (err) {
      console.error("PDF Generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col h-screen overflow-hidden font-sans text-gray-900 print:h-auto print:overflow-visible">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm z-10 flex-shrink-0 h-16 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              CV-Genius
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Mobile/Tablet Toggle */}
             <div className="lg:hidden flex bg-gray-100 rounded-lg p-1">
               <button 
                 onClick={() => setActiveTab('editor')}
                 className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'editor' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
               >
                 Editor
               </button>
               <button 
                 onClick={() => setActiveTab('preview')}
                 className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'preview' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
               >
                 Preview
               </button>
             </div>

             <button 
               onClick={handleDownloadPDF}
               disabled={isDownloading}
               className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-3 py-2 sm:px-4 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-wait"
               title="Download PDF"
             >
               {isDownloading ? (
                 <Loader2 className="w-4 h-4 animate-spin" />
               ) : (
                 <Download className="w-4 h-4" />
               )}
               <span className="hidden sm:inline">{isDownloading ? 'Generating...' : 'Download PDF'}</span>
             </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden print:overflow-visible print:block print:h-auto">
        
        {/* Sidebar Panel (Editor/Design) */}
        <div className={`
          flex-1 overflow-y-auto bg-gray-50 border-r border-gray-200 transition-all duration-300 flex flex-col print:hidden
          ${activeTab === 'editor' ? 'block' : 'hidden lg:block'} 
          lg:w-1/2 xl:w-5/12
        `}>
          {/* Sidebar Tabs */}
          <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
            <button
              onClick={() => setSidebarTab('content')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                sidebarTab === 'content' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Pencil className="w-4 h-4" /> Content
            </button>
            <button
               onClick={() => setSidebarTab('design')}
               className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                sidebarTab === 'design' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Palette className="w-4 h-4" /> Design
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
             {sidebarTab === 'content' ? (
               <ResumeForm data={resumeData} onChange={setResumeData} />
             ) : (
               <DesignPanel theme={resumeTheme} onChange={setResumeTheme} />
             )}
          </div>
        </div>

        {/* Preview Panel */}
        <div 
          ref={previewContainerRef}
          id="preview-container"
          className={`
            flex-1 overflow-y-auto bg-gray-200/50 flex flex-col items-center justify-start py-8 px-4
            ${activeTab === 'preview' ? 'block' : 'hidden lg:flex'}
            lg:w-1/2 xl:w-7/12 relative
            print:block print:w-full print:bg-white print:p-0 print:overflow-visible print:absolute print:top-0 print:left-0
        `}>
           <div className="mb-4 text-sm text-gray-500 flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200 print:hidden">
             <Eye className="w-4 h-4" />
             Live Preview
           </div>
           
           {/* Responsive Container for ResumePreview */}
           {/* We remove hardcoded scale classes and pass the calculated scale prop instead */}
           <ResumePreview data={resumeData} theme={resumeTheme} scale={previewScale} />
        </div>
      </main>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          body {
            background: white !important;
            color: black !important;
          }
          /* Ensure all non-print elements are hidden */
          nav, .print\\:hidden {
            display: none !important;
          }
          
          /* Reset main container layout */
          #root, main {
            height: auto !important;
            overflow: visible !important;
            display: block !important;
          }

          /* Preview container full width */
          #preview-container {
            position: static !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            background: white !important;
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Force backgrounds to print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;