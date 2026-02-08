import React from 'react';
import { ResumeData, ResumeTheme, PhotoConfig } from '../types';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  theme: ResumeTheme;
}

const getFontClass = (font: string) => {
  switch (font) {
    case 'serif': return 'font-serif';
    case 'mono': return 'font-mono';
    default: return 'font-sans';
  }
};

const getPhotoStyle = (config?: PhotoConfig) => {
  if (!config) return { transform: 'scale(1)' };
  // Interpret x,y (0-100) as offsets centered at 50.
  // 50 -> 0% translate
  const tx = config.x - 50;
  const ty = config.y - 50;
  return {
    transform: `scale(${config.zoom}) translate(${tx}%, ${ty}%)`,
    transformOrigin: 'center center'
  };
};

/* --- SHARED SUB-COMPONENTS --- */

const ContactInfo: React.FC<{ data: ResumeData, className?: string, iconColor?: string }> = ({ data, className = "", iconColor }) => (
  <div className={`flex flex-wrap gap-x-4 gap-y-2 text-sm ${className}`}>
    {data.personalDetails.email && (
      <div className="flex items-center gap-1.5">
        <Mail className="w-3.5 h-3.5" style={{ color: iconColor }} />
        <span>{data.personalDetails.email}</span>
      </div>
    )}
    {data.personalDetails.phone && (
      <div className="flex items-center gap-1.5">
        <Phone className="w-3.5 h-3.5" style={{ color: iconColor }} />
        <span>{data.personalDetails.phone}</span>
      </div>
    )}
    {data.personalDetails.location && (
      <div className="flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5" style={{ color: iconColor }} />
        <span>{data.personalDetails.location}</span>
      </div>
    )}
    {data.personalDetails.website && (
      <div className="flex items-center gap-1.5">
        <Globe className="w-3.5 h-3.5" style={{ color: iconColor }} />
        <a href={`https://${data.personalDetails.website}`} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
           {data.personalDetails.website}
           <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    )}
  </div>
);

/* --- 1. MODERN TEMPLATE (Sidebar Layout) --- */

