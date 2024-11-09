// Models.js

// User class to represent a student user
class User {
    constructor(name, email, password, phoneNumber, batch = 'None') {
      this.name = name;
      this.email = email;
      this.password = password;
      this.phoneNumber = phoneNumber;
      this.batch = batch;
      this.testsAttempted = []; // List of test IDs with performance data
      this.dateCreated =     new Date();
    }
  
    // Add a method to update user performance in a test
    addTestPerformance(testId, score, timeTaken) {
      this.testsAttempted.push({ testId, score, timeTaken });
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
    constructor(prompt, subject, difficultyLevel, correctAnswer, timeRequired = 120, image = null) {
      this.prompt = prompt;
      this.subject = subject;
      this.difficultyLevel = difficultyLevel;
      this.correctAnswer = correctAnswer;
      this.timeRequired = timeRequired;
      this.image = image; // Optional image for the question
    }
  }
  
  export { User, Test, Question };
  