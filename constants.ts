import { ResumeData } from './types';

export const INITIAL_RESUME_STATE: ResumeData = {
  personalDetails: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    jobTitle: '',
    website: '',
    photoUrl: null,
    photoConfig: { x: 50, y: 50, zoom: 1 },
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
};

export const MOCK_RESUME_STATE: ResumeData = {
  personalDetails: {
    fullName: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    jobTitle: 'Senior Product Designer',
    website: 'www.alexmorgan.design',
    photoUrl: null,
    photoConfig: { x: 50, y: 50, zoom: 1 },
  },
  summary: 'Creative and detail-oriented Product Designer with over 6 years of experience in building user-centric digital products. Proficient in UI/UX design, prototyping, and design systems. Passionate about solving complex problems through elegant design solutions.',
  experience: [
    {
      id: '1',
      company: 'TechFlow Solutions',
      role: 'Senior UI/UX Designer',
      startDate: '2021-03',
      endDate: 'Present',
      description: 'Lead design for the flagship SaaS product, resulting in a 20% increase in user retention. Managed a team of 3 junior designers and established a comprehensive design system.',
    },
    {
      id: '2',
      company: 'Creative Pulse',
      role: 'Product Designer',
      startDate: '2018-06',
      endDate: '2021-02',
      description: 'Collaborated with cross-functional teams to launch mobile applications for fintech clients. Conducted user research and usability testing to inform design decisions.',
    }
  ],
  education: [
    {
      id: '1',
      institution: 'Rhode Island School of Design',
      degree: 'BFA in Graphic Design',
      year: '2018',
    }
  ],
  skills: ['Figma', 'React', 'Tailwind CSS', 'User Research', 'Prototyping', 'Adobe Creative Suite'],
};