import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebaseConfig'; // Adjust this import based on your folder structure
import { collection, getDocs } from 'firebase/firestore';
import './DashboardPage.css';
import { Test } from './Models';
import createTestInFirestore from './CreateTest';

const DashboardPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tests'));
        const fetchedTests = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const testInstance = new Test(
            doc.id,
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
          fetchedTests.push(testInstance);
        });
        setTests(fetchedTests);
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleTestClick = (testId) => {
    navigate(`/test/${testId}`);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <img src="https://media.tenor.com/jfmI0j5FcpAAAAAM/loading-wtf.gif" alt="Loading" className="loading-gif" />
      </div>
    );
  }

  const renderTestSection = (tests, title) => (
    <div className="test-section">
      <h2>{title}</h2>
      <div className="test-card-container">
        {tests.map(test => (
          <div className={`test-card ${test.locked ? 'locked' : ''}`} key={test.testId}>
            <h3>{test.testName}</h3>
            <p><strong>Syllabus:</strong> {test.testSyllabus}</p>
            <p><strong>Total Time:</strong> {test.totalTestTime} mins</p>
            {test.score !== null && <p>Score: {test.score}%</p>}
            <button
              className="test-action-btn"
              disabled={test.locked}
              onClick={() => handleTestClick(test.testId)}
            >
              {test.locked ? 'Locked' : 'Open Test'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  if (tests.length === 0) {
    return <p className="no-tests-message">No tests available at the moment.</p>;
  }

  const batchTests = tests.filter(test => test.batchName === 'Batch Test');
  const fullTests = tests.filter(test => test.batchName === 'Full Test');
  const chapterTests = tests.filter(test => test.batchName === 'Part Test');

  return (
    <div className="dashboard-page">

      <header className="dashboard-header">
        <h1>JEE Elevate Test Dashboard</h1>
        {/* <p>Track your progress and prepare for upcoming tests.</p> */}
      </header>
      {/* Navigation Bar */}
      <nav className="dashboard-nav">
        <button onClick={() => handleNavigate('/tracker')} className="nav-btn">Tracker</button>
        <button onClick={() => handleNavigate('/notes')} className="nav-btn">Notes</button>
        <button onClick={() => handleNavigate('/notices')} className="nav-btn">Notices</button>
      </nav>
      <section className="test-lists">
        {renderTestSection(batchTests, 'Batch Tests')}
        {renderTestSection(fullTests, 'Full Tests')}
        {renderTestSection(chapterTests, 'Chapter Tests')}
      </section>
    </div>
  );
};

export default DashboardPage;
