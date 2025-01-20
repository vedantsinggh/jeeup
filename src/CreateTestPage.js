import React, { useState } from 'react';
import { read, utils } from 'xlsx';
import { db } from './firebaseConfig';
import { collection, setDoc, doc, Timestamp } from 'firebase/firestore';

const TestCreator = () => {
  const [testDetails, setTestDetails] = useState({
    testName: '',
    testSyllabus: '',
    totalTestTime: 180,
    batchName: '',
    description: ''
  });
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleTestDetailsChange = (e) => {
    const { name, value } = e.target;
    setTestDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const parseExcelFile = async (file) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);

      const transformedQuestions = jsonData.map((row, index) => ({
        prompt: row.prompt || `Question ${index + 1}`,
        subject: row.subject || 'Unknown',
        difficultyLevel: row.difficultyLevel || 'Medium',
        correctAnswer: row.correctAnswer?.toString() || 'A',
        timeRequired: parseInt(row.timeRequired) || 120,
        image: row.image || '',
        isInteger: row.isInteger === 'true' || row.isInteger === true
      }));

      setQuestions(transformedQuestions);
      setSuccess('Excel file successfully parsed!');
      setError('');
    } catch (err) {
      setError('Error parsing Excel file. Please check the format.');
      console.error('Excel parsing error:', err);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      parseExcelFile(file);
    }
  };

  const createTest = async () => {
    try {
      setIsUploading(true);
      setError('');

      // Group questions by subject
      const groupedQuestions = questions.reduce((acc, question) => {
        const subject = question.subject.toLowerCase();
        const key = subject === 'math' ? 'mathQuestions' :
                   subject === 'physics' ? 'physicsQuestions' :
                   subject === 'chemistry' ? 'chemistryQuestions' : null;
        
        if (key) {
          if (!acc[key]) acc[key] = [];
          acc[key].push(question);
        }
        return acc;
      }, {});

      // Create test data object
      const testId = Timestamp.now().toMillis().toString();
      const testData = {
        testId,
        testName: testDetails.testName,
        testSyllabus: testDetails.testSyllabus,
        totalTestTime: parseInt(testDetails.totalTestTime),
        dateOfRelease: Timestamp.now(),
        dateOfExpiration: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
        description: testDetails.description,
        batchName: testDetails.batchName,
        ...groupedQuestions
      };

      // Create document reference
      const testRef = doc(collection(db, 'tests'), testId);

      // Upload to Firestore
      await setDoc(testRef, testData);
      
      setSuccess('Test successfully created and uploaded to database!');
      
      // Reset form after successful upload
      setTestDetails({
        testName: '',
        testSyllabus: '',
        totalTestTime: 180,
        batchName: '',
        description: ''
      });
      setQuestions([]);
      
    } catch (err) {
      setError('Error creating test: ' + err.message);
      console.error('Test creation error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create New Test</h1>
        
        <div style={styles.formGroup}>
          <input
            style={styles.input}
            name="testName"
            placeholder="Test Name"
            value={testDetails.testName}
            onChange={handleTestDetailsChange}
          />
          <input
            style={styles.input}
            name="testSyllabus"
            placeholder="Test Syllabus"
            value={testDetails.testSyllabus}
            onChange={handleTestDetailsChange}
          />
          <input
            style={styles.input}
            name="totalTestTime"
            type="number"
            placeholder="Total Test Time (minutes)"
            value={testDetails.totalTestTime}
            onChange={handleTestDetailsChange}
          />
          <input
            style={styles.input}
            name="batchName"
            placeholder="Batch Name"
            value={testDetails.batchName}
            onChange={handleTestDetailsChange}
          />
          <textarea
            style={styles.textarea}
            name="description"
            placeholder="Test Description"
            value={testDetails.description}
            onChange={handleTestDetailsChange}
          />
        </div>

        <div style={styles.fileUpload}>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            style={styles.fileInput}
          />
          
          {questions.length > 0 && (
            <div style={styles.info}>
              <div>Total questions loaded: {questions.length}</div>
              <div style={styles.questionBreakdown}>
                Physics: {questions.filter(q => q.subject.toLowerCase() === 'physics').length} questions
                <br />
                Chemistry: {questions.filter(q => q.subject.toLowerCase() === 'chemistry').length} questions
                <br />
                Mathematics: {questions.filter(q => q.subject.toLowerCase() === 'math').length} questions
              </div>
            </div>
          )}
        </div>

        {error && (
          <div style={styles.error}>{error}</div>
        )}
        {success && (
          <div style={styles.success}>{success}</div>
        )}

        <button
          onClick={createTest}
          disabled={!questions.length || !testDetails.testName || isUploading}
          style={{
            ...styles.button,
            opacity: (!questions.length || !testDetails.testName || isUploading) ? 0.5 : 1
          }}
        >
          {isUploading ? 'Uploading...' : 'Create Test'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    marginBottom: '24px',
    color: '#333',
    textAlign: 'center'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px'
  },
  input: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px'
  },
  textarea: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
    minHeight: '100px',
    resize: 'vertical'
  },
  fileUpload: {
    marginBottom: '24px'
  },
  fileInput: {
    marginBottom: '12px'
  },
  info: {
    fontSize: '14px',
    color: '#666',
    marginTop: '12px'
  },
  questionBreakdown: {
    marginTop: '8px',
    paddingLeft: '12px',
    borderLeft: '2px solid #ddd'
  },
  error: {
    padding: '12px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    borderRadius: '4px',
    marginBottom: '16px'
  },
  success: {
    padding: '12px',
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    borderRadius: '4px',
    marginBottom: '16px'
  },
  button: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#1d4ed8'
    }
  }
};

export default TestCreator;