export const ModernTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  
  return (
    <div className={`h-full w-full bg-white text-gray-800 ${fontClass}`}>
      <header className="flex gap-8 border-b-2 pb-8 mb-8 items-start" style={{ borderColor: theme.primaryColor }}>
        {data.personalDetails.photoUrl && (
          <div className="w-32 h-32 flex-shrink-0 rounded-full overflow-hidden border-4 border-gray-100 shadow-md flex justify-center items-center bg-gray-50">
            <img 
              src={data.personalDetails.photoUrl} 
              alt="Profile" 
              className="min-w-full min-h-full max-w-none" 
              style={getPhotoStyle(data.personalDetails.photoConfig)}
            />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-4xl font-bold uppercase tracking-tight mb-2" style={{ color: theme.primaryColor }}>
            {data.personalDetails.fullName || 'Your Name'}
          </h1>
          <p className="text-xl text-gray-600 font-medium mb-4">
            {data.personalDetails.jobTitle || 'Job Title'}
          </p>
          <ContactInfo data={data} className="text-gray-600" iconColor={theme.primaryColor} />
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-8">
          {data.summary && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-3 border-b border-gray-200 pb-1" style={{ color: theme.primaryColor }}>
                Professional Profile
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 text-justify">{data.summary}</p>
            </section>
          )}
          {data.experience.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-200 pb-1" style={{ color: theme.primaryColor }}>
                Work Experience
              </h3>
              <div className="space-y-6">
                {data.experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-gray-800 text-base">{exp.role}</h4>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {exp.startDate} – {exp.endDate}
                      </span>
                    </div>
                    <div className="text-sm font-semibold mb-2" style={{ color: theme.primaryColor }}>{exp.company}</div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <div className="col-span-4 space-y-8">
          {data.education.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-200 pb-1" style={{ color: theme.primaryColor }}>
                Education
              </h3>
              <div className="space-y-4">
                {data.education.map(edu => (
                  <div key={edu.id}>
                    <h4 className="font-bold text-gray-800 text-sm">{edu.institution}</h4>
                    <div className="text-sm text-gray-600">{edu.degree}</div>
                    <div className="text-xs text-gray-500 mt-1">{edu.year}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.skills.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-200 pb-1" style={{ color: theme.primaryColor }}>
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.filter(s => s.trim()).map((skill, i) => (
                  <span key={i} className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

/* --- 2. CLASSIC TEMPLATE (Centered, Traditional) --- */

export const ClassicTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  
  return (
    <div className={`h-full w-full bg-white text-gray-900 ${fontClass}`}>
      <header className="text-center border-b-2 border-gray-800 pb-6 mb-8">
        {data.personalDetails.photoUrl && (
          <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border border-gray-200 flex justify-center items-center bg-gray-50">
            <img 
              src={data.personalDetails.photoUrl} 
              alt="Profile" 
              className="min-w-full min-h-full max-w-none" 
              style={getPhotoStyle(data.personalDetails.photoConfig)}
            />
          </div>
        )}
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2 tracking-wide">
          {data.personalDetails.fullName || 'Your Name'}
        </h1>
        <p className="text-lg italic text-gray-600 mb-3" style={{ color: theme.primaryColor }}>
          {data.personalDetails.jobTitle || 'Job Title'}
        </p>
        <div className="flex justify-center">
           <ContactInfo data={data} className="text-gray-600" />
        </div>
      </header>

      <div className="space-y-6">
        {data.summary && (
          <section className="text-center px-8">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-gray-300 inline-block pb-1" style={{ color: theme.primaryColor }}>
              Profile
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section>
            <div className="flex items-center mb-4">
               <h3 className="text-lg font-serif font-bold border-b-2 border-gray-200 w-full pb-1">Professional Experience</h3>
            </div>
            <div className="space-y-6">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-base">{exp.role}</h4>
                    <span className="text-sm italic text-gray-600">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-semibold mb-2" style={{ color: theme.primaryColor }}>{exp.company}</div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section>
            <div className="flex items-center mb-4">
               <h3 className="text-lg font-serif font-bold border-b-2 border-gray-200 w-full pb-1">Education</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {data.education.map(edu => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <h4 className="font-bold text-sm">{edu.institution}</h4>
                    <div className="text-sm text-gray-600 italic">{edu.degree}</div>
                  </div>
                  <div className="text-sm text-gray-500">{edu.year}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills.length > 0 && (
          <section>
             <div className="flex items-center mb-4">
               <h3 className="text-lg font-serif font-bold border-b-2 border-gray-200 w-full pb-1">Key Skills</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">
              {data.skills.join(" • ")}
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

/* --- 3. MINIMAL TEMPLATE (Clean, Single Column) --- */

export const MinimalTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  
  return (
    <div className={`h-full w-full bg-white text-gray-900 ${fontClass}`}>
      <div className="grid grid-cols-1 gap-10">
        <header className="flex gap-6 items-center">
          {data.personalDetails.photoUrl && (
            <div className="w-24 h-24 rounded bg-gray-100 flex-shrink-0 overflow-hidden flex justify-center items-center">
               <img 
                 src={data.personalDetails.photoUrl} 
                 alt="Profile" 
                 className="min-w-full min-h-full max-w-none grayscale" 
                 style={getPhotoStyle(data.personalDetails.photoConfig)}
               />
            </div>
          )}
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-2 text-gray-900" style={{ color: theme.primaryColor }}>
              {data.personalDetails.fullName || 'Your Name'}
            </h1>
            <p className="text-xl text-gray-400 font-light mb-4">
              {data.personalDetails.jobTitle || 'Job Title'}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {data.personalDetails.email && <span>{data.personalDetails.email}</span>}
              {data.personalDetails.phone && <span>{data.personalDetails.phone}</span>}
              {data.personalDetails.website && <span>{data.personalDetails.website}</span>}
            </div>
          </div>
        </header>

        {data.summary && (
          <section>
            <p className="text-base leading-relaxed text-gray-800 font-medium max-w-2xl">
              {data.summary}
            </p>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="md:col-span-2 space-y-8">
              {data.experience.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Experience</h3>
                  <div className="space-y-8 border-l border-gray-200 pl-6 ml-1">
                    {data.experience.map(exp => (
                      <div key={exp.id} className="relative">
                        <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-white border-2" style={{ borderColor: theme.primaryColor }}></div>
                        <h4 className="font-bold text-lg text-gray-900">{exp.role}</h4>
                        <div className="text-sm font-medium mb-2 text-gray-500">
                          {exp.company} | <span style={{ color: theme.primaryColor }}>{exp.startDate} – {exp.endDate}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
           </div>

           <div className="md:col-span-1 space-y-8">
              {data.education.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Education</h3>
                  <div className="space-y-4">
                    {data.education.map(edu => (
                      <div key={edu.id}>
                        <h4 className="font-bold text-gray-900 text-sm">{edu.institution}</h4>
                        <div className="text-sm text-gray-600">{edu.degree}</div>
                        <div className="text-xs text-gray-400 mt-1">{edu.year}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {data.skills.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Skills</h3>
                  <div className="flex flex-col gap-2">
                    {data.skills.filter(s => s.trim()).map((skill, i) => (
                      <span key={i} className="text-sm font-medium text-gray-700 pb-1 border-b border-gray-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

/* --- 4. PROFESSIONAL TEMPLATE (Structured, Corporate) --- */

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  
  return (
    <div className={`h-full w-full bg-white text-gray-900 ${fontClass}`}>
      <header className="border-b-4 pb-6 mb-6 flex justify-between items-start" style={{ borderColor: theme.primaryColor }}>
        <div className="flex gap-6">
          {data.personalDetails.photoUrl && (
            <div className="w-24 h-24 border border-gray-300 p-1 flex justify-center items-center overflow-hidden">
              <img 
                src={data.personalDetails.photoUrl} 
                alt="Profile" 
                className="min-w-full min-h-full max-w-none" 
                style={getPhotoStyle(data.personalDetails.photoConfig)}
              />
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold uppercase text-gray-900 mb-2 tracking-wide">
              {data.personalDetails.fullName || 'Your Name'}
            </h1>
            <p className="text-xl font-medium text-gray-600">
              {data.personalDetails.jobTitle || 'Job Title'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <ContactInfo data={data} className="flex-col items-end gap-1 text-gray-600" />
        </div>
      </header>

      {data.summary && (
        <section className="mb-6 bg-gray-50 p-4 border-l-4" style={{ borderColor: theme.primaryColor }}>
          <p className="text-sm leading-relaxed text-gray-800">{data.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-bold uppercase border-b-2 border-gray-200 mb-4 pb-1 flex items-center gap-2">
            <span style={{ color: theme.primaryColor }}>■</span> Experience
          </h3>
          <div className="space-y-5">
            {data.experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold text-gray-900 text-sm">
                  <span>{exp.role}</span>
                  <span>{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="text-sm font-medium mb-1" style={{ color: theme.primaryColor }}>{exp.company}</div>
                <p className="text-sm text-gray-700 leading-normal">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-6">
        {data.education.length > 0 && (
          <section>
            <h3 className="text-lg font-bold uppercase border-b-2 border-gray-200 mb-4 pb-1 flex items-center gap-2">
              <span style={{ color: theme.primaryColor }}>■</span> Education
            </h3>
            <div className="space-y-3">
              {data.education.map(edu => (
                <div key={edu.id}>
                  <div className="font-bold text-sm text-gray-900">{edu.institution}</div>
                  <div className="text-sm text-gray-700">{edu.degree}</div>
                  <div className="text-xs text-gray-500 italic">{edu.year}</div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {data.skills.length > 0 && (
          <section>
            <h3 className="text-lg font-bold uppercase border-b-2 border-gray-200 mb-4 pb-1 flex items-center gap-2">
              <span style={{ color: theme.primaryColor }}>■</span> Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
               {data.skills.filter(s => s.trim()).map((skill, i) => (
                  <span key={i} className="text-xs font-bold border px-2 py-1" style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}>
                    {skill}
                  </span>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

/* --- 5. CREATIVE TEMPLATE (Left Color Sidebar) --- */

export const CreativeTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  
  return (
    <div className={`h-full w-full bg-white text-gray-900 grid grid-cols-12 h-full min-h-[297mm] ${fontClass}`}>
      {/* Sidebar */}
      <div className="col-span-4 text-white p-6 flex flex-col gap-8 h-full min-h-full" style={{ backgroundColor: theme.primaryColor }}>
        <div className="text-center">
          {data.personalDetails.photoUrl && (
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white/30 mb-4 flex justify-center items-center bg-white/10">
              <img 
                src={data.personalDetails.photoUrl} 
                alt="Profile" 
                className="min-w-full min-h-full max-w-none" 
                style={getPhotoStyle(data.personalDetails.photoConfig)}
              />
            </div>
          )}
          <h1 className="text-2xl font-bold uppercase leading-tight mb-2">
            {data.personalDetails.fullName}
          </h1>
          <p className="text-white/80 text-sm font-medium">
            {data.personalDetails.jobTitle}
          </p>
        </div>

        <div className="space-y-1 text-xs text-white/90">
           {data.personalDetails.email && <div className="flex items-center gap-2"><Mail className="w-3 h-3"/> {data.personalDetails.email}</div>}
           {data.personalDetails.phone && <div className="flex items-center gap-2"><Phone className="w-3 h-3"/> {data.personalDetails.phone}</div>}
           {data.personalDetails.location && <div className="flex items-center gap-2"><MapPin className="w-3 h-3"/> {data.personalDetails.location}</div>}
           {data.personalDetails.website && <div className="flex items-center gap-2"><Globe className="w-3 h-3"/> {data.personalDetails.website}</div>}
        </div>

        {data.skills.length > 0 && (
          <section>
            <h3 className="font-bold text-white uppercase border-b border-white/40 pb-1 mb-3 text-sm">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.filter(s => s.trim()).map((skill, i) => (
                <span key={i} className="bg-white/20 px-2 py-1 rounded text-xs backdrop-blur-sm">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
           <section>
            <h3 className="font-bold text-white uppercase border-b border-white/40 pb-1 mb-3 text-sm">Education</h3>
             <div className="space-y-4">
              {data.education.map(edu => (
                <div key={edu.id}>
                  <div className="font-bold text-xs">{edu.institution}</div>
                  <div className="text-xs text-white/80">{edu.degree}</div>
                  <div className="text-[10px] text-white/60">{edu.year}</div>
                </div>
              ))}
            </div>
           </section>
        )}
      </div>

      {/* Main Content */}
      <div className="col-span-8 p-8">
        {data.summary && (
           <div className="mb-8">
             <h3 className="text-xl font-bold uppercase text-gray-800 mb-4" style={{ color: theme.primaryColor }}>Profile</h3>
             <p className="text-sm text-gray-600 leading-relaxed">{data.summary}</p>
           </div>
        )}

        {data.experience.length > 0 && (
           <div>
             <h3 className="text-xl font-bold uppercase text-gray-800 mb-6" style={{ color: theme.primaryColor }}>Experience</h3>
             <div className="space-y-8 border-l-2 border-gray-100 pl-6">
                {data.experience.map(exp => (
                  <div key={exp.id} className="relative">
                     <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
                     <h4 className="font-bold text-lg text-gray-800">{exp.role}</h4>
                     <div className="text-sm font-medium text-gray-500 mb-2">{exp.company} • {exp.startDate} - {exp.endDate}</div>
                     <p className="text-sm text-gray-600">{exp.description}</p>
                  </div>
                ))}
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

/* --- 6. EXECUTIVE TEMPLATE (Spacious, Serif, Authoritative) --- */

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass('serif'); // Force serif for executive
  
  return (
    <div className={`h-full w-full bg-white text-gray-900 ${fontClass} p-8`}>
      <header className="text-center mb-10">
        {data.personalDetails.photoUrl && (
          <div className="w-28 h-28 mx-auto mb-6 rounded shadow-lg border-2 border-white ring-1 ring-gray-200 flex justify-center items-center overflow-hidden">
             <img 
               src={data.personalDetails.photoUrl} 
               alt="Profile" 
               className="min-w-full min-h-full max-w-none" 
               style={getPhotoStyle(data.personalDetails.photoConfig)}
             />
          </div>
        )}
        <h1 className="text-4xl font-bold uppercase tracking-widest text-gray-900 mb-2">
          {data.personalDetails.fullName}
        </h1>
        <div className="h-0.5 w-24 mx-auto bg-gray-300 mb-3"></div>
        <p className="text-lg text-gray-600 uppercase tracking-wider mb-4">
          {data.personalDetails.jobTitle}
        </p>
        <ContactInfo data={data} className="justify-center text-gray-500 text-xs uppercase tracking-wide" />
      </header>

      {data.summary && (
        <section className="mb-10 text-center max-w-2xl mx-auto">
           <p className="text-sm text-gray-700 leading-7 italic">"{data.summary}"</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-8">
          <h3 className="text-center text-sm font-bold uppercase tracking-widest text-gray-400 mb-8 border-b pb-2">Professional History</h3>
          <div className="space-y-8">
            {data.experience.map(exp => (
              <div key={exp.id} className="grid grid-cols-12 gap-4">
                <div className="col-span-3 text-right">
                  <div className="text-sm font-bold text-gray-900">{exp.company}</div>
                  <div className="text-xs text-gray-500">{exp.startDate} – {exp.endDate}</div>
                </div>
                <div className="col-span-9 border-l border-gray-200 pl-6">
                   <h4 className="text-base font-bold text-gray-800 mb-2">{exp.role}</h4>
                   <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-10 border-t border-gray-100 pt-8">
         {data.education.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Education</h3>
              {data.education.map(edu => (
                <div key={edu.id} className="mb-3">
                  <div className="font-bold text-gray-900 text-sm">{edu.institution}</div>
                  <div className="text-sm italic text-gray-600">{edu.degree}, {edu.year}</div>
                </div>
              ))}
            </section>
         )}
         {data.skills.length > 0 && (
            <section>
               <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Core Competencies</h3>
               <div className="text-sm text-gray-600 leading-relaxed">
                 {data.skills.join(" • ")}
               </div>
            </section>
         )}
      </div>
    </div>
  );
};

/* --- 7. STUDENT TEMPLATE (Education First) --- */

export const StudentTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  
  return (
    <div className={`h-full w-full bg-white text-gray-900 ${fontClass}`}>
      <header className="bg-gray-50 p-6 border-b border-gray-200 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {data.personalDetails.fullName}
          </h1>
          <p className="text-lg text-gray-600 mb-3" style={{ color: theme.primaryColor }}>
            {data.personalDetails.jobTitle}
          </p>
          <ContactInfo data={data} className="text-gray-500" />
        </div>
        {data.personalDetails.photoUrl && (
           <div className="w-24 h-24 rounded-lg bg-gray-200 overflow-hidden shadow-sm flex justify-center items-center">
              <img 
                src={data.personalDetails.photoUrl} 
                alt="Profile" 
                className="min-w-full min-h-full max-w-none" 
                style={getPhotoStyle(data.personalDetails.photoConfig)}
              />
           </div>
        )}
      </header>

      <div className="px-6 space-y-6">
        {data.summary && (
          <section>
             <h3 className="font-bold text-sm uppercase text-gray-500 mb-2">Objective</h3>
             <p className="text-sm text-gray-800">{data.summary}</p>
          </section>
        )}

        {/* Education First for Students */}
        {data.education.length > 0 && (
          <section>
            <h3 className="font-bold text-lg border-b-2 mb-3 pb-1" style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}>
              Education
            </h3>
            <div className="space-y-4">
              {data.education.map(edu => (
                <div key={edu.id} className="flex justify-between items-start">
                   <div>
                     <h4 className="font-bold text-gray-900">{edu.institution}</h4>
                     <div className="text-sm text-gray-700">{edu.degree}</div>
                   </div>
                   <div className="text-sm font-medium bg-gray-100 px-2 rounded text-gray-600">{edu.year}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills.length > 0 && (
          <section>
            <h3 className="font-bold text-lg border-b-2 mb-3 pb-1" style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}>
              Skills
            </h3>
            <div className="grid grid-cols-2 gap-2">
               {data.skills.filter(s => s.trim()).map((skill, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
                    <span className="text-sm text-gray-700">{skill}</span>
                  </div>
               ))}
            </div>
          </section>
        )}

        {data.experience.length > 0 && (
          <section>
            <h3 className="font-bold text-lg border-b-2 mb-3 pb-1" style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}>
              Experience & Projects
            </h3>
             <div className="space-y-4">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-900">{exp.role}</h4>
                    <span className="text-xs text-gray-500">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{exp.company}</div>
                  <p className="text-sm text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

/* --- 8. TECH TEMPLATE (Monospace, Terminal Vibe) --- */

export const TechTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass('mono'); // Force mono
  
  return (
    <div className={`h-full w-full bg-white text-gray-900 ${fontClass} p-8`}>
      <header className="mb-8 border-b border-dashed border-gray-300 pb-6 flex items-start gap-6">
         {data.personalDetails.photoUrl && (
            <div className="w-32 h-32 flex-shrink-0 border-2 border-dashed p-1 flex justify-center items-center overflow-hidden" style={{ borderColor: theme.primaryColor }}>
               <img 
                 src={data.personalDetails.photoUrl} 
                 alt="User" 
                 className="min-w-full min-h-full max-w-none grayscale opacity-90 hover:grayscale-0 transition-all" 
                 style={getPhotoStyle(data.personalDetails.photoConfig)}
               />
            </div>
         )}
         <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">
               <span style={{ color: theme.primaryColor }}>&gt;</span> {data.personalDetails.fullName}<span className="animate-pulse">_</span>
            </h1>
            <p className="text-sm text-gray-500 mb-4">
               // {data.personalDetails.jobTitle}
            </p>
            <div className="text-xs text-gray-600 grid grid-cols-2 gap-2 max-w-md">
               {data.personalDetails.email && <div>const EMAIL = "{data.personalDetails.email}";</div>}
               {data.personalDetails.phone && <div>const PHONE = "{data.personalDetails.phone}";</div>}
               {data.personalDetails.website && <div className="col-span-2">const WEB = "{data.personalDetails.website}";</div>}
            </div>
         </div>
      </header>

      <div className="space-y-8">
         {data.skills.length > 0 && (
          <section>
             <h3 className="text-sm font-bold mb-2 text-gray-400">/* SKILLS ARRAY */</h3>
             <div className="text-sm bg-gray-50 p-4 rounded border border-gray-200">
                <span style={{ color: theme.primaryColor }}>const</span> stack = [
                {data.skills.map((s, i) => (
                  <span key={i} className="text-gray-700"> "{s}"{i < data.skills.length - 1 ? ',' : ''}</span>
                ))}
                ];
             </div>
          </section>
         )}

         {data.experience.length > 0 && (
           <section>
              <h3 className="text-sm font-bold mb-4 text-gray-400">/* EXPERIENCE LOG */</h3>
              <div className="space-y-6">
                 {data.experience.map((exp, i) => (
                    <div key={exp.id} className="relative pl-6 border-l border-gray-200">
                       <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border border-white" style={{ backgroundColor: theme.primaryColor }}></div>
                       <div className="flex flex-col mb-1">
                          <span className="font-bold text-sm">{exp.role} @ {exp.company}</span>
                          <span className="text-xs text-gray-400">{exp.startDate} -- {exp.endDate}</span>
                       </div>
                       <p className="text-xs text-gray-600 leading-relaxed opacity-90">{exp.description}</p>
                    </div>
                 ))}
              </div>
           </section>
         )}

          {data.education.length > 0 && (
           <section>
              <h3 className="text-sm font-bold mb-4 text-gray-400">/* ACADEMIC_DATA */</h3>
              {data.education.map(edu => (
                <div key={edu.id} className="text-sm mb-2">
                   <span style={{ color: theme.primaryColor }}>return</span> {`{ institution: "${edu.institution}", degree: "${edu.degree}" };`}
                </div>
              ))}
           </section>
         )}
      </div>
    </div>
  );
};

/* --- 9. COMPACT TEMPLATE (Dense, 3 Column) --- */

export const CompactTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  
  return (
    <div className={`h-full w-full bg-white text-gray-900 ${fontClass} p-6`}>
      <header className="flex justify-between items-center border-b-2 border-gray-900 pb-4 mb-4">
         <div className="flex items-center gap-4">
            {data.personalDetails.photoUrl && (
               <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden flex justify-center items-center">
                  <img 
                    src={data.personalDetails.photoUrl} 
                    alt="User" 
                    className="min-w-full min-h-full max-w-none" 
                    style={getPhotoStyle(data.personalDetails.photoConfig)}
                  />
               </div>
            )}
            <div>
               <h1 className="text-2xl font-bold uppercase">{data.personalDetails.fullName}</h1>
               <p className="text-sm font-bold text-gray-600" style={{ color: theme.primaryColor }}>{data.personalDetails.jobTitle}</p>
            </div>
         </div>
         <div className="text-right text-xs space-y-1">
            <div>{data.personalDetails.email}</div>
            <div>{data.personalDetails.phone}</div>
            <div>{data.personalDetails.location}</div>
         </div>
      </header>

      <div className="grid grid-cols-12 gap-4">
         <div className="col-span-8">
            {data.summary && (
               <div className="mb-4 text-xs text-gray-700 text-justify border-b border-gray-100 pb-2">
                  <span className="font-bold text-gray-900 mr-2">PROFILE:</span>
                  {data.summary}
               </div>
            )}
            
            {data.experience.length > 0 && (
               <section>
                  <h3 className="text-sm font-bold uppercase bg-gray-100 px-2 py-1 mb-2">Experience</h3>
                  <div className="space-y-3">
                     {data.experience.map(exp => (
                        <div key={exp.id}>
                           <div className="flex justify-between text-xs font-bold">
                              <span>{exp.role}</span>
                              <span className="text-gray-500">{exp.startDate}-{exp.endDate}</span>
                           </div>
                           <div className="text-xs italic mb-1" style={{ color: theme.primaryColor }}>{exp.company}</div>
                           <p className="text-[10px] text-gray-700 leading-tight">{exp.description}</p>
                        </div>
                     ))}
                  </div>
               </section>
            )}
         </div>

         <div className="col-span-4 bg-gray-50 p-2 h-full">
            {data.skills.length > 0 && (
               <section className="mb-4">
                  <h3 className="text-xs font-bold uppercase border-b border-gray-300 mb-2 pb-1">Skills</h3>
                  <div className="text-[10px] space-y-1">
                     {data.skills.map((s, i) => (
                        <div key={i}>• {s}</div>
                     ))}
                  </div>
               </section>
            )}

            {data.education.length > 0 && (
               <section>
                  <h3 className="text-xs font-bold uppercase border-b border-gray-300 mb-2 pb-1">Education</h3>
                  <div className="space-y-2">
                     {data.education.map(edu => (
                        <div key={edu.id}>
                           <div className="text-[10px] font-bold">{edu.institution}</div>
                           <div className="text-[10px] text-gray-600">{edu.degree}</div>
                           <div className="text-[9px] text-gray-400">{edu.year}</div>
                        </div>
                     ))}
                  </div>
               </section>
            )}
         </div>
      </div>
    </div>
  );
};

/* --- 10. BOLD TEMPLATE (High Contrast) --- */

export const BoldTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const fontClass = getFontClass(theme.fontFamily);
  
  return (
    <div className={`h-full w-full bg-white text-gray-900 ${fontClass}`}>
       <header className="bg-gray-900 text-white p-10 flex justify-between items-start">
          <div>
             <h1 className="text-5xl font-black uppercase leading-none mb-4" style={{ color: theme.primaryColor }}>
                {data.personalDetails.fullName}
             </h1>
             <p className="text-2xl font-light tracking-widest uppercase mb-8">
                {data.personalDetails.jobTitle}
             </p>
             <div className="flex gap-6 text-sm font-bold text-gray-400">
                {data.personalDetails.email && <span>{data.personalDetails.email}</span>}
                {data.personalDetails.phone && <span>{data.personalDetails.phone}</span>}
             </div>
          </div>
          {data.personalDetails.photoUrl && (
             <div className="w-40 h-40 bg-gray-800 p-2 transform rotate-3 flex justify-center items-center overflow-hidden">
                <img 
                  src={data.personalDetails.photoUrl} 
                  alt="User" 
                  className="min-w-full min-h-full max-w-none grayscale" 
                  style={getPhotoStyle(data.personalDetails.photoConfig)}
                />
             </div>
          )}
       </header>

       <div className="p-10 grid grid-cols-3 gap-10">
          <div className="col-span-1 space-y-10">
             {data.skills.length > 0 && (
                <section>
                   <h3 className="text-2xl font-black uppercase mb-4 border-b-4 border-gray-900 pb-2">Skills</h3>
                   <div className="flex flex-col gap-2 text-sm font-bold text-gray-600">
                      {data.skills.map((s, i) => <span key={i}>{s}</span>)}
                   </div>
                </section>
             )}

             {data.education.length > 0 && (
                <section>
                   <h3 className="text-2xl font-black uppercase mb-4 border-b-4 border-gray-900 pb-2">Edu</h3>
                   <div className="space-y-4">
                      {data.education.map(edu => (
                         <div key={edu.id}>
                            <div className="font-bold text-gray-900">{edu.institution}</div>
                            <div className="text-sm">{edu.degree}</div>
                         </div>
                      ))}
                   </div>
                </section>
             )}
          </div>

          <div className="col-span-2 space-y-10">
             {data.summary && (
                <section>
                   <p className="text-lg font-medium leading-relaxed">{data.summary}</p>
                </section>
             )}

             {data.experience.length > 0 && (
                <section>
                   <h3 className="text-2xl font-black uppercase mb-6 border-b-4 border-gray-900 pb-2">Experience</h3>
                   <div className="space-y-8">
                      {data.experience.map(exp => (
                         <div key={exp.id}>
                            <div className="flex justify-between items-end mb-2">
                               <h4 className="text-xl font-bold text-gray-900">{exp.role}</h4>
                               <span className="font-bold text-sm" style={{ color: theme.primaryColor }}>{exp.startDate} — {exp.endDate}</span>
                            </div>
                            <div className="text-sm font-bold uppercase text-gray-500 mb-2">{exp.company}</div>
                            <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                         </div>
                      ))}
                   </div>
                </section>
             )}
          </div>
       </div>
    </div>
  );
};

export const ResumeTemplateRenderer: React.FC<TemplateProps> = (props) => {
  switch (props.theme.templateId) {
    case 'classic': return <ClassicTemplate {...props} />;
    case 'minimal': return <MinimalTemplate {...props} />;
    case 'professional': return <ProfessionalTemplate {...props} />;
    case 'creative': return <CreativeTemplate {...props} />;
    case 'executive': return <ExecutiveTemplate {...props} />;
    case 'student': return <StudentTemplate {...props} />;
    case 'tech': return <TechTemplate {...props} />;
    case 'compact': return <CompactTemplate {...props} />;
    case 'bold': return <BoldTemplate {...props} />;
    case 'modern':
    default:
      return <ModernTemplate {...props} />;
  }
};