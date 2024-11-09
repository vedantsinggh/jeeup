import React from 'react';
import { useParams } from 'react-router-dom';
import './TestPage.css';

const TestPage = () => {
  const { testId } = useParams();
  
  // Mock fetch data based on testId
  const testData = {
    id: testId,
    title: `Detailed Test Page for ID: ${testId}`,
    description: "This is a detailed view of the selected test. It includes instructions, test details, and the ability to start or review.",
  };

  return (
    <div className="test-page">
      <h1>{testData.title}</h1>
      <p>{testData.description}</p>
      {/* Add more test details as needed */}
      <button className="start-test-btn">Start Test</button>
    </div>
  );
};

export default TestPage;
