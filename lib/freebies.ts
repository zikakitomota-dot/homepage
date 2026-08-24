export const freebieCategories = {
  'school-study': {
    label: 'School & Study',
    description: 'Simple planners and trackers for students, teachers and families.',
  },
  'kids-early-learning': {
    label: 'Kids & Early Learning',
    description: 'Friendly printable activities for growing early skills.',
  },
  'money-budgeting': {
    label: 'Money & Budgeting',
    description: 'Practical printables for saving, budgeting and money goals.',
  },
} as const;

export type FreebieCategory = keyof typeof freebieCategories;

export type FreebieRelatedLink = {
  label: string;
  href: string;
  description?: string;
};

export type Freebie = {
  slug: string;
  title: string;
  shortTitle: string;
  longTitle?: string;
  description: string;
  category: FreebieCategory;
  audience: string;
  ageRange?: string;
  pageCount: number;
  format: string;
  featured: boolean;
  published: boolean;
  previewImage?: string;
  a4Download: string;
  usLetterDownload: string;
  bundleDownload: string;
  bundleFormat: 'ZIP';
  includedPages: readonly string[];
  relatedFreebies: readonly string[];
  relatedLinks: readonly FreebieRelatedLink[];
  seoTitle: string;
  seoDescription: string;
  notice?: string;
};

const downloadRoot = '/downloads/freebies';

