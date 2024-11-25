import React, { useState, useEffect } from "react";
import { db, auth } from "./firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Sparkles, BookOpen } from "lucide-react";
import "./TrackerPage.css";

const TeacherNote = () => {
  return (
    <div className="teacher-note">
      <div className="teacher-note-icon">
        <BookOpen color="#fff" size={24} />
      </div>
      <div className="teacher-note-content">
        <h3 className="teacher-note-title">✨ Professor's Wisdom Corner</h3>
        <p className="teacher-note-text">
          "Hello Vedant,

          Great work so far! 🎉 You're making excellent progress in all subjects, especially in Organic Chemistry and Mechanics. 
          💪 Next, focus on completing chapters like Alcohols, Phenols, and Ethers and Aldehydes, Ketones,
          and Carboxylic Acids in Chemistry, and Rotational Motion and Gravitation in Physics.
          In Mathematics, dive into Calculus, especially Integrals and Differential Equations.
          Keep practicing regularly, and review tougher topics. 
          Stay consistent, and you're on the path to success! 🚀 Keep it up!"
        </p>
      </div>
      <Sparkles 
        className="absolute top-2 right-2" 
        color="#f57258" 
        size={16}
      />
    </div>
  );
};

const TrackerPage = () => {
  const [activeTab, setActiveTab] = useState("Math");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Keep your existing subjects structure but we'll modify how we track progress
  const subjects = {
    Math: [
      {
        unit: "Algebra",
        chapters: [
          { name: "Quadratic Equations", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Sequences and Series", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Complex Numbers", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Binomial Theorem", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Matrices and Determinants", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
        ],
      },
      {
        unit: "Calculus",
        chapters: [
          { name: "Limits, Continuity and Differentiability", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Applications of Derivatives", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Integrals", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Applications of Integrals", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Differential Equations", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
        ],
      },
      {
        unit: "Coordinate Geometry",
        chapters: [
          { name: "Straight Lines", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Circles", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Parabolas", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Ellipses", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Hyperbolas", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
        ],
      },
      {
        unit: "Trigonometry",
        chapters: [
          { name: "Trigonometric Ratios and Identities", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Trigonometric Equations", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Properties of Triangles", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
        ],
      },
      {
        unit: "Vectors and 3D Geometry",
        chapters: [
          { name: "Vectors", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Three-dimensional Geometry", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
        ],
      },
      {
        unit: "Statistics and Probability",
        chapters: [
          { name: "Measures of Central Tendency and Dispersion", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Probability", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
        ],
      },
    ],
    Physics: [
      {
        unit: "Mechanics",
        chapters: [
          { name: "Kinematics", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Laws of Motion", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Work, Energy and Power", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Rotational Motion", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Gravitation", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
        ],
      },
      {
        unit: "Thermodynamics",
        chapters: [
          { name: "Thermal Properties of Matter", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Thermodynamics", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Kinetic Theory of Gases", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
        ],
      },
      {
        unit: "Electrodynamics",
        chapters: [
          { name: "Electrostatics", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Current Electricity", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Magnetism", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Electromagnetic Induction", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Alternating Current", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
        ],
      },
      {
        unit: "Optics",
        chapters: [
          { name: "Ray Optics", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Wave Optics", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
        ],
      },
      {
        unit: "Modern Physics",
        chapters: [
          { name: "Dual Nature of Matter and Radiation", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Atoms and Nuclei", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Electronic Devices", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
        ],
      },
    ],
    Chemistry: [
      {
        unit: "Physical Chemistry",
        chapters: [
          { name: "Some Basic Concepts in Chemistry", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "States of Matter", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Atomic Structure", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Chemical Bonding and Molecular Structure", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Thermodynamics", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Equilibrium", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Redox Reactions", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Electrochemistry", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Chemical Kinetics", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Surface Chemistry", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
        ],
      },
      {
        unit: "Inorganic Chemistry",
        chapters: [
          { name: "Periodic Table and Periodicity in Properties", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Chemical Bonding and Molecular Structure", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Coordination Compounds", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Environmental Chemistry", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "General Principles and Processes of Isolation of Elements", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
        ],
      },
      {
        unit: "Organic Chemistry",
        chapters: [
          { name: "Basic Principles and Techniques", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Hydrocarbons", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Haloalkanes and Haloarenes", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Alcohols, Phenols, and Ethers", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Aldehydes, Ketones and Carboxylic Acids", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Amines", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Biomolecules", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Polymers", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
          { name: "Chemistry in Everyday Life", lectureDone: false, pyqPracticeDone: false, pyqDone: false, testDone: false },
        ],
      },
    ],
  };
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        fetchUserData(user.uid);
      } else {
        setLoading(false);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        let userData = userSnap.data();
        
        if (!userData.subjects) {
          const initialSubjects = {
            Math: [],
            Physics: [],
            Chemistry: [],
          };
          
          await updateDoc(userRef, { subjects: initialSubjects });
          userData.subjects = initialSubjects;
        }
        
        setUserData(userData);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  const getChapterProgress = (subject, unit, chapterName) => {
    const unitData = userData?.subjects?.[subject]?.find((u) => u.unit === unit);
    const chapterData = unitData?.chapters?.find((ch) => ch.name === chapterName);
    return chapterData || {
      lectureDone: false,
      pyqPracticeDone: false,
      pyqDone: false,
      testDone: false,
    };
  };
  

  const calculateUnitProgress = (subject, unit) => {
    if (!userData?.subjects?.[subject]) return 0;
    
    const unitData = userData.subjects[subject].find(u => u.unit === unit);
    if (!unitData?.chapters) return 0;
    
    const chapters = subjects[subject].find(u => u.unit === unit).chapters;
    const totalTasks = chapters.length * 4; // 4 tasks per chapter
    
    let completedTasks = 0;
    unitData.chapters.forEach(chapter => {
      if (chapter.lectureDone) completedTasks++;
      if (chapter.pyqPracticeDone) completedTasks++;
      if (chapter.pyqDone) completedTasks++;
      if (chapter.testDone) completedTasks++;
    });
    
    return (completedTasks / totalTasks) * 100;
  };

  const handleProgressToggle = async (subject, unit, chapterName, field, isChecked) => {
    if (!currentUser) {
      console.error("No user logged in");
      return;
    }
  
    try {
      // Clone the current user data
      const updatedSubjects = { ...userData.subjects };
  
      // Find or create unit
      if (!updatedSubjects[subject]) {
        updatedSubjects[subject] = [];
      }
      let unitIndex = updatedSubjects[subject].findIndex((u) => u.unit === unit);
      if (unitIndex === -1) {
        updatedSubjects[subject].push({ unit, chapters: [] });
        unitIndex = updatedSubjects[subject].length - 1;
      }
  
      // Find or create chapter
      let chapterIndex = updatedSubjects[subject][unitIndex].chapters.findIndex(
        (ch) => ch.name === chapterName
      );
      if (chapterIndex === -1) {
        updatedSubjects[subject][unitIndex].chapters.push({
          name: chapterName,
          lectureDone: false,
          pyqPracticeDone: false,
          pyqDone: false,
          testDone: false,
        });
        chapterIndex = updatedSubjects[subject][unitIndex].chapters.length - 1;
      }
  
      // Update the specific field
      updatedSubjects[subject][unitIndex].chapters[chapterIndex][field] = isChecked;
  
      // Update Firestore
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, { subjects: updatedSubjects });
  
      // Update local state
      setUserData((prevData) => ({
        ...prevData,
        subjects: updatedSubjects,
      }));
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };
  

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!currentUser) {
    return <div className="error">Please log in to access the tracker.</div>;
  }

  const renderChapters = (chapters) => {
    return (
      <ul>
        {chapters.map((chapter, index) => (
          <li key={index}>
            <h4>{chapter.name}</h4>
            <p>Lecture Done: {chapter.lectureDone ? "Yes" : "No"}</p>
            <p>PYQ Practice Done: {chapter.pyqPracticeDone ? "Yes" : "No"}</p>
            <p>PYQ Done: {chapter.pyqDone ? "Yes" : "No"}</p>
            <p>Test Done: {chapter.testDone ? "Yes" : "No"}</p>
          </li>
        ))}
      </ul>
    );
  };
  

  return (
    <div className="tracker-page">
      <header className="tracker-header">
        <h1>Subject Tracker</h1>
      </header>

      <TeacherNote />

      <div className="tracker-tabs">
        {Object.keys(subjects).map((subject) => (
          <button
            key={subject}
            className={`tracker-tab ${activeTab === subject ? "active" : ""}`}
            onClick={() => setActiveTab(subject)}
          >
            {subject}
          </button>
        ))}
      </div>

      <div className="tracker-content">
        {subjects[activeTab].map((unit, unitIndex) => (
          <div key={unitIndex} className="tracker-unit">
            <div className="tracker-unit-header">
              <h2 className="tracker-unit-title">{unit.unit}</h2>
              <div className="tracker-progress-bar">
                <div
                  className="tracker-progress"
                  style={{
                    width: `${calculateUnitProgress(activeTab, unit.unit)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="tracker-chapters">
              {unit.chapters.map((chapter, chapterIndex) => {
                const progress = getChapterProgress(activeTab, unit.unit, chapter);
                return (
                  <div key={chapterIndex} className="tracker-chapter">
                    <span className="chapter-name">{chapter.name}</span>
                    <div className="chapter-progress">
                    <label className="progress-item">
    <input
      type="checkbox"
      checked={getChapterProgress(activeTab, unit.unit, chapter.name).lectureDone}
      onChange={(e) =>
        handleProgressToggle(activeTab, unit.unit, chapter.name, "lectureDone", e.target.checked)
      }
    />
    <span>Lecture</span>
  </label>

  {/* PYQ Practice Done */}
  <label className="progress-item">
    <input
      type="checkbox"
      checked={getChapterProgress(activeTab, unit.unit, chapter.name).pyqPracticeDone}
      onChange={(e) =>
        handleProgressToggle(activeTab, unit.unit, chapter.name, "pyqPracticeDone", e.target.checked)
      }
    />
    <span>PYQ Practice</span>
  </label>

  {/* PYQ Done */}
  <label className="progress-item">
    <input
      type="checkbox"
      checked={getChapterProgress(activeTab, unit.unit, chapter.name).pyqDone}
      onChange={(e) =>
        handleProgressToggle(activeTab, unit.unit, chapter.name, "pyqDone", e.target.checked)
      }
    />
    <span>PYQ</span>
  </label>

  {/* Test Done */}
  <label className="progress-item">
    <input
      type="checkbox"
      checked={getChapterProgress(activeTab, unit.unit, chapter.name).testDone}
      onChange={(e) =>
        handleProgressToggle(activeTab, unit.unit, chapter.name, "testDone", e.target.checked)
      }
    />
    <span>Test</span>
  </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackerPage;