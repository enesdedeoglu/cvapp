import React, { useState } from 'react';
import { ResumeData, Experience, Education, PhotoConfig } from '../types';
import { Plus, Trash2, Sparkles, MapPin, Mail, Phone, Globe, Briefcase, GraduationCap } from 'lucide-react';
import { Button } from './Button';
import { ImageEditor } from './ImageEditor';
import { enhanceText, generateSummary } from '../services/geminiService';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ data, onChange }) => {
  const [loadingField, setLoadingField] = useState<string | null>(null);

  const updatePersonal = (field: keyof typeof data.personalDetails, value: any) => {
    onChange({
      ...data,
      personalDetails: { ...data.personalDetails, [field]: value },
    });
  };

  const handleImageEditorChange = (updates: { image?: string | null, config?: PhotoConfig }) => {
    const newDetails = { ...data.personalDetails };
    if (updates.image !== undefined) {
      newDetails.photoUrl = updates.image;
    }
    if (updates.config !== undefined) {
      newDetails.photoConfig = updates.config;
    }
    onChange({
      ...data,
      personalDetails: newDetails,
    });
  };

  const handleEnhanceText = async (text: string, path: string, context: string, updater: (val: string) => void) => {
    if (!text.trim()) return;
    setLoadingField(path);
    try {
      const enhanced = await enhanceText(text, context);
      updater(enhanced);
    } catch (e) {
      alert("Failed to enhance text. Please check your API key.");
    } finally {
      setLoadingField(null);
    }
  };

  const handleGenerateSummary = async () => {
    setLoadingField('summary');
    try {
      const expText = data.experience.map(e => `${e.role} at ${e.company}: ${e.description}`).join('; ');
      const summary = await generateSummary(data.personalDetails.jobTitle, data.skills, expText);
      onChange({ ...data, summary });
    } catch (e) {
      alert("Failed to generate summary.");
    } finally {
      setLoadingField(null);
    }
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    onChange({ ...data, experience: [newExp, ...data.experience] });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    onChange({
      ...data,
      experience: data.experience.map(e => e.id === id ? { ...e, [field]: value } : e),
    });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter(e => e.id !== id) });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      year: '',
    };
    onChange({ ...data, education: [newEdu, ...data.education] });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange({
      ...data,
      education: data.education.map(e => e.id === id ? { ...e, [field]: value } : e),
    });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter(e => e.id !== id) });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const skills = e.target.value.split(',').map(s => s.trim());
    onChange({ ...data, skills });
  };

  return (
    <div className="space-y-8 p-6 pb-20">
      
      {/* Personal Details Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Personal Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-2">
               <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
               <input 
                 type="text" 
                 value={data.personalDetails.fullName}
                 onChange={e => updatePersonal('fullName', e.target.value)}
                 className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                 placeholder="Jane Doe"
               />
            </div>
            <div className="col-span-2">
               <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
               <input 
                 type="text" 
                 value={data.personalDetails.jobTitle}
                 onChange={e => updatePersonal('jobTitle', e.target.value)}
                 className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                 placeholder="Software Engineer"
               />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Mail className="w-3 h-3"/> Email</label>
              <input 
                 type="email" 
                 value={data.personalDetails.email}
                 onChange={e => updatePersonal('email', e.target.value)}
                 className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Phone className="w-3 h-3"/> Phone</label>
              <input 
                 type="tel" 
                 value={data.personalDetails.phone}
                 onChange={e => updatePersonal('phone', e.target.value)}
                 className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Location</label>
              <input 
                 type="text" 
                 value={data.personalDetails.location}
                 onChange={e => updatePersonal('location', e.target.value)}
                 className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Globe className="w-3 h-3"/> Website/Portfolio</label>
              <input 
                 type="text" 
                 value={data.personalDetails.website}
                 onChange={e => updatePersonal('website', e.target.value)}
                 className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              />
            </div>
          </div>
          
          <div className="md:col-span-1">
            <ImageEditor 
              currentImage={data.personalDetails.photoUrl}
              config={data.personalDetails.photoConfig}
              onChange={handleImageEditorChange}
            />
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
           <h2 className="text-xl font-bold text-gray-800">Professional Summary</h2>
           <Button 
             variant="secondary" 
             size="sm" 
             onClick={handleGenerateSummary}
             isLoading={loadingField === 'summary'}
             icon={<Sparkles className="w-4 h-4"/>}
             className="text-xs"
           >
             Generate with AI
           </Button>
        </div>
        <div>
          <textarea
            rows={4}
            value={data.summary}
            onChange={e => onChange({...data, summary: e.target.value})}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            placeholder="Write a brief overview of your career..."
          />
          <div className="mt-2 flex justify-end">
             <Button 
               variant="ghost" 
               size="sm"
               className="text-indigo-600 hover:text-indigo-800 text-xs"
               onClick={() => handleEnhanceText(data.summary, 'summary-enhance', 'career summary', (val) => onChange({...data, summary: val}))}
               isLoading={loadingField === 'summary-enhance'}
               icon={<Sparkles className="w-3 h-3"/>}
             >
               Improve existing text
             </Button>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
           <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
             <Briefcase className="w-5 h-5"/> Experience
           </h2>
           <Button onClick={addExperience} variant="outline" size="sm" icon={<Plus className="w-4 h-4"/>}>Add Role</Button>
        </div>
        
        <div className="space-y-6">
          {data.experience.map((exp, index) => (
            <div key={exp.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group">
              <button 
                onClick={() => removeExperience(exp.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input 
                  placeholder="Company Name"
                  value={exp.company}
                  onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
                <input 
                  placeholder="Job Role"
                  value={exp.role}
                  onChange={e => updateExperience(exp.id, 'role', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm p-2 border font-medium"
                />
                <input 
                  type="text"
                  placeholder="Start Date (e.g., 2020-01)"
                  value={exp.startDate}
                  onChange={e => updateExperience(exp.id, 'startDate', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm p-2 border text-sm"
                />
                <input 
                  type="text"
                  placeholder="End Date (e.g., Present)"
                  value={exp.endDate}
                  onChange={e => updateExperience(exp.id, 'endDate', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm p-2 border text-sm"
                />
              </div>
              
              <div className="relative">
                <textarea
                  placeholder="Describe your responsibilities and achievements..."
                  rows={3}
                  value={exp.description}
                  onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm p-2 border text-sm"
                />
                <button
                  className="absolute bottom-2 right-2 text-xs text-indigo-600 bg-white/80 backdrop-blur-sm px-2 py-1 rounded border border-indigo-200 hover:bg-indigo-50 flex items-center gap-1"
                  onClick={() => handleEnhanceText(exp.description, `exp-${exp.id}`, 'job description', (val) => updateExperience(exp.id, 'description', val))}
                  disabled={loadingField === `exp-${exp.id}`}
                >
                  {loadingField === `exp-${exp.id}` ? <Sparkles className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>}
                  Enhance
                </button>
              </div>
            </div>
          ))}
          
          {data.experience.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed rounded-lg">
              No experience added yet.
            </div>
          )}
        </div>
      </section>

      {/* Education Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
           <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
             <GraduationCap className="w-5 h-5"/> Education
           </h2>
           <Button onClick={addEducation} variant="outline" size="sm" icon={<Plus className="w-4 h-4"/>}>Add Education</Button>
        </div>
        
        <div className="space-y-4">
          {data.education.map((edu) => (
            <div key={edu.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group">
               <button 
                onClick={() => removeEducation(edu.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={e => updateEducation(edu.id, 'institution', e.target.value)}
                  className="md:col-span-2 w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
                 <input 
                  placeholder="Year"
                  value={edu.year}
                  onChange={e => updateEducation(edu.id, 'year', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
                 <input 
                  placeholder="Degree / Qualification"
                  value={edu.degree}
                  onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                  className="md:col-span-3 w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Skills</h2>
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">List your skills (comma separated)</label>
           <textarea
             rows={3}
             value={data.skills.join(', ')}
             onChange={handleSkillsChange}
             className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
             placeholder="React, Project Management, Public Speaking..."
           />
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {data.skills.filter(s => s.trim()).map((skill, idx) => (
            <span key={idx} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full border border-indigo-200">
              {skill}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};