export const freebies: readonly Freebie[] = [
  {
    slug: 'grade-tracker',
    title: 'Grade Tracker',
    shortTitle: 'Grade Tracker',
    description: 'Keep assignments, scores and final-grade goals organised in one simple set.',
    category: 'school-study',
    audience: 'Students',
    pageCount: 4,
    format: 'A4 + US Letter • PDF',
    featured: true,
    published: true,
    a4Download: `${downloadRoot}/grade-tracker/Zalea_Studio_Grade_Tracker_A4_Final.pdf`,
    usLetterDownload: `${downloadRoot}/grade-tracker/Zalea_Studio_Grade_Tracker_US_Letter_Final.pdf`,
    bundleDownload: `${downloadRoot}/grade-tracker/Zalea_Studio_Grade_Tracker.zip`,
    bundleFormat: 'ZIP',
    includedPages: ['Cover', 'Grade Tracker', 'Assignment Tracker', 'Final Grade Planner'],
    relatedFreebies: ['study-planner'],
    relatedLinks: [
      { label: 'Grade Calculator', href: '/education/grade-calculator', description: 'Calculate an overall grade from assignment scores.' },
      { label: 'Final Grade Calculator', href: '/education/final-grade-calculator', description: 'Find the score needed on a final exam.' },
      { label: 'Weighted Grade Calculator', href: '/education/weighted-grade-calculator', description: 'Calculate a grade with weighted categories.' },
      { label: 'GPA Calculator', href: '/education/gpa-calculator', description: 'Estimate GPA from course grades and credits.' },
    ],
    seoTitle: 'Free Grade Tracker Printable | Zalea Studio',
    seoDescription: 'Download a free grade tracker printable with pages for assignments, scores and final-grade planning in A4 and US Letter sizes.',
  },
  {
    slug: 'study-planner',
    title: 'Study Planner',
    shortTitle: 'Study Planner',
    description: 'Plan your week, focus each study session and prepare for exams.',
    category: 'school-study',
    audience: 'Students',
    pageCount: 4,
    format: 'A4 + US Letter • PDF',
    featured: true,
    published: true,
    a4Download: `${downloadRoot}/study-planner/Zalea_Studio_Study_Planner_A4_Final.pdf`,
    usLetterDownload: `${downloadRoot}/study-planner/Zalea_Studio_Study_Planner_US_Letter_Final.pdf`,
    bundleDownload: `${downloadRoot}/study-planner/Zalea_Studio_Study_Planner.zip`,
    bundleFormat: 'ZIP',
    includedPages: ['Cover', 'Weekly Study Planner', 'Study Session Planner', 'Exam Revision Planner'],
    relatedFreebies: ['grade-tracker'],
    relatedLinks: [
      { label: 'Grade Calculator', href: '/education/grade-calculator', description: 'Keep track of your current overall grade.' },
      { label: 'Final Grade Calculator', href: '/education/final-grade-calculator', description: 'Plan the score you need on your final.' },
    ],
    seoTitle: 'Free Study Planner Printable | Zalea Studio',
    seoDescription: 'Download a free study planner with weekly, study-session and exam-revision pages in both A4 and US Letter sizes.',
  },
  {
    slug: 'student-progress-tracker',
    title: 'Student Progress Tracker',
    shortTitle: 'Student Progress Tracker',
    description: 'Track progress, celebrate strengths and see where extra support may be needed.',
    category: 'school-study',
    audience: 'Teachers, Tutors & Parents',
    pageCount: 4,
    format: 'A4 + US Letter • PDF',
    featured: false,
    published: true,
    a4Download: `${downloadRoot}/student-progress-tracker/Zalea_Studio_Student_Progress_Tracker_A4_Final.pdf`,
    usLetterDownload: `${downloadRoot}/student-progress-tracker/Zalea_Studio_Student_Progress_Tracker_US_Letter_Final.pdf`,
    bundleDownload: `${downloadRoot}/student-progress-tracker/Zalea_Studio_Student_Progress_Tracker.zip`,
    bundleFormat: 'ZIP',
    includedPages: ['Cover', 'Student Progress Overview', 'Assessment & Score Tracker', 'Learning Observation Notes'],
    relatedFreebies: ['early-learning-skills-observation-tracker'],
    relatedLinks: [],
    seoTitle: 'Student Progress Tracker for Teachers & Parents | Zalea Studio',
    seoDescription: 'Download a free student progress tracker for teachers, tutors and parents, with assessment and learning-observation pages.',
    notice: 'This is an informal educational record-keeping resource. It is not a medical, developmental or diagnostic tool.',
  },
  {
    slug: 'early-learning-skills-observation-tracker',
    title: 'Early Learning Skills & Observation Tracker',
    shortTitle: 'Early Learning Tracker',
    description: 'Keep track of growing skills, interests and next steps as learning happens.',
    category: 'school-study',
    audience: 'Teachers & Parents',
    ageRange: 'Ages 3–6',
    pageCount: 4,
    format: 'A4 + US Letter • PDF',
    featured: false,
    published: true,
    a4Download: `${downloadRoot}/early-learning-skills-observation-tracker/Zalea_Studio_Early_Learning_Skills_Observation_Tracker_A4.pdf`,
    usLetterDownload: `${downloadRoot}/early-learning-skills-observation-tracker/Zalea_Studio_Early_Learning_Skills_Observation_Tracker_US_Letter.pdf`,
    bundleDownload: `${downloadRoot}/early-learning-skills-observation-tracker/Zalea_Studio_Early_Learning_Skills_Observation_Tracker.zip`,
    bundleFormat: 'ZIP',
    includedPages: ['Cover', 'Early Learning Skills Overview', 'Learning Observation Notes', 'Interests, Strengths & Next Steps'],
    relatedFreebies: ['student-progress-tracker'],
    relatedLinks: [],
    seoTitle: 'Early Learning Skills & Observation Tracker | Zalea Studio',
    seoDescription: 'Download a free early learning skills and observation tracker for ages 3–6, with A4 and US Letter printable pages.',
    notice: 'This is an informal educational observation resource. It is not a developmental screening or diagnostic tool.',
  },
  {
    slug: 'pre-writing-pencil-control',
    title: 'Pre-Writing & Pencil Control',
    shortTitle: 'Pre-Writing & Pencil Control',
    longTitle: 'Pre-Writing & Pencil Control Starter Pack',
    description: 'Simple tracing activities to practise pencil control and early pre-writing skills.',
    category: 'kids-early-learning',
    audience: 'Parents, Preschool Teachers & Early Learners',
    ageRange: 'Ages 3–5',
    pageCount: 6,
    format: 'A4 + US Letter • PDF',
    featured: true,
    published: true,
    a4Download: `${downloadRoot}/pre-writing-pencil-control/Zalea_Studio_Pre_Writing_Pencil_Control_A4_Final.pdf`,
    usLetterDownload: `${downloadRoot}/pre-writing-pencil-control/Zalea_Studio_Pre_Writing_Pencil_Control_US_Letter_Final.pdf`,
    bundleDownload: `${downloadRoot}/pre-writing-pencil-control/Zalea_Studio_Pre_Writing_Pencil_Control.zip`,
    bundleFormat: 'ZIP',
    includedPages: ['Cover', 'Straight Lines', 'Curves & Waves', 'Zigzags & Patterns', 'Shape Tracing', 'Follow the Path'],
    relatedFreebies: [],
    relatedLinks: [],
    seoTitle: 'Pre-Writing & Pencil Control Activities Ages 3–5 | Zalea Studio',
    seoDescription: 'Download free pre-writing and pencil-control tracing activities for ages 3–5 in A4 and US Letter printable formats.',
  },
] as const;

export const publishedFreebies = freebies.filter((freebie) => freebie.published);

export const publishedCategoryKeys = (Object.keys(freebieCategories) as FreebieCategory[]).filter(
  (category) => publishedFreebies.some((freebie) => freebie.category === category),
);

export function getFreebie(slug: string) {
  return publishedFreebies.find((freebie) => freebie.slug === slug);
}
