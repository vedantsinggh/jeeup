// Models.js
class User {
  constructor(name, email, password, phoneNumber, batch = 'None') {
    this.name = name;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.batch = batch;
    this.testsAttempted = []; // List of test IDs with performance data
    this.dateCreated = new Date();

    // Tracker data for subjects, units, and chapters
    this.subjects = {
      Math: [],
      Physics: [],
      Chemistry: [],
    };
  }

  // Add a method to update user performance in a test
  addTestPerformance(testId, score, timeTaken) {
    this.testsAttempted.push({ testId, score, timeTaken });
  }

  // Add a method to mark a chapter as done
  markChapterAsDone(subject, unit, chapter) {
    const subjectData = this.subjects[subject] || [];
    const unitData = subjectData.find((u) => u.unit === unit);

    if (unitData) {
      // Check if chapter is already marked
      if (!unitData.chaptersDone.includes(chapter)) {
        unitData.chaptersDone.push(chapter);
      }
    } else {
      // Add new unit if not present
      this.subjects[subject].push({ unit, chaptersDone: [chapter] });
    }
  }
}

  
class Test {
    constructor(
      testId,
      releaseDate,
      expirationDate,
      description,
      batchName,
      testName,
      testSyllabus,
      totalTestTime
    ) {
      this.testId = testId;
      this.releaseDate = releaseDate;
      this.expirationDate = expirationDate;
      this.description = description;
      this.batchName = batchName;
      this.testName = testName;
      this.testSyllabus = testSyllabus;
      this.totalTestTime = totalTestTime;
      this.locked = false; // Default value; can be set differently based on conditions
      this.status = 'upcoming'; // Default value; can be set dynamically
      this.score = null; // Default value; updated after test completion
    }
  
    // Add methods if needed, such as adding questions or calculating time remaining
    addPhysicsQuestion(question) {
      if (!this.physicsQuestions) {
        this.physicsQuestions = [];
      }
      this.physicsQuestions.push(question);
    }
  
    addChemistryQuestion(question) {
      if (!this.chemistryQuestions) {
        this.chemistryQuestions = [];
      }
      this.chemistryQuestions.push(question);
    }
  
    addMathQuestion(question) {
      if (!this.mathQuestions) {
        this.mathQuestions = [];
      }
      this.mathQuestions.push(question);
    }
  }
  // Question class to represent individual questions
  class Question {
    constructor(prompt, subject, difficultyLevel, correctAnswer, timeRequired = 120, image = null, isInteger) {
      this.prompt = prompt;
      this.subject = subject;
      this.difficultyLevel = difficultyLevel;
      this.correctAnswer = correctAnswer;
      this.timeRequired = timeRequired;
      this.image = image; // Optional image for the question
      this.isInteger = isInteger;
    }
  }
  
  export { User, Test, Question };
  