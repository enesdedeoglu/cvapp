import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Upload, Wand2, Image as ImageIcon, X, Move, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './Button';
import { editProfileImage } from '../services/geminiService';
import { PhotoConfig } from '../types';

interface ImageEditorProps {
  currentImage: string | null;
  config?: PhotoConfig;
  onChange: (updates: { image?: string | null, config?: PhotoConfig }) => void;
}

const DEFAULT_CONFIG: PhotoConfig = { x: 50, y: 50, zoom: 1 };

export const ImageEditor: React.FC<ImageEditorProps> = ({ 
  currentImage, 
  config = DEFAULT_CONFIG,
  onChange
}) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
         setError("Image size too large. Please use an image under 5MB.");
         return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update both image and reset config atomically
        onChange({ 
          image: reader.result as string, 
          config: DEFAULT_CONFIG 
        });
        setError(null);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so the same file can be selected again if needed
    e.target.value = '';
  };

  const handleMagicEdit = async () => {
    if (!currentImage || !prompt.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const newImage = await editProfileImage(currentImage, prompt);
      onChange({ image: newImage });
      setPrompt(''); 
    } catch (err) {
      setError("Failed to process image. Please try again.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerFileInput = () => {
    if (!currentImage) {
      fileInputRef.current?.click();
    }
  };

  // --- Drag & Drop Logic ---

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!currentImage) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.preventDefault(); // Prevent default drag behavior
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !currentImage) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setDragStart({ x: e.clientX, y: e.clientY });

    // New Translate Logic:
    // We are translating the image element itself relative to center.
    // 50 is center (0 translation).
    // Dragging right (deltaX > 0) -> we want image to move right -> translate increases.
    // Sensitivity: 0.5% per pixel seems decent.
    const newX = config.x + deltaX * 0.5;
    const newY = config.y + deltaY * 0.5;
    
    onChange({ config: { ...config, x: newX, y: newY } });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mouseleave', handleMouseUp);
    } else {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isDragging]);

  // Styles to match ResumeTemplates Logic
  const tx = config.x - 50;
  const ty = config.y - 50;
  const imageStyle = {
    transform: `scale(${config.zoom}) translate(${tx}%, ${ty}%)`,
    transformOrigin: 'center center'
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-indigo-600" />
          Profile Photo
        </h3>
        {currentImage && (
             <button 
             onClick={() => onChange({ image: null })}
             className="text-xs text-red-500 hover:text-red-700 flex items-center"
           >
             <X className="w-3 h-3 mr-1" /> Remove
           </button>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* Image Preview / Editor Area */}
        <div 
          className={`relative w-40 h-40 rounded-full overflow-hidden border-4 touch-none flex items-center justify-center bg-gray-50 group transition-colors hover:border-indigo-300 ${currentImage ? 'border-indigo-100 cursor-move' : 'border-dashed border-gray-300 cursor-pointer'}`}
          onClick={triggerFileInput}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          style={{ touchAction: 'none' }}
        >
          {currentImage ? (
            <>
              <img 
                src={currentImage} 
                alt="Profile" 
                className="min-w-full min-h-full max-w-none pointer-events-none"
                style={imageStyle} 
              />
              
              {!isDragging && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/20 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 backdrop-blur-sm">
                     <Move className="w-3 h-3" /> Drag to move
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-2">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-1" />
              <span className="text-xs text-gray-500">Click to Upload</span>
            </div>
          )}
        </div>

        {/* Zoom Controls */}
        {currentImage && (
          <div className="w-full px-4 flex items-center gap-3 text-gray-500">
            <ZoomOut className="w-4 h-4" />
            <input 
              type="range" 
              min="1" 
              max="4" 
              step="0.1" 
              value={config.zoom} 
              onChange={(e) => onChange({ config: { ...config, zoom: parseFloat(e.target.value) } })}
              className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <ZoomIn className="w-4 h-4" />
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
      </div>

      {currentImage && (
        <div className="mt-4 bg-indigo-50 p-3 rounded-md border border-indigo-100">
          <label className="block text-xs font-medium text-indigo-900 mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            Magic Edit (Gemini Vision)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 'Add a studio background'"
              className="flex-1 text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            />
            <Button 
              size="sm" 
              onClick={handleMagicEdit} 
              disabled={!prompt.trim() || isProcessing}
              isLoading={isProcessing}
              title="Generate with Gemini"
              className="px-3"
            >
              <Wand2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-xs mt-2 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};