// School types
export const SCHOOLS = {
  jhs: { name: 'Juanita High School', abbr: 'JHS' },
  lwhs: { name: 'Lake Washington High School', abbr: 'LWHS' },
} as const;

export type SchoolId = keyof typeof SCHOOLS;

export const PERIODS = ['0', '1', '2', '3', '4', '5', '6', '7'] as const;
export type Period = (typeof PERIODS)[number];

export const PERIOD_LABELS: Record<string, string> = {
  '0': 'Period 0 (7:30–8:20)',
  '1': 'Period 1',
  '2': 'Period 2',
  '3': 'Period 3',
  '4': 'Period 4',
  '5': 'Period 5',
  '6': 'Period 6',
  '7': 'Period 7 (After School)',
};

export const DAILY_SCHEDULE: Record<string, { periods: string[]; note?: string }> = {
  Monday: { periods: ['1', '2', '4', '5', '6'] },
  Tuesday: { periods: ['1', '2', '3', '4', '6'] },
  Wednesday: { periods: ['1', '3', '5'], note: 'Short day + LEAP' },
  Thursday: { periods: ['2', '3', '4', '5', '6'] },
  Friday: { periods: ['1', '2', '3', '4', '5', '6'], note: '+ Homeroom' },
};

export const SCHOOL_START = '8:20';
export const SCHOOL_END = '3:15';
export const PERIOD_0_START = '7:30';
export const PERIOD_0_END = '8:20';

export const LUNCH_OPTIONS = ['1st', '2nd'] as const;
export type LunchOption = (typeof LUNCH_OPTIONS)[number];

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
export type Weekday = (typeof WEEKDAYS)[number];

// Days that have lunch periods (Wednesday only has after-school lunch)
export const LUNCH_DAYS = ['Monday', 'Tuesday', 'Thursday', 'Friday'] as const;
export type LunchDay = (typeof LUNCH_DAYS)[number];

// All JHS teachers by department
const MATH_TEACHERS = ['Eric Carlson', 'Peter Cheng', 'Katherine Ellis', 'David Friedman', 'Karrie Gengo', 'Ben Hullinger', 'Ashley Jacobsen', 'Christell Krsak', 'Kylisa Lewis', 'Jill Machado', 'Tim Magdziarz', 'Brian Stewart', 'Sydney Thomas'];
const ENGLISH_TEACHERS = ['Todd Benedict', 'Kiersten Bowers', 'Sarah Brewe', 'Andrew Budge', 'Leslie Campos', 'Tiffany Chow', 'Jesse Ewing-Frable', 'Audrey Falkner', 'Taylor Griffin', 'Kari Hale', 'Landon Harrison', 'Stacey Jesse', 'Audrey Jones', 'Kristine Kyllingmark', 'Patrick Monson', 'Elizabeth Peters', 'Makenzi Schuerholz', 'Maddy Shields', 'Harper Wakeman', 'Kate Walker'];
const SCIENCE_TEACHERS = ['Michael Bailey', 'Sarah Carter', 'Kevin Clemente', 'Hatice Demir', 'Urbin Donnafield', 'Jon Dykstra', 'Alex Margarito-Lopez', 'Alexandra Pike', 'Tess Ritcey', 'Jodie Spitze', 'JD Stutz', 'Melanie Torrez', 'Emily Tribble', 'Matt Winkler'];
const SOCIAL_STUDIES_TEACHERS = ['Steve Bennett', 'Matt Breysse', 'Ryan Chism', 'Leia Deak', 'Scott Dotson', 'Allison Fishman', 'Madeleine Hunter', 'Sehrish Jamshed', 'Gabriela Serrano', 'Peter Verdoes'];
const PE_HEALTH_TEACHERS = ['Lesley Crawford', 'Dawn Maurer', 'Danielle Meyer', 'Carly Parker', 'Andy Walford', 'Regan Wessman'];
const SPED_TEACHERS = ['Rebekah DeFord', 'Mark Frame', 'Jessica Huber', 'Steve Juzeler', 'Hannah Knoll', 'Jim Myers', 'Zoe Pilgrim-Placey', 'Jarrod Roberts', 'Sarika Sharma', 'Lisa Taylor'];

