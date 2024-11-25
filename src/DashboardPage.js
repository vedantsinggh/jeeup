import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import './DashboardPage.css';
import { Test } from './Models';
import { 
  LayoutDashboard, 
  BookOpen, 
  Bell, 
  LineChart, 
  Clock,
  Lock,
  BookCheck,
  Loader2,
  GraduationCap
} from 'lucide-react';

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
        <Loader2 className="w-16 h-16 text-[#f57258] animate-spin" />
      </div>
    );
  }

  const renderTestSection = (tests, title, icon) => (
    <div className="test-section">
      <h2 className="flex items-center gap-2">
        {icon}
        {title}
      </h2>
      <div className="test-card-container">
        {tests.map(test => (
          <div className={`test-card ${test.locked ? 'locked' : ''}`} key={test.testId}>
            <h3>{test.testName}</h3>
            <div className="flex items-center gap-2 justify-center">
            <p><BookCheck size={18} className="text-[#f57258]" />
              <strong>   Syllabus:</strong> {test.testSyllabus}</p>
            </div>
            <div className="flex items-center gap-2 justify-center">
            <p><Clock size={18} className="text-[#f57258]" />
              <strong>  Total Time:</strong> {test.totalTestTime} mins</p>
            </div>
            {test.score !== null && (
              <div className="flex items-center gap-2 justify-center">
                <p><LineChart size={18} className="text-[#f57258]" />
                  Score: {test.score}%</p>
              </div>
            )}
            <button
              className="test-action-btn flex items-center justify-center gap-2"
              disabled={test.locked}
              onClick={() => handleTestClick(test.testId)}
            >
              {test.locked ? (
                <>
                  <Lock size={18} />
                  <span>Locked</span>
                </>
              ) : (
                <>
                  {/* <BookOpen size={18} /> */}
                  <span>Open Test</span>
                </>
              )}
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
        <h1 className="flex items-center justify-center gap-3">
          <LayoutDashboard className="w-10 h-10" /> JEE Elevate Test Dashboard
        </h1>
      </header>
      
      <nav className="dashboard-nav">
        <button onClick={() => handleNavigate('/tracker')} className="nav-btn flex items-center gap-2">
          <LineChart size={18} /> Tracker
        </button>
        <button onClick={() => handleNavigate('/notes')} className="nav-btn flex items-center gap-2">
          <BookOpen size={18} /> Notes
        </button>
        <button onClick={() => handleNavigate('/notices')} className="nav-btn flex items-center gap-2">
          <Bell size={18} /> Notices
        </button>
      </nav>

      <section className="test-lists">
        {renderTestSection(batchTests, ' Batch Tests', <GraduationCap size={24} className="text-[#f57258]" />)}
        {renderTestSection(fullTests, ' Full Tests', <BookOpen size={24} className="text-[#f57258]" />)}
        {renderTestSection(chapterTests, ' Chapter Tests', <BookCheck size={24} className="text-[#f57258]" />)}
      </section>
    </div>
  );
};

export default DashboardPage;