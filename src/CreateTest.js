// Import necessary Firestore methods and config
import { db } from './firebaseConfig';
import { collection, setDoc, doc, Timestamp } from 'firebase/firestore';
import { Question } from './Models';

function generateSampleQuestions(subject, numQuestions) {
  const questions = [];
  for (let i = 1; i <= numQuestions; i++) {
    questions.push(
      new Question(
        `Sample ${subject} Question ${i}`,
        subject,
        getRandomDifficulty(),
        `Option ${Math.ceil(Math.random() * 4)}`, // Random correct answer
        120,
        "https://i.ytimg.com/vi/gibuXt8u9Vc/maxresdefault.jpg" // Default no image
      )
    );
  }
  return questions;
}

function getRandomDifficulty() {
  const levels = ['Easy', 'Medium', 'Hard'];
  return levels[Math.floor(Math.random() * levels.length)];
}

// Create 30 questions for each subject
const physicsQuestions = generateSampleQuestions('Physics', 30);
const chemistryQuestions = generateSampleQuestions('Chemistry', 30);
const mathQuestions = generateSampleQuestions('Mathematics', 30);

// Function to create a new test in Firestore
async function createTestInFirestore() {
  const testId = Timestamp.now().toMillis().toString(); // Unique test ID using timestamp
  const testRef = doc(collection(db, 'tests'), testId);

  const testData = {
    testId: testId,
    testName: 'Sample JEE Main Test', // New field for test name
    testSyllabus: 'Physics, Chemistry, and Mathematics topics included', // New field for syllabus description
    totalTestTime: 180, // New field for total test time in minutes (3 hours)
    dateOfRelease: Timestamp.now(),
    dateOfExpiration: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // Expiration set to 7 days from now
    description: 'Sample JEE Main Test with 30 questions each for PCM.',
    batchName: 'None', // Update this field as needed
    physicsQuestions: physicsQuestions.map((q) => ({
      prompt: q.prompt,
      subject: q.subject,
      difficultyLevel: q.difficultyLevel,
      correctAnswer: q.correctAnswer,
      timeRequired: q.timeRequired,
      image: q.image,
    })),
    chemistryQuestions: chemistryQuestions.map((q) => ({
      prompt: q.prompt,
      subject: q.subject,
      difficultyLevel: q.difficultyLevel,
      correctAnswer: q.correctAnswer,
      timeRequired: q.timeRequired,
      image: q.image,
    })),
    mathQuestions: mathQuestions.map((q) => ({
      prompt: q.prompt,
      subject: q.subject,
      difficultyLevel: q.difficultyLevel,
      correctAnswer: q.correctAnswer,
      timeRequired: q.timeRequired,
      image: q.image,
    })),
  };

  try {
    await setDoc(testRef, testData);
    console.log('Test successfully created in Firestore with ID:', testId);
  } catch (error) {
    console.error('Error creating test in Firestore:', error);
  }
}

// Call the function to create a test
export default createTestInFirestore;