export const SUBJECTS = [
  // Math
  'Algebra 1',
  'Algebra 2',
  'Algebra 3 w/ Trigonometry',
  'AP Calculus AB',
  'AP Calculus BC',
  'AP Statistics',
  'Bridge to College Math',
  'CAM AICE A Mathematics',
  'CAM AICE AS Mathematics',
  'CAM Pre-AICE Mathematics',
  'Geometry',
  'Modeling Our World with Math',
  'Personal Finance',
  'Pre-Calculus',

  // English
  'AP English Language and Composition',
  'AP English Literature and Composition',
  'CAM AICE AS English',
  'CAM AICE AS Literature',
  'CAM AICE A Literature',
  'CAM Pre-AICE English',
  'Creative Writing',
  'English 9',
  'English 10',
  'English 11',
  'English 12',
  'Honors English 9',
  'Honors English 10',
  'Mystery and Detective Fiction',

  // Science
  'Anatomy and Physiology I',
  'Anatomy and Physiology II',
  'AP Biology',
  'AP Chemistry',
  'AP Environmental Science',
  'AP Physics 1',
  'AP Physics 2',
  'Biology in the Earth System',
  'Biotechnology I',
  'Biotechnology II',
  'CAM AICE AS Biology',
  'CAM AICE AS Chemistry',
  'CAM AICE AS Physics',
  'CAM Pre-AICE Science',
  'Chemistry in the Earth System',
  'Earth and Space Science',
  'Physics in the Universe',

  // Social Studies
  'AP Human Geography',
  'AP US Government',
  'AP US History',
  'AP World History',
  'CAM AICE AS Global Perspectives',
  'CAM AICE AS History',
  'CAM AICE A History',
  'CAM Pre-AICE History',
  'Civics',
  'Decolonizing US History',
  'Economics',
  'Ethnic Studies',
  'History Through Film',
  'Law and Justice',
  'Psychology',
  'AP Psychology',
  'World History 1 Honors',
  'World History 2 Honors',

  // PE / Health
  'Family Health',
  'Lifetime Wellness',
  'PE',
  'Racquet and Net Sports',
  'Sports Medicine',
  'Strength Training 1',
  'Strength Training 2',
  'Team Sports',
  'Walking & Wellness',
  "Women's Strength Training 1",

  // World Languages
  'American Sign Language I',
  'American Sign Language II',
  'American Sign Language III',
  'American Sign Language IV',
  'AP Japanese Language & Culture',
  'AP Spanish Language and Culture',
  'French 1',
  'French 2',
  'French 3',
  'French 4',
  'Japanese 1',
  'Japanese 2',
  'Japanese 3',
  'Spanish 1',
  'Spanish 2',
  'Spanish 3',
  'Spanish 4',
  'Spanish for Heritage Learners',

  // Visual Arts
  '3D Design 1',
  'AP 2D Art and Design',
  'AP Drawing',
  'Art 1',
  'Art 2: Drawing and Painting',
  'Art 3: Drawing and Painting',
  'Ceramics/Pottery 1',
  'Ceramics/Pottery 2',
  'Photography I-A',
  'Photography I-B',
  'Photography II-A',

  // Performing Arts
  'Band 1',
  'Band 2',
  'Band 3',
  'Band 4',
  'Choir 1',
  'Choir 2',
  'Choir 4',
  'Costume/Scenic Design',
  'Drama 1',
  'Drama 2',
  'Drama 3',
  'Guitar 1',
  'Guitar 2',
  'Jazz Band',
  'Jazz Choir',
  'Music Appreciation',
  'AP Music Theory',
  'Orchestra 1',
  'Orchestra 2',
  'Orchestra 4',
  'Percussion Ensemble',
  'Piano 1',
  'Piano 2',
  'Technical Theater',
  'Technical Theater II',
  'Theater Production',

  // CTE / Business / Tech
  'AI Foundations',
  'AP Business',
  'AP Computer Science A',
  'AP Computer Science Principles',
  'Architecture & Engineering',
  'Business and Marketing Foundations I',
  'Business and Marketing Foundations II',
  'Child Development I-A',
  'Culinary Arts I',
  'Culinary Arts II',
  'Engineering Design',
  'Food Science',
  'Graphic Production & Design I',
  'Graphic Production & Design II',
  'Interior Design',
  'Leadership Development and Project Management I',
  'Leadership Development and Project Management II',
  'Material Science I',
  'Material Science II',
  'Microsoft Office Specialist I',
  'Retail Management I/II',
  'Retail Operations I/II',
  'Robotics I',
  'Teacher Education Academy I',
  'Teacher Education Academy II',

  // Other
  'Orientation',
  'Special Education',
  'Yearbook I',
  'Yearbook II',
];

