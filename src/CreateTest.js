// Import necessary Firestore methods and config
import { db } from './firebaseConfig';
import { collection, setDoc, doc, Timestamp } from 'firebase/firestore';
import { Question } from './Models';

const options = ['A', 'B', 'C', 'D'];  // Options for MCQ questions

// Function to generate random difficulty levels
function getRandomDifficulty() {
  const levels = ['Easy', 'Medium', 'Hard'];
  return levels[Math.floor(Math.random() * levels.length)];
}

// Function to generate sample questions
function generateSampleQuestions(subject, numQuestions) {
  const questions = [];
  
  // Generate 25 MCQs and 5 Integer type questions
  for (let i = 1; i <= numQuestions; i++) {
    const isInteger = i > 25; // The last 5 questions are integer type

    // For MCQs, generate random options (A, B, C, D) and pick a correct answer
    const correctAnswer = isInteger ? getRandomIntegerAnswer() : options[Math.floor(Math.random() * 4)];

    // Make sure correctAnswer is never undefined
    if (!correctAnswer) {
      console.error(`Invalid correct answer generated for ${subject} Question ${i}`);
      continue; // Skip this question if the correctAnswer is invalid
    }

    const question = new Question(
      `${isInteger ? `Integer-type` : `Sample ${subject} Question`} ${i}`,
      subject,
      getRandomDifficulty(),
      correctAnswer,
      isInteger ? 30 : 120, // Integer questions might need less time
      "https://i.ytimg.com/vi/gibuXt8u9Vc/maxresdefault.jpg", // Default no image
      isInteger // Set isInteger flag for integer-type questions
    );

    if (!question) {
      console.error(`Invalid question object created for ${subject} Question ${i}`);
      continue; // Skip this question if invalid
    }

    questions.push(question);
  }

  return questions;
}

// Function to generate a random integer answer for integer-type questions
function getRandomIntegerAnswer() {
  return Math.floor(Math.random() * 100); // Random integer between 0 and 99
}

// Create 30 questions for each subject (25 MCQs + 5 Integer-type)
const physicsQuestions = generateSampleQuestions('Physics', 30);
const chemistryQuestions = generateSampleQuestions('Chemistry', 30);
const mathQuestions = generateSampleQuestions('Mathematics', 30);

// Function to create a new test in Firestore
async function createTestInFirestore() {
  const testId = Timestamp.now().toMillis().toString(); // Unique test ID using timestamp
  const testRef = doc(collection(db, 'tests'), testId);

  // Log data being sent to Firestore to help debug
  console.log('Test Data:', {
    testId,
    physicsQuestions,
    chemistryQuestions,
    mathQuestions,
  });

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
      isInteger: q.isInteger, // Include the isInteger field
    })),
    chemistryQuestions: chemistryQuestions.map((q) => ({
      prompt: q.prompt,
      subject: q.subject,
      difficultyLevel: q.difficultyLevel,
      correctAnswer: q.correctAnswer,
      timeRequired: q.timeRequired,
      image: q.image,
      isInteger: q.isInteger, // Include the isInteger field
    })),
    mathQuestions: mathQuestions.map((q) => ({
      prompt: q.prompt,
      subject: q.subject,
      difficultyLevel: q.difficultyLevel,
      correctAnswer: q.correctAnswer,
      timeRequired: q.timeRequired,
      image: q.image,
      isInteger: q.isInteger, // Include the isInteger field
    })),
  };

  try {
    // Log the final testData before writing to Firestore
    console.log('Final Test Data:', testData);
    
    // Attempt to write data to Firestore
    await setDoc(testRef, testData);
    console.log('Test successfully created in Firestore with ID:', testId);
  } catch (error) {
    console.error('Error creating test in Firestore:', error);
  }
}

// Call the function to create a test
export default createTestInFirestore;
