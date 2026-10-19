export const assessmentQuestionVersion = 2;

export const aptitudeQuestions = [
  { id: "q1", category: "Quantitative reasoning", difficulty: "Easy", question: "If a project takes 10 days and is delayed by 20%, how many days will it take?", options: ["10 days", "11 days", "12 days", "14 days"], correct: 2 },
  { id: "q2", category: "Quantitative reasoning", difficulty: "Easy", question: "A train travels 60 km in 1.5 hours. What is its average speed?", options: ["30 km/h", "35 km/h", "40 km/h", "45 km/h"], correct: 2 },
  { id: "q3", category: "Logical reasoning", difficulty: "Medium", question: "If all developers are engineers and some engineers are designers, which is true?", options: ["All developers are designers", "Some developers may be designers", "No developer is a designer", "All designers are engineers"], correct: 1 },
  { id: "q4", category: "Logical reasoning", difficulty: "Easy", question: "What comes next in the sequence: 2, 4, 8, 16, ?", options: ["20", "24", "30", "32"], correct: 3 },
  { id: "q5", category: "Problem solving", difficulty: "Easy", question: "A task has 5 independent steps. If each step takes 2 hours, how long does the complete task take?", options: ["2 hours", "5 hours", "7 hours", "10 hours"], correct: 3 },
  { id: "q6", category: "Quantitative reasoning", difficulty: "Easy", question: "A product priced at 800 is discounted by 25%. What is the sale price?", options: ["550", "600", "625", "650"], correct: 1 },
  { id: "q7", category: "Logical reasoning", difficulty: "Medium", question: "If today is Monday, what day will it be 17 days from today?", options: ["Tuesday", "Wednesday", "Thursday", "Friday"], correct: 2 },
  { id: "q8", category: "Problem solving", difficulty: "Medium", question: "A team completes 3 features in 6 days at a constant rate. How many features can it complete in 10 days?", options: ["4", "5", "6", "9"], correct: 1 },
  { id: "q9", category: "Quantitative reasoning", difficulty: "Easy", question: "If 40% of a class of 50 students submit a project early, how many students is that?", options: ["10", "15", "20", "25"], correct: 2 },
  { id: "q10", category: "Logical reasoning", difficulty: "Medium", question: "Which number does not belong: 3, 5, 7, 9, 11?", options: ["3", "5", "7", "9"], correct: 3 },
  { id: "q11", category: "Problem solving", difficulty: "Medium", question: "A bug affects every second request in a test of 20 requests. How many requests are affected?", options: ["5", "8", "10", "12"], correct: 2 },
  { id: "q12", category: "Quantitative reasoning", difficulty: "Medium", question: "A developer completes 75% of a 40-item task list. How many items remain?", options: ["5", "10", "15", "20"], correct: 1 },
];

const roleQuestions = {
  "Software Developer": [
    { id: "role-software-developer-1", category: "Software fundamentals", difficulty: "Medium", question: "Which data structure follows the last-in, first-out principle?", options: ["Queue", "Stack", "Tree", "Graph"], correct: 1 },
    { id: "role-software-developer-2", category: "Software fundamentals", difficulty: "Medium", question: "What is the main purpose of version control?", options: ["To compress images", "To track and manage code changes", "To host email", "To design user interfaces"], correct: 1 },
  ],
  "Software Engineer": [
    { id: "role-software-engineer-1", category: "Software engineering", difficulty: "Medium", question: "Which practice helps detect defects before code is merged?", options: ["Code review and automated tests", "Deleting the repository", "Disabling version control", "Increasing screen resolution"], correct: 0 },
    { id: "role-software-engineer-2", category: "Software engineering", difficulty: "Hard", question: "What is a primary benefit of designing a modular system?", options: ["Every module must share all state", "Changes can be isolated and maintained more easily", "Testing becomes impossible", "It removes the need for documentation"], correct: 1 },
  ],
  "Frontend Developer": [
    { id: "role-frontend-1", category: "Frontend development", difficulty: "Easy", question: "Which technology primarily describes the structure of a web page?", options: ["HTML", "SQL", "Git", "Docker"], correct: 0 },
    { id: "role-frontend-2", category: "Frontend development", difficulty: "Medium", question: "What is responsive design intended to support?", options: ["Only desktop screens", "Different screen sizes and devices", "Database backups", "Server authentication only"], correct: 1 },
  ],
  "Backend Developer": [
    { id: "role-backend-1", category: "Backend development", difficulty: "Easy", question: "What is the usual purpose of an API?", options: ["To define communication between software systems", "To replace all databases", "To style a web page", "To edit images"], correct: 0 },
    { id: "role-backend-2", category: "Backend development", difficulty: "Medium", question: "What does authentication primarily verify?", options: ["A user's identity", "A page's color", "A database's size", "A file's font"], correct: 0 },
  ],
  "Data Analyst": [
    { id: "role-data-analyst-1", category: "Data analysis", difficulty: "Easy", question: "What does the median represent?", options: ["The middle value in ordered data", "The largest value only", "The number of columns", "The file size"], correct: 0 },
    { id: "role-data-analyst-2", category: "Data analysis", difficulty: "Medium", question: "Which tool is commonly used to query relational data?", options: ["SQL", "HTML", "CSS", "Git"], correct: 0 },
  ],
  "ML Engineer": [
    { id: "role-ml-1", category: "Machine learning", difficulty: "Easy", question: "What is a training dataset used for?", options: ["Learning model patterns", "Changing screen brightness", "Managing user passwords", "Deploying a web server only"], correct: 0 },
    { id: "role-ml-2", category: "Machine learning", difficulty: "Medium", question: "What is overfitting?", options: ["A model performs well on training data but poorly on new data", "A model has no parameters", "A dataset contains no rows", "A server has too much storage"], correct: 0 },
  ],
  "UI/UX Designer": [
    { id: "role-uiux-1", category: "UI/UX design", difficulty: "Easy", question: "What is a wireframe primarily used to show?", options: ["A page's structure and layout", "A database schema only", "A server's CPU usage", "A source-code build log"], correct: 0 },
    { id: "role-uiux-2", category: "UI/UX design", difficulty: "Medium", question: "What is usability testing intended to evaluate?", options: ["How easily users can complete tasks", "How fast a database grows", "How many files a server stores", "How a compiler optimizes code"], correct: 0 },
  ],
};

export function getQuestionsForRole(targetRole) {
  return [
    ...aptitudeQuestions,
    ...(roleQuestions[targetRole] || roleQuestions["Software Developer"]),
  ];
}

export const readinessWeights = {
  projectExperience: 25,
  resumeStatus: 25,
  interviewExperience: 25,
  weeklyHours: 25,
};

export const readinessThresholds = {
  projectExperience: { "None yet": 0, "Mini / tutorial projects": 50, "End-to-end projects": 100 },
  resumeStatus: { "No resume yet": 0, "Basic resume": 50, "ATS-ready resume": 100 },
  interviewExperience: { "0 interviews": 0, "1–3 interviews": 50, "4+ interviews": 100 },
  weeklyHours: { "5–7 hours": 50, "8–12 hours": 75, "13–20 hours": 90, "20+ hours": 100 },
};