// Teachers by subject from JHS staff directory
export const TEACHERS: Record<string, string[]> = {
  // Math
  'Algebra 1': MATH_TEACHERS,
  'Algebra 2': MATH_TEACHERS,
  'Algebra 3 w/ Trigonometry': MATH_TEACHERS,
  'AP Calculus AB': MATH_TEACHERS,
  'AP Calculus BC': MATH_TEACHERS,
  'AP Statistics': MATH_TEACHERS,
  'Bridge to College Math': MATH_TEACHERS,
  'CAM AICE A Mathematics': MATH_TEACHERS,
  'CAM AICE AS Mathematics': MATH_TEACHERS,
  'CAM Pre-AICE Mathematics': MATH_TEACHERS,
  'Geometry': MATH_TEACHERS,
  'Modeling Our World with Math': MATH_TEACHERS,
  'Personal Finance': MATH_TEACHERS,
  'Pre-Calculus': MATH_TEACHERS,

  // English
  'AP English Language and Composition': ENGLISH_TEACHERS,
  'AP English Literature and Composition': ENGLISH_TEACHERS,
  'CAM AICE AS English': ENGLISH_TEACHERS,
  'CAM AICE AS Literature': ENGLISH_TEACHERS,
  'CAM AICE A Literature': ENGLISH_TEACHERS,
  'CAM Pre-AICE English': ENGLISH_TEACHERS,
  'Creative Writing': ENGLISH_TEACHERS,
  'English 9': ENGLISH_TEACHERS,
  'English 10': ENGLISH_TEACHERS,
  'English 11': ENGLISH_TEACHERS,
  'English 12': ENGLISH_TEACHERS,
  'Honors English 9': ENGLISH_TEACHERS,
  'Honors English 10': ENGLISH_TEACHERS,
  'Mystery and Detective Fiction': ENGLISH_TEACHERS,

  // Science
  'Anatomy and Physiology I': SCIENCE_TEACHERS,
  'Anatomy and Physiology II': SCIENCE_TEACHERS,
  'AP Biology': SCIENCE_TEACHERS,
  'AP Chemistry': SCIENCE_TEACHERS,
  'AP Environmental Science': SCIENCE_TEACHERS,
  'AP Physics 1': SCIENCE_TEACHERS,
  'AP Physics 2': SCIENCE_TEACHERS,
  'Biology in the Earth System': SCIENCE_TEACHERS,
  'Biotechnology I': SCIENCE_TEACHERS,
  'Biotechnology II': SCIENCE_TEACHERS,
  'CAM AICE AS Biology': SCIENCE_TEACHERS,
  'CAM AICE AS Chemistry': SCIENCE_TEACHERS,
  'CAM AICE AS Physics': SCIENCE_TEACHERS,
  'CAM Pre-AICE Science': SCIENCE_TEACHERS,
  'Chemistry in the Earth System': SCIENCE_TEACHERS,
  'Earth and Space Science': SCIENCE_TEACHERS,
  'Physics in the Universe': SCIENCE_TEACHERS,

  // Social Studies
  'AP Human Geography': SOCIAL_STUDIES_TEACHERS,
  'AP US Government': SOCIAL_STUDIES_TEACHERS,
  'AP US History': SOCIAL_STUDIES_TEACHERS,
  'AP World History': SOCIAL_STUDIES_TEACHERS,
  'CAM AICE AS Global Perspectives': SOCIAL_STUDIES_TEACHERS,
  'CAM AICE AS History': SOCIAL_STUDIES_TEACHERS,
  'CAM AICE A History': SOCIAL_STUDIES_TEACHERS,
  'CAM Pre-AICE History': SOCIAL_STUDIES_TEACHERS,
  'Civics': SOCIAL_STUDIES_TEACHERS,
  'Decolonizing US History': SOCIAL_STUDIES_TEACHERS,
  'Economics': SOCIAL_STUDIES_TEACHERS,
  'Ethnic Studies': SOCIAL_STUDIES_TEACHERS,
  'History Through Film': SOCIAL_STUDIES_TEACHERS,
  'Law and Justice': SOCIAL_STUDIES_TEACHERS,
  'Psychology': ['Deborah Gerdes', ...SOCIAL_STUDIES_TEACHERS],
  'AP Psychology': ['Deborah Gerdes', ...SOCIAL_STUDIES_TEACHERS],
  'World History 1 Honors': SOCIAL_STUDIES_TEACHERS,
  'World History 2 Honors': SOCIAL_STUDIES_TEACHERS,

  // PE / Health
  'Family Health': PE_HEALTH_TEACHERS,
  'Lifetime Wellness': PE_HEALTH_TEACHERS,
  'PE': PE_HEALTH_TEACHERS,
  'Racquet and Net Sports': PE_HEALTH_TEACHERS,
  'Sports Medicine': PE_HEALTH_TEACHERS,
  'Strength Training 1': PE_HEALTH_TEACHERS,
  'Strength Training 2': PE_HEALTH_TEACHERS,
  'Team Sports': PE_HEALTH_TEACHERS,
  'Walking & Wellness': PE_HEALTH_TEACHERS,
  "Women's Strength Training 1": PE_HEALTH_TEACHERS,

  // World Languages
  'American Sign Language I': ['Emma Winward'],
  'American Sign Language II': ['Emma Winward'],
  'American Sign Language III': ['Emma Winward'],
  'American Sign Language IV': ['Emma Winward'],
  'AP Japanese Language & Culture': ['Kei Tsukamaki'],
  'AP Spanish Language and Culture': ['Elmer Delgado', 'Alexandra Leal', 'Natalie MacKnight', 'Anne-Magali Sanchez'],
  'French 1': ['Cara DeAngelo'],
  'French 2': ['Cara DeAngelo'],
  'French 3': ['Cara DeAngelo'],
  'French 4': ['Cara DeAngelo'],
  'Japanese 1': ['Kei Tsukamaki'],
  'Japanese 2': ['Kei Tsukamaki'],
  'Japanese 3': ['Kei Tsukamaki'],
  'Spanish 1': ['Elmer Delgado', 'Alexandra Leal', 'Natalie MacKnight', 'Anne-Magali Sanchez'],
  'Spanish 2': ['Elmer Delgado', 'Alexandra Leal', 'Natalie MacKnight', 'Anne-Magali Sanchez'],
  'Spanish 3': ['Elmer Delgado', 'Alexandra Leal', 'Natalie MacKnight', 'Anne-Magali Sanchez'],
  'Spanish 4': ['Elmer Delgado', 'Alexandra Leal', 'Natalie MacKnight', 'Anne-Magali Sanchez'],
  'Spanish for Heritage Learners': ['Elmer Delgado', 'Alexandra Leal', 'Natalie MacKnight', 'Anne-Magali Sanchez'],

  // Visual Arts
  '3D Design 1': ['Dennis Greenwell', 'Jessica Haymaker', 'Kaylee Lishner', 'Melanie Artz'],
  'AP 2D Art and Design': ['Dennis Greenwell', 'Jessica Haymaker', 'Kaylee Lishner'],
  'AP Drawing': ['Dennis Greenwell', 'Jessica Haymaker', 'Kaylee Lishner'],
  'Art 1': ['Dennis Greenwell', 'Jessica Haymaker', 'Kaylee Lishner'],
  'Art 2: Drawing and Painting': ['Dennis Greenwell', 'Jessica Haymaker', 'Kaylee Lishner'],
  'Art 3: Drawing and Painting': ['Dennis Greenwell', 'Jessica Haymaker', 'Kaylee Lishner'],
  'Ceramics/Pottery 1': ['Melanie Artz'],
  'Ceramics/Pottery 2': ['Melanie Artz'],
  'Photography I-A': ['Miranda Steward'],
  'Photography I-B': ['Miranda Steward'],
  'Photography II-A': ['Miranda Steward'],

  // Performing Arts
  'Band 1': ['Annemarie Smith'],
  'Band 2': ['Annemarie Smith'],
  'Band 3': ['Annemarie Smith'],
  'Band 4': ['Annemarie Smith'],
  'Choir 1': ['Ashleigh Hasslinger'],
  'Choir 2': ['Ashleigh Hasslinger'],
  'Choir 4': ['Ashleigh Hasslinger'],
  'Costume/Scenic Design': ['Elizabeth McMurray-Hauk'],
  'Drama 1': ['Elizabeth McMurray-Hauk'],
  'Drama 2': ['Elizabeth McMurray-Hauk'],
  'Drama 3': ['Elizabeth McMurray-Hauk'],
  'Guitar 1': ['Annemarie Smith', 'Christopher Richards'],
  'Guitar 2': ['Annemarie Smith', 'Christopher Richards'],
  'Jazz Band': ['Annemarie Smith'],
  'Jazz Choir': ['Ashleigh Hasslinger'],
  'Music Appreciation': ['Annemarie Smith', 'Christopher Richards', 'Ashleigh Hasslinger'],
  'AP Music Theory': ['Annemarie Smith', 'Christopher Richards', 'Ashleigh Hasslinger'],
  'Orchestra 1': ['Christopher Richards'],
  'Orchestra 2': ['Christopher Richards'],
  'Orchestra 4': ['Christopher Richards'],
  'Percussion Ensemble': ['Annemarie Smith'],
  'Piano 1': ['Annemarie Smith', 'Christopher Richards'],
  'Piano 2': ['Annemarie Smith', 'Christopher Richards'],
  'Technical Theater': ['Elizabeth McMurray-Hauk'],
  'Technical Theater II': ['Elizabeth McMurray-Hauk'],
  'Theater Production': ['Elizabeth McMurray-Hauk'],

  // CTE / Business / Tech
  'AI Foundations': ['ShineMay Woodcock'],
  'AP Business': ['Jennifer Harris'],
  'AP Computer Science A': ['ShineMay Woodcock'],
  'AP Computer Science Principles': ['ShineMay Woodcock'],
  'Architecture & Engineering': ['Greg Shelton'],
  'Business and Marketing Foundations I': ['Jennifer Harris'],
  'Business and Marketing Foundations II': ['Jennifer Harris'],
  'Child Development I-A': ['Emily Evans'],
  'Culinary Arts I': ['Emily Evans'],
  'Culinary Arts II': ['Emily Evans'],
  'Engineering Design': ['Greg Shelton'],
  'Food Science': ['Emily Evans'],
  'Graphic Production & Design I': ['Miranda Steward', 'ShineMay Woodcock'],
  'Graphic Production & Design II': ['Miranda Steward', 'ShineMay Woodcock'],
  'Interior Design': ['Emily Evans', 'Jennifer Harris'],
  'Leadership Development and Project Management I': ['Travis Salmi'],
  'Leadership Development and Project Management II': ['Travis Salmi'],
  'Material Science I': ['Greg Shelton'],
  'Material Science II': ['Greg Shelton'],
  'Microsoft Office Specialist I': ['Jennifer Harris', 'ShineMay Woodcock'],
  'Retail Management I/II': ['Jennifer Harris'],
  'Retail Operations I/II': ['Jennifer Harris'],
  'Robotics I': ['Greg Shelton', 'ShineMay Woodcock'],
  'Teacher Education Academy I': ['Emily Evans'],
  'Teacher Education Academy II': ['Emily Evans'],

  // Other
  'Orientation': SPED_TEACHERS,
  'Special Education': SPED_TEACHERS,
  'Yearbook I': ['Miranda Steward'],
  'Yearbook II': ['Miranda Steward'],
};

// === LAKE WASHINGTON HIGH SCHOOL DATA ===

const LWHS_MATH_TEACHERS = ['Shawnna Breach', 'Mercer Brown', 'Matthew Comes', 'Curtis Houston', 'Carla Huffman', 'Fei Lu', 'Nadia Marcus', 'Devony Marin', 'Lisa Martinez', 'Natalie Reeves', 'Josh Taylor', 'Dean Willis', 'Henry Woods'];
const LWHS_ENGLISH_TEACHERS = ['Amy Bateman', 'Jill Berge', 'Melissa Cabaniss', 'Alex Diaz', 'Michelle Erstad', 'Sarah Fradkin', 'Zach Grundl', 'Camille Harper', 'Morgan Heetbrink', 'Justin Hopkins', 'Whitney Horton', 'Ben Johnson', 'Alisa Kathol', 'Jeffrey Keller', 'Matthew Macomber', 'Chad Marsh', 'Irene Pfister', 'Rebecca Rinks', 'Amy Sullivan', 'Terry Terich', 'Lauren Vasquez', 'Alex Watanabe'];
const LWHS_SCIENCE_TEACHERS = ['Skylar Bangerter', 'Sarah Barker', 'Carrie Danziger', 'Max Elliot', 'Megan Koury', 'Donald Lamy', 'Kate Moore', 'Ryan Palmer', 'Kristen Popescu', 'Madeline Tanis', 'Andrea Thody', 'Ronica Wilson', 'Erin Yen', 'Ashley Zydel'];
const LWHS_SOCIAL_STUDIES_TEACHERS = ['Michael Adamik', 'Jaimi Adams', 'Jill Berge', 'Michael Dawson', 'Emily Gamache', 'Beau Hansen', 'Maik Hollinger', 'Brenna Mahoney', 'Sean Mullin', 'Bryan Rowley', 'Parker Ruehl', 'Bethany Shoda', 'Kelly Wall'];
const LWHS_PE_HEALTH_TEACHERS = ['Andrew Arena', 'Danielle Barber', 'Liam Barnsby', 'Jill Collier', 'Jill Lewinski', 'Jaimie Mendoza-Tovar', 'Stephen Supple'];
const LWHS_WORLD_LANG_TEACHERS = ['Emilie Declines', 'Karley Deegan', 'Lucita Fox', 'Londa Green-Wyant', 'Amanda Layton', 'Sarah Sidell', 'Gabriela Starr', 'Valerie Yob'];
const LWHS_ARTS_TEACHERS = ['Naveen Ansari', 'Hillary Minne', 'Samantha VanWaardhuizen', 'Belle Wages', 'Matthew Kruse', 'Heidi Menzenberg-Zvilna', 'Justin Nipp', 'Susan Ring Vitue', 'Kimberly Wacker'];
const LWHS_CTE_TEACHERS = ['Aylenne Barnes', 'Bill Cattin', 'Mary Clarke', 'Chase Fetters', 'Carl Green', 'Timothy Stave'];

