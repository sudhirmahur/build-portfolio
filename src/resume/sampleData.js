// Placeholder content used for the template thumbnails (and as the empty-resume shape).
export const emptyResume = () => ({
  fullName: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  github: '',
  photo: null,
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
});

export const sampleResume = {
  fullName: 'Your Name',
  title: 'Full Stack Developer',
  email: 'you@example.com',
  phone: '+91 98765 43210',
  location: 'City, Country',
  website: 'yourportfolio.com',
  linkedin: 'linkedin.com/in/yourname',
  github: 'github.com/yourname',
  photo: null,
  summary:
    'Results-driven developer with 2+ years of experience building scalable web applications with the MERN stack. Passionate about clean code, accessible interfaces and delivering features that users love.',
  experience: [
    {
      role: 'Full Stack Developer',
      company: 'Company Name',
      location: 'City',
      period: 'Apr 2025 – Present',
      bullets: [
        'Built and maintained REST APIs with Node.js and Express for production applications.',
        'Developed responsive React interfaces and reusable components used across products.',
        'Improved database performance and reduced page load time by 35%.',
      ],
    },
    {
      role: 'Frontend Developer',
      company: 'Another Company',
      location: 'City',
      period: 'Jan 2024 – Mar 2025',
      bullets: [
        'Implemented pixel-perfect UI from Figma designs with React and Tailwind CSS.',
        'Integrated payment, OTP and email services into customer-facing flows.',
      ],
    },
  ],
  education: [
    {
      degree: 'B.Tech — Computer Science & Engineering',
      school: 'University / College Name',
      period: '2021 – 2025',
      grade: 'CGPA 8.0 / 10',
    },
  ],
  skills: ['JavaScript', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'Python', 'REST APIs', 'Git', 'Tailwind CSS'],
  projects: [
    {
      name: 'E-commerce Platform',
      link: 'github.com/you/shop',
      tech: ['MERN', 'Redux', 'Razorpay'],
      description: 'Full-stack store with admin panel, cart, order tracking and online payments.',
    },
    {
      name: 'Task Manager',
      link: '',
      tech: ['React', 'Node.js'],
      description: 'Team task and workflow tool with role-based access and audit history.',
    },
  ],
  certifications: [{ name: 'Full Stack Development Training', issuer: 'Institute Name', year: '2025' }],
  languages: ['English', 'Hindi'],
};
