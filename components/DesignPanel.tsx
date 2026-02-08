import React, { useState } from 'react';
import { ResumeTheme, TemplateId, FontFamily } from '../types';
import { Layout, Type, Palette, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { generateDesignTheme } from '../services/geminiService';

interface DesignPanelProps {
  theme: ResumeTheme;
  onChange: (theme: ResumeTheme) => void;
}

const TEMPLATES: { id: TemplateId; name: string; description: string }[] = [
  { id: 'modern', name: 'Modern', description: 'Clean sidebar layout, perfect for tech and business.' },
  { id: 'classic', name: 'Classic', description: 'Traditional centered layout, elegant serif fonts.' },
  { id: 'minimal', name: 'Minimal', description: 'Bold typography, plenty of whitespace, artistic.' },
  { id: 'professional', name: 'Professional', description: 'Structured, corporate look with clear dividers.' },
  { id: 'creative', name: 'Creative', description: 'Unique layout with colorful sidebar column.' },
  { id: 'executive', name: 'Executive', description: 'Spacious, authoritative, high-end design.' },
  { id: 'student', name: 'Student', description: 'Emphasizes education and skills over experience.' },
  { id: 'tech', name: 'Tech', description: 'Monospace accents, clean code-like aesthetic.' },
  { id: 'compact', name: 'Compact', description: 'Dense layout to fit maximum information.' },
  { id: 'bold', name: 'Bold', description: 'High contrast headers for making a statement.' },
];

const FONTS: { id: FontFamily; name: string }[] = [
  { id: 'sans', name: 'Inter (Sans-Serif)' },
  { id: 'serif', name: 'Merriweather (Serif)' },
  { id: 'mono', name: 'Roboto Mono (Monospace)' },
];

const COLORS = [
  '#4F46E5', // Indigo
  '#0891b2', // Cyan
  '#059669', // Emerald
  '#dc2626', // Red
  '#7c3aed', // Violet
  '#ea580c', // Orange
  '#1f2937', // Gray/Black
  '#0f172a', // Slate
];

export const DesignPanel: React.FC<DesignPanelProps> = ({ theme, onChange }) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastAiTemplate, setLastAiTemplate] = useState<TemplateId | null>(null);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const suggestedTheme = await generateDesignTheme(aiPrompt);
      if (suggestedTheme && suggestedTheme.templateId) {
        setLastAiTemplate(suggestedTheme.templateId as TemplateId);
        onChange({
          ...theme,
          ...suggestedTheme
        });
      }
    } catch (e) {
      alert("Could not generate design. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 p-6 pb-20">
      
      {/* AI Generator */}
      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg p-5 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-24 h-24 text-indigo-600" />
        </div>
        
        <div className="relative z-10">
          <h3 className="text-base font-bold text-indigo-900 flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            AI Design Assistant
          </h3>
          <p className="text-xs text-indigo-700 mb-3 leading-relaxed">
            Tell us about your role or style (e.g., <em>"Senior Developer who loves minimalism"</em> or <em>"Creative Graphic Designer"</em>). 
            Gemini will instantly pick the perfect template, font, and color for you.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
              placeholder="e.g. Finance Manager, Art Student..."
              className="flex-1 text-sm rounded-md border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 p-2 shadow-sm"
            />
            <Button 
              size="sm" 
              onClick={handleAiGenerate}
              isLoading={isGenerating}
              disabled={!aiPrompt.trim()}
              className="whitespace-nowrap bg-indigo-600 hover:bg-indigo-700"
            >
              Magic Design
            </Button>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="space-y-4">
        <div className="flex justify-between items-end border-b pb-2">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Layout className="w-5 h-5"/> Templates
          </h2>
          <span className="text-xs text-gray-500">{TEMPLATES.length} layouts available</span>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {TEMPLATES.map((t) => {
            const isSelected = theme.templateId === t.id;
            const isAiSuggested = lastAiTemplate === t.id && isSelected;
            
            return (
              <button
                key={t.id}
                onClick={() => onChange({ ...theme, templateId: t.id })}
                className={`text-left p-3 rounded-lg border transition-all relative ${
                  isSelected 
                    ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                    {t.name}
                    {isAiSuggested && (
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <Sparkles className="w-2 h-2" /> AI Pick
                      </span>
                    )}
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{t.description}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Fonts */}
      <section className="space-y-4">
         <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
          <Type className="w-5 h-5"/> Typography
        </h2>
        <div className="grid grid-cols-1 gap-2">
           {FONTS.map(f => (
             <label key={f.id} className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-colors ${
               theme.fontFamily === f.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'
             }`}>
               <div className="flex items-center gap-3">
                 <input 
                   type="radio" 
                   name="font" 
                   checked={theme.fontFamily === f.id}
                   onChange={() => onChange({ ...theme, fontFamily: f.id })}
                   className="text-indigo-600 focus:ring-indigo-500"
                 />
                 <span className={`text-sm ${f.id === 'serif' ? 'font-serif' : f.id === 'mono' ? 'font-mono' : 'font-sans'}`}>
                   {f.name}
                 </span>
               </div>
               <span className="text-xs text-gray-400">Aa</span>
             </label>
           ))}
        </div>
      </section>

      {/* Colors */}
      <section className="space-y-4">
         <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
          <Palette className="w-5 h-5"/> Accent Color
        </h2>
        <div className="flex flex-wrap gap-3">
          {COLORS.map(color => (
            <button
              key={color}
              onClick={() => onChange({ ...theme, primaryColor: color })}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                theme.primaryColor === color ? 'border-gray-900 ring-2 ring-gray-300' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          ))}
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white overflow-hidden hover:border-gray-400 transition-colors">
            <input 
              type="color" 
              value={theme.primaryColor}
              onChange={(e) => onChange({ ...theme, primaryColor: e.target.value })}
              className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
              title="Custom Color"
            />
            <div className="pointer-events-none text-gray-400 text-xs">+</div>
          </div>
        </div>
      </section>

    </div>
  );
};