export const LWHS_SUBJECTS = [
  // Math - Core
  'Algebra 1',
  'Algebra 2',
  'Algebra 2 Honors',
  'Geometry',
  'Trigonometry',
  'Pre-Calculus',
  'Calculus',
  'AP Calculus AB',
  'AP Calculus BC',
  'AP Precalculus',
  'AP Statistics',
  'Intro to Statistics',
  'Financial Algebra',
  'Personal Finance',
  
  // English - Core
  'English 9',
  'Honors English 9',
  'English 10',
  'Honors English 10',
  'English 11',
  'English 12',
  'AP English Language and Composition',
  'AP English Literature and Composition',
  'Creative Writing',
  'Film as Literature',
  'Mythology',
  
  // Science - Core
  'Biology in the Earth System',
  'Chemistry in the Earth System',
  'Physics in the Universe',
  'AP Biology',
  'AP Chemistry',
  'AP Physics 1',
  'AP Physics 2',
  'AP Environmental Science',
  'Anatomy and Physiology I',
  'Anatomy and Physiology II',
  'Marine Science - Climate Change',
  'Meteorology - Weather & Climate',
  'Zoology',
  
  // Social Studies - Core
  'AP US History',
  'U.S. History: 20th and 21st Century',
  'World History 1: Ancient Cultures to Post-Classical World',
  'World History 2: Post-Classical World to Present Day',
  'AP World History',
  'Civics',
  'POLS& 202 AP US Government',
  'AP Human Geography',
  'Psychology',
  'AP Psychology',
  'AP Macroeconomics/AP Microeconomics',
  'History Through Film',
  'World Religions',
  
  // PE/Health - Core
  'Grade 9 Physical Education',
  'Family Health',
  'Team Sports',
  'Strength Training 1',
  'Strength Training 2',
  'Walking & Wellness',
  'Racquet and Net Sports',
  'Recreational Sports',
  'Sports Medicine',
  'Partner PE',
  
  // World Languages
  'Spanish 1',
  'Spanish 2',
  'Spanish 3',
  'Spanish 4',
  'AP Spanish Language and Culture',
  'French 1',
  'French 2',
  'French 3',
  'French 4',
  'AP French Language & Culture',
  'American Sign Language I',
  'American Sign Language II',
  'American Sign Language III',
  
  // Arts
  '2D Art 1 - Drawing/Painting',
  '2D Art 2 - Drawing/Painting',
  '3D Art 1 - Ceramics/Sculpture',
  'Photography I-A',
  'Band 1',
  'Band 2',
  'Choir 1',
  'Choir 2',
  'Orchestra 1',
  'Orchestra 2',
  'Drama 1',
  'Drama 2',
  
  // CTE
  'AP Computer Science Principles',
  'AP Computer Science A',
  'Data Structures',
  'Engineering Design',
  'Robotics I',
  'Robotics II',
  'Culinary Arts I',
  'Culinary Arts II',
  'Graphic Production & Design I',
];

