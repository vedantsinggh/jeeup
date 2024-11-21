import React, { useState, useEffect } from "react";
import { db, auth } from "./firebaseConfig"; // Import auth as well
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
         and Carboxylic Acids in Chemistry , and Rotational Motion and Gravitation in Physics .
          In Mathematics, dive into Calculus, especially Integrals and Differential Equations .
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

  const subjects = {
    Math: [
      {
        unit: 'Algebra',
        chapters: [
          'Quadratic Equations',
          'Sequences and Series',
          'Complex Numbers',
          'Binomial Theorem',
          'Matrices and Determinants',
        ],
      },
      {
        unit: 'Calculus',
        chapters: [
          'Limits, Continuity and Differentiability',
          'Applications of Derivatives',
          'Integrals',
          'Applications of Integrals',
          'Differential Equations',
        ],
      },
      {
        unit: 'Coordinate Geometry',
        chapters: [
          'Straight Lines',
          'Circles',
          'Parabolas',
          'Ellipses',
          'Hyperbolas',
        ],
      },
      {
        unit: 'Trigonometry',
        chapters: [
          'Trigonometric Ratios and Identities',
          'Trigonometric Equations',
          'Properties of Triangles',
        ],
      },
      {
        unit: 'Vectors and 3D Geometry',
        chapters: ['Vectors', 'Three-dimensional Geometry'],
      },
      {
        unit: 'Statistics and Probability',
        chapters: ['Measures of Central Tendency and Dispersion', 'Probability'],
      },
    ],
    Physics: [
      {
        unit: 'Mechanics',
        chapters: [
          'Kinematics',
          'Laws of Motion',
          'Work, Energy and Power',
          'Rotational Motion',
          'Gravitation',
        ],
      },
      {
        unit: 'Thermodynamics',
        chapters: [
          'Thermal Properties of Matter',
          'Thermodynamics',
          'Kinetic Theory of Gases',
        ],
      },
      {
        unit: 'Electrodynamics',
        chapters: [
          'Electrostatics',
          'Current Electricity',
          'Magnetism',
          'Electromagnetic Induction',
          'Alternating Current',
        ],
      },
      {
        unit: 'Optics',
        chapters: ['Ray Optics', 'Wave Optics'],
      },
      {
        unit: 'Modern Physics',
        chapters: [
          'Dual Nature of Matter and Radiation',
          'Atoms and Nuclei',
          'Electronic Devices',
        ],
      },
    ],
    Chemistry: [
      {
        unit: 'Physical Chemistry',
        chapters: [
          'Some Basic Concepts in Chemistry',
          'States of Matter',
          'Atomic Structure',
          'Chemical Bonding and Molecular Structure',
          'Thermodynamics',
          'Equilibrium',
          'Redox Reactions',
          'Electrochemistry',
          'Chemical Kinetics',
          'Surface Chemistry',
        ],
      },
      {
        unit: 'Inorganic Chemistry',
        chapters: [
          'Periodic Table and Periodicity in Properties',
          'Chemical Bonding and Molecular Structure',
          'Coordination Compounds',
          'Environmental Chemistry',
          'General Principles and Processes of Isolation of Metals',
          'Hydrogen',
          's-Block Elements',
          'p-Block Elements',
          'd- and f-Block Elements',
        ],
      },
      {
        unit: 'Organic Chemistry',
        chapters: [
          'Basic Principles of Organic Chemistry',
          'Hydrocarbons',
          'Haloalkanes and Haloarenes',
          'Alcohols, Phenols and Ethers',
          'Aldehydes, Ketones and Carboxylic Acids',
          'Organic Compounds Containing Nitrogen',
          'Biomolecules',
          'Polymers',
          'Chemistry in Everyday Life',
        ],
      },
    ],
  };
  

  // Listen for auth state changes
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
        
        // Check if subjects field exists, if not initialize it
        if (!userData.subjects) {
          const initialSubjects = {
            Math: [],
            Physics: [],
            Chemistry: [],
          };
          
          // Update the user document with the new subjects field
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

  const isChapterDone = (subject, unit, chapter) => {
    if (!userData?.subjects?.[subject]) return false;
    
    const unitData = userData.subjects[subject].find(u => u.unit === unit);
    return unitData?.chaptersDone?.includes(chapter) || false;
  };

  const calculateUnitProgress = (subject, unit) => {
    if (!userData?.subjects?.[subject]) return 0;
    
    const unitData = userData.subjects[subject].find(u => u.unit === unit);
    if (!unitData?.chaptersDone) return 0;
    
    const totalChapters = subjects[subject].find(u => u.unit === unit).chapters.length;
    return (unitData.chaptersDone.length / totalChapters) * 100;
  };

  const handleChapterToggle = async (subject, unit, chapter, isChecked) => {
    if (!currentUser) {
      console.error("No user logged in");
      return;
    }

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSubjects = { ...userData.subjects };

      // Initialize subject array if it doesn't exist
      if (!userSubjects[subject]) {
        userSubjects[subject] = [];
      }

      // Find or initialize unit in user's subjects
      let unitIndex = userSubjects[subject].findIndex(u => u.unit === unit);

      if (unitIndex === -1) {
        // Unit doesn't exist, create it
        userSubjects[subject].push({
          unit,
          chaptersDone: isChecked ? [chapter] : []
        });
      } else {
        // Unit exists, update chapters
        let chaptersDone = userSubjects[subject][unitIndex].chaptersDone || [];
        
        if (isChecked && !chaptersDone.includes(chapter)) {
          chaptersDone.push(chapter);
        } else if (!isChecked) {
          chaptersDone = chaptersDone.filter(ch => ch !== chapter);
        }
        
        userSubjects[subject][unitIndex].chaptersDone = chaptersDone;
      }

      // Update Firestore
      await updateDoc(userRef, {
        subjects: userSubjects
      });

      // Update local state
      setUserData({
        ...userData,
        subjects: userSubjects
      });
    } catch (error) {
      console.error("Error updating chapter status:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!currentUser) {
    return <div className="error">Please log in to access the tracker.</div>;
  }

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
              {unit.chapters.map((chapter, chapterIndex) => (
                <div key={chapterIndex} className="tracker-chapter">
                  <input
                    type="checkbox"
                    id={`${chapter}-${unitIndex}`}
                    className="tracker-checkbox"
                    checked={isChapterDone(activeTab, unit.unit, chapter)}
                    onChange={(e) => handleChapterToggle(activeTab, unit.unit, chapter, e.target.checked)}
                  />
                  <label
                    htmlFor={`${chapter}-${unitIndex}`}
                    className="tracker-label"
                  >
                    {chapter}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackerPage;