export function getSkillQuestions(basicDetails) {
  if (!basicDetails) return [];

  const { year, targetRole, skillLevel } = basicDetails;

  // Default (safe)
  let questions = [];

  // YEAR BASED
  if (year === "1st Year" || year === "2nd Year") {
    questions.push({
      id: "logic1",
      question: "What does a loop do in programming?",
      options: [
        "Repeats a block of code",
        "Stops program",
        "Stores data",
        "Compiles code",
      ],
      correct: 0,
    });
  }

  if (year === "3rd Year" || year === "Final Year") {
    questions.push({
      id: "dsa1",
      question: "Which data structure uses FIFO order?",
      options: ["Stack", "Queue", "Tree", "Graph"],
      correct: 1,
    });
  }

  // ROLE BASED
  if (targetRole.includes("Developer")) {
    questions.push({
      id: "dev1",
      question: "Which is NOT a programming language?",
      options: ["Java", "Python", "HTML", "React"],
      correct: 3,
    });
  }

  if (targetRole.includes("Data")) {
    questions.push({
      id: "data1",
      question: "Which language is commonly used for data analysis?",
      options: ["C", "Python", "HTML", "CSS"],
      correct: 1,
    });
  }

  // SKILL LEVEL
  if (skillLevel === "Advanced") {
    questions.push({
      id: "adv1",
      question: "Time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      correct: 1,
    });
  }

  return questions;
}