export const LWHS_TEACHERS: Record<string, string[]> = {
  // Math
  'Algebra 1': LWHS_MATH_TEACHERS,
  'Algebra 2': LWHS_MATH_TEACHERS,
  'Algebra 2 Honors': LWHS_MATH_TEACHERS,
  'Geometry': LWHS_MATH_TEACHERS,
  'Trigonometry': LWHS_MATH_TEACHERS,
  'Pre-Calculus': LWHS_MATH_TEACHERS,
  'Calculus': LWHS_MATH_TEACHERS,
  'AP Calculus AB': LWHS_MATH_TEACHERS,
  'AP Calculus BC': LWHS_MATH_TEACHERS,
  'AP Precalculus': LWHS_MATH_TEACHERS,
  'AP Statistics': LWHS_MATH_TEACHERS,
  'Intro to Statistics': LWHS_MATH_TEACHERS,
  'Financial Algebra': LWHS_MATH_TEACHERS,
  'Personal Finance': LWHS_MATH_TEACHERS,
  
  // English
  'English 9': LWHS_ENGLISH_TEACHERS,
  'Honors English 9': LWHS_ENGLISH_TEACHERS,
  'English 10': LWHS_ENGLISH_TEACHERS,
  'Honors English 10': LWHS_ENGLISH_TEACHERS,
  'English 11': LWHS_ENGLISH_TEACHERS,
  'English 12': LWHS_ENGLISH_TEACHERS,
  'AP English Language and Composition': LWHS_ENGLISH_TEACHERS,
  'AP English Literature and Composition': LWHS_ENGLISH_TEACHERS,
  'Creative Writing': LWHS_ENGLISH_TEACHERS,
  'Film as Literature': LWHS_ENGLISH_TEACHERS,
  'Mythology': LWHS_ENGLISH_TEACHERS,
  
  // Science
  'Biology in the Earth System': LWHS_SCIENCE_TEACHERS,
  'Chemistry in the Earth System': LWHS_SCIENCE_TEACHERS,
  'Physics in the Universe': LWHS_SCIENCE_TEACHERS,
  'AP Biology': LWHS_SCIENCE_TEACHERS,
  'AP Chemistry': LWHS_SCIENCE_TEACHERS,
  'AP Physics 1': LWHS_SCIENCE_TEACHERS,
  'AP Physics 2': LWHS_SCIENCE_TEACHERS,
  'AP Environmental Science': LWHS_SCIENCE_TEACHERS,
  'Anatomy and Physiology I': LWHS_SCIENCE_TEACHERS,
  'Anatomy and Physiology II': LWHS_SCIENCE_TEACHERS,
  'Marine Science - Climate Change': LWHS_SCIENCE_TEACHERS,
  'Meteorology - Weather & Climate': LWHS_SCIENCE_TEACHERS,
  'Zoology': LWHS_SCIENCE_TEACHERS,
  
  // Social Studies
  'AP US History': LWHS_SOCIAL_STUDIES_TEACHERS,
  'U.S. History: 20th and 21st Century': LWHS_SOCIAL_STUDIES_TEACHERS,
  'World History 1: Ancient Cultures to Post-Classical World': LWHS_SOCIAL_STUDIES_TEACHERS,
  'World History 2: Post-Classical World to Present Day': LWHS_SOCIAL_STUDIES_TEACHERS,
  'AP World History': LWHS_SOCIAL_STUDIES_TEACHERS,
  'Civics': LWHS_SOCIAL_STUDIES_TEACHERS,
  'POLS& 202 AP US Government': LWHS_SOCIAL_STUDIES_TEACHERS,
  'AP Human Geography': LWHS_SOCIAL_STUDIES_TEACHERS,
  'Psychology': LWHS_SOCIAL_STUDIES_TEACHERS,
  'AP Psychology': LWHS_SOCIAL_STUDIES_TEACHERS,
  'AP Macroeconomics/AP Microeconomics': LWHS_SOCIAL_STUDIES_TEACHERS,
  'History Through Film': LWHS_SOCIAL_STUDIES_TEACHERS,
  'World Religions': LWHS_SOCIAL_STUDIES_TEACHERS,
  
  // PE/Health
  'Grade 9 Physical Education': LWHS_PE_HEALTH_TEACHERS,
  'Family Health': LWHS_PE_HEALTH_TEACHERS,
  'Team Sports': LWHS_PE_HEALTH_TEACHERS,
  'Strength Training 1': LWHS_PE_HEALTH_TEACHERS,
  'Strength Training 2': LWHS_PE_HEALTH_TEACHERS,
  'Walking & Wellness': LWHS_PE_HEALTH_TEACHERS,
  'Racquet and Net Sports': LWHS_PE_HEALTH_TEACHERS,
  'Recreational Sports': LWHS_PE_HEALTH_TEACHERS,
  'Sports Medicine': LWHS_PE_HEALTH_TEACHERS,
  'Partner PE': LWHS_PE_HEALTH_TEACHERS,
  
  // World Languages
  'Spanish 1': ['Karley Deegan', 'Lucita Fox', 'Londa Green-Wyant', 'Sarah Sidell', 'Gabriela Starr', 'Valerie Yob'],
  'Spanish 2': ['Karley Deegan', 'Lucita Fox', 'Londa Green-Wyant', 'Sarah Sidell', 'Gabriela Starr', 'Valerie Yob'],
  'Spanish 3': ['Karley Deegan', 'Lucita Fox', 'Londa Green-Wyant', 'Sarah Sidell', 'Gabriela Starr', 'Valerie Yob'],
  'Spanish 4': ['Karley Deegan', 'Lucita Fox', 'Londa Green-Wyant', 'Sarah Sidell', 'Gabriela Starr', 'Valerie Yob'],
  'AP Spanish Language and Culture': ['Karley Deegan', 'Lucita Fox', 'Londa Green-Wyant', 'Sarah Sidell', 'Gabriela Starr', 'Valerie Yob'],
  'French 1': ['Emilie Declines'],
  'French 2': ['Emilie Declines'],
  'French 3': ['Emilie Declines'],
  'French 4': ['Emilie Declines'],
  'AP French Language & Culture': ['Emilie Declines'],
  'American Sign Language I': ['Amanda Layton'],
  'American Sign Language II': ['Amanda Layton'],
  'American Sign Language III': ['Amanda Layton'],
  
  // Arts
  '2D Art 1 - Drawing/Painting': LWHS_ARTS_TEACHERS,
  '2D Art 2 - Drawing/Painting': LWHS_ARTS_TEACHERS,
  '3D Art 1 - Ceramics/Sculpture': LWHS_ARTS_TEACHERS,
  'Photography I-A': ['Justin Nipp', 'Kimberly Wacker'],
  'Band 1': ['Matthew Kruse'],
  'Band 2': ['Matthew Kruse'],
  'Choir 1': ['Heidi Menzenberg-Zvilna'],
  'Choir 2': ['Heidi Menzenberg-Zvilna'],
  'Orchestra 1': ['Matthew Kruse'],
  'Orchestra 2': ['Matthew Kruse'],
  'Drama 1': ['Morgan Heetbrink'],
  'Drama 2': ['Morgan Heetbrink'],
  
  // CTE
  'AP Computer Science Principles': ['Aylenne Barnes', 'Timothy Stave'],
  'AP Computer Science A': ['Timothy Stave'],
  'Data Structures': ['Aylenne Barnes', 'Timothy Stave'],
  'Engineering Design': ['Bill Cattin'],
  'Robotics I': ['Bill Cattin'],
  'Robotics II': ['Bill Cattin'],
  'Culinary Arts I': ['Mary Clarke'],
  'Culinary Arts II': ['Mary Clarke'],
  'Graphic Production & Design I': ['Justin Nipp'],
};

// Helper function to get subjects and teachers by school
export function getSchoolData(schoolId: SchoolId) {
  if (schoolId === 'lwhs') {
    return {
      subjects: LWHS_SUBJECTS,
      teachers: LWHS_TEACHERS,
    };
  }
  // Default to JHS
  return {
    subjects: SUBJECTS,
    teachers: TEACHERS,
  };
}
