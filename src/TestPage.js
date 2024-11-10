import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, addDoc, collection, arrayUnion } from 'firebase/firestore';
import { db, auth } from './firebaseConfig'; // Import Firebase config (where auth is initialized)
import './TestPage.css';
import { Test } from './Models';

const TestPage = () => {
  const { testId } = useParams();
  const [testData, setTestData] = useState(null);
  const [userData, setUserData] = useState(null);  // To store current user data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAttempted, setHasAttempted] = useState(false);  // Flag to check if user has attempted the test
  const [isTestStarted, setIsTestStarted] = useState(false);  // Flag to check if the test has started
  const [showWarningDialog, setShowWarningDialog] = useState(false);  // Flag for dialog visibility
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentSubject, setCurrentSubject] = useState('physics');
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);
  const [stats, setStats] = useState(null);

  const [timeLeft, setTimeLeft] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [questionData, setQuestionData] = useState([]);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const testDocRef = doc(db, 'tests', testId);
        const docSnap = await getDoc(testDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          const testInstance = new Test(
            docSnap.id,
            data.releaseDate,
            data.expirationDate,
            data.description,
            data.batchName,
            data.testName,
            data.testSyllabus,
            data.totalTestTime
          );

          if (data.physicsQuestions) {
            data.physicsQuestions.forEach((q) => testInstance.addPhysicsQuestion(q));
          }
          if (data.chemistryQuestions) {
            data.chemistryQuestions.forEach((q) => testInstance.addChemistryQuestion(q));
          }
          if (data.mathQuestions) {
            data.mathQuestions.forEach((q) => testInstance.addMathQuestion(q));
          }

          setTestData(testInstance);
        } else {
          throw new Error('Test not found');
        }

        const currentUser = auth.currentUser;

        if (currentUser) {
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDoc(userDocRef);
          
            if (userSnap.exists()) {
              const userData = userSnap.data();
              setUserData(userData);
          
              // Assuming testAttempted is an array of objects or strings
              const testAttempted = userData.testsAttempted || [];
              
              // Filter all entries where testId matches
              const matchingEntries = testAttempted.filter(entry => entry.testId === testId);
          
              // If there are matching entries, update state or do something with the results
              if (matchingEntries.length > 0) {
                setHasAttempted(true);
                // Optionally, store or process the matching entries
                setStats(matchingEntries);  // assuming you want to store this in state
              }
            }
          }
          
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [testId]);

  // Helper function to format time
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (subject, index, answer) => {
    const currentTime = Date.now();
    const timeSpent = Math.round((currentTime - questionStartTime) / 1000);

    const currentQuestion = testData[`${subject}Questions`][index];

    const questionInfo = {
      subject,
      questionIndex: index,
      prompt: currentQuestion.prompt,
      selectedAnswer: answer,
      timeSpent,
      difficultyLevel: currentQuestion.difficultyLevel,
      correctAnswer: currentQuestion.correctAnswer,
      timeRequired: currentQuestion.timeRequired
    };

    setQuestionData(prev => {
      const existingIndex = prev.findIndex(q => q.subject === subject && q.questionIndex === index);

      if (existingIndex >= 0) {
        const newData = [...prev];
        newData[existingIndex] = questionInfo;
        return newData;
      }

      return [...prev, questionInfo];
    });

    setSelectedAnswers(prev => ({
      ...prev,
      [`${subject}_${index}`]: answer
    }));

    setQuestionStartTime(currentTime);
  };

  const handleTestSubmit = async () => {
    // Show the alert box informing the user about submission
    const confirmSubmit = window.confirm("You are about to submit your test. This action is unchangeable.");
    
    if (!confirmSubmit) {
      return; // If user cancels submission, return early
    }
  
    // Get the current time spent on the last question
    const finalTimeSpent = Math.round((Date.now() - questionStartTime) / 1000);
  
    // Prepare final question data for the current question
    const currentKey = `${currentSubject}_${currentQuestionIndex}`;
    if (selectedAnswers[currentKey]) {
      const lastQuestionInfo = {
        ...questionData.find(q => q.subject === currentSubject && q.questionIndex === currentQuestionIndex),
        timeSpent: finalTimeSpent
      };
  
      // Update question data with final time spent
      setQuestionData(prev => {
        const existingIndex = prev.findIndex(q => q.subject === currentSubject && q.questionIndex === currentQuestionIndex);
  
        if (existingIndex >= 0) {
          const newData = [...prev];
          newData[existingIndex] = lastQuestionInfo;
          return newData;
        }
        return prev;
      });
    }
  
    // Initialize total score
    let totalScore = 0;
  
    // Calculate score based on correct and incorrect answers
    questionData.forEach((question) => {
      const userAnswer = selectedAnswers[`${question.subject}_${question.questionIndex}`];
      if (userAnswer !== undefined) {
        if (userAnswer === question.correctAnswer) {
          totalScore += 4; // Add 4 marks for correct answer
        } else {
          totalScore -= 1; // Deduct 1 mark for incorrect answer
        }
      }
    });
  
    // Prepare test submission data
    const testSubmissionData = {
      testId,
      userId: auth.currentUser.uid,
      startTime,
      endTime: Date.now(),
      totalTimeSpent: Math.round((Date.now() - startTime) / 1000),
      totalScore, // Add the calculated score to the submission data
      questions: questionData
    };
  
    try {
      // Get the current user and update their "testsAttempted" field (array) with the test submission data
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
  
        // Add the test submission data to the "testsAttempted" field (array)
        await updateDoc(userDocRef, {
          testsAttempted: arrayUnion(testSubmissionData)
        });
  
        console.log('Test successfully added to testsAttempted array for user');
      }
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };
  
  // Add useEffect for timer initialization
  useEffect(() => {
    if (isTestStarted && !startTime) {
      const totalSeconds = (testData?.totalTestTime || 120) * 60;
      setTimeLeft(totalSeconds);
      setStartTime(Date.now());
      setQuestionStartTime(Date.now());
    }
  }, [isTestStarted, testData]); // Ensure this useEffect is called conditionally based on `isTestStarted` and `testData`

  // Timer effect
  useEffect(() => {
    let timer;
    if (timeLeft > 0 && isTestStarted) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTestSubmit(); // Auto-submit when time's up
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [timeLeft, isTestStarted]);

  const getAllQuestions = () => {
    const physics = testData?.physicsQuestions || [];
    const chemistry = testData?.chemistryQuestions || [];
    const math = testData?.mathQuestions || [];

    return {
      physics,
      chemistry,
      math
    };
  };

  const startTestHandler = () => {
    setShowWarningDialog(true);
  };

  const confirmStartTest = () => {
    setIsTestStarted(true);
    setShowWarningDialog(false);
  };

  const cancelStartTest = () => {
    setShowWarningDialog(false);
  };

  const getCurrentQuestion = () => {
    const questions = getAllQuestions();
    return questions[currentSubject][currentQuestionIndex];
  };

  const getQuestionStatus = (subject, index) => {
    const key = `${subject}_${index}`;
    return selectedAnswers[key] ? 'answered' : 'unanswered';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <img src="https://media.tenor.com/jfmI0j5FcpAAAAAM/loading-wtf.gif" alt="Loading" className="loading-gif" />
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }
  return (
    <div className="test-page">
    {!isTestStarted && <div>
      <h1>{testData?.testName || 'Test not found'}</h1>
      <p>{testData?.description || 'No description available'}</p>
      {!hasAttempted && <p><strong>Release Date:</strong> {testData?.releaseDate || 'N/A'}</p>}
      {!hasAttempted && <p><strong>Expiration Date:</strong> {testData?.expirationDate || 'N/A'}</p>}
      {!hasAttempted && <p><strong>Total Test Time:</strong> {testData?.totalTestTime || 'N/A'} minutes</p>}

      {hasAttempted ? (
        <div className="test-stats">
        <br/><br/><br/><hr/> <br/><br/><br/>
          <h3>Your Test Stats:</h3><br/>
          <p><strong>Score:</strong> {stats[0].totalScore} marks</p>
          <p><strong>Time Taken:</strong> {Math.ceil(stats[0].totalTimeSpent / 60)} minutes</p>
        </div>
      ) : (
        <div className="test-warning">
          <p>
            <strong>Warning:</strong> If you start this test, it will be considered as attempted, and you cannot retake it.
          </p>
          <button className="start-test-btn" onClick={startTestHandler}>
            Start Test
          </button>
        </div>
      )}

      {/* Warning Dialog Box */}
      {showWarningDialog && (
        <div className="warning-dialog">
          <div className="dialog-content">
            <h3>Are you sure you want to start the test?</h3>
            <p>This test will be counted as attempted, and you cannot retake it.</p>
            <div className="dialog-actions">
              <button onClick={confirmStartTest} className="confirm-btn">Yes, Start Test</button>
              <button onClick={cancelStartTest} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
</div>}
      {/* Quiz Questions Section */}
      {isTestStarted && (
  <div className="quiz-container">
    <div className="quiz-header">
      <div className="timer">
        Time Left: {formatTime(timeLeft)}
      </div>
      <div className="subject-tabs">
        <button 
          className={`subject-tab ${currentSubject === 'physics' ? 'active' : ''}`}
          onClick={() => {
            setCurrentSubject('physics');
            setQuestionStartTime(Date.now());
          }}
        >
          Physics
        </button>
        <button 
          className={`subject-tab ${currentSubject === 'chemistry' ? 'active' : ''}`}
          onClick={() => {
            setCurrentSubject('chemistry');
            setQuestionStartTime(Date.now());
          }}
        >
          Chemistry
        </button>
        <button 
          className={`subject-tab ${currentSubject === 'math' ? 'active' : ''}`}
          onClick={() => {
            setCurrentSubject('math');
            setQuestionStartTime(Date.now());
          }}
        >
          Math
        </button>
      </div>
      <button 
        className="grid-toggle"
        onClick={() => setShowQuestionGrid(!showQuestionGrid)}
      >
        Question Grid
      </button>
    </div>

    <div className="question-display">
      <div className="question-header">
        <span>Question {currentQuestionIndex + 1}/30</span>
        <span className="subject-indicator">{currentSubject.toUpperCase()}</span>
      </div>
      
      <div className="question-content">
        <p>{getCurrentQuestion()?.prompt}</p>
        
        {getCurrentQuestion()?.image && (
          <div className="question-image-container">
            <img 
              src={getCurrentQuestion().image} 
              alt="Question Illustration"
              className="question-image"
            />
          </div>
        )}
        
        <div className="options-grid">
          {['A', 'B', 'C', 'D'].map((option) => (
            <label key={option} className="option-container">
              <input
                type="radio"
                name={`question_${currentSubject}_${currentQuestionIndex}`}
                value={option}
                checked={selectedAnswers[`${currentSubject}_${currentQuestionIndex}`] === option}
                onChange={() => handleAnswerChange(currentSubject, currentQuestionIndex, option)}
              />
              <span className="option-text">Option {option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <button 
          className="nav-btn"
          onClick={() => {
            setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
            setQuestionStartTime(Date.now());
          }}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        <button 
          className="submit-btn"
          onClick={handleTestSubmit}
        >
          Submit Test
        </button>
        <button 
          className="nav-btn next"
          onClick={() => {
            setCurrentQuestionIndex(prev => Math.min(29, prev + 1));
            setQuestionStartTime(Date.now());
          }}
          disabled={currentQuestionIndex === 29}
        >
          Next
        </button>
      </div>
    </div>

    {/* Question Grid Modal */}
    {showQuestionGrid && (
      <div className="question-grid-modal">
        <div className="grid-content">
          <div className="grid-header">
            <h3>Question Navigator</h3>
            <button 
              className="close-grid"
              onClick={() => setShowQuestionGrid(false)}
            >
              ×
            </button>
          </div>
          
          {Object.entries(getAllQuestions()).map(([subject, questions]) => (
            <div key={subject} className="subject-grid">
              <h4>{subject.toUpperCase()}</h4>
              <div className="grid">
                {Array.from({ length: 30 }, (_, i) => (
                  <button
                    key={i}
                    className={`grid-item ${
                      currentSubject === subject && currentQuestionIndex === i 
                        ? 'current' 
                        : getQuestionStatus(subject, i)
                    }`}
                    onClick={() => {
                      setCurrentSubject(subject);
                      setCurrentQuestionIndex(i);
                      setShowQuestionGrid(false);
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}
    </div>
  );
};

export default TestPage;
