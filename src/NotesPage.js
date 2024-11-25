import React, { useState, useEffect } from "react";
import { db, auth } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Lock, Unlock, FileText, ExternalLink } from "lucide-react";
import "./NotesPage.css";

const NotesCard = ({ chapter, isLocked, notesUrl }) => {
  return (
    <div className={`notes-card ${isLocked ? 'locked' : 'unlocked'}`}>
      <div className="notes-card-header">
        <FileText className="notes-icon" size={24} />
        <h3>{chapter}</h3>
        {isLocked ? (
          <Lock className="lock-icon" size={20} />
        ) : (
          <Unlock className="lock-icon" size={20} />
        )}
      </div>
      <div className="notes-card-content">
        <p>{isLocked ? "Complete previous chapters to unlock" : "Notes available"}</p>
        {!isLocked && (
          <a href={notesUrl} target="_blank" rel="noopener noreferrer" className="notes-link">
            View Notes
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </div>
  );
};

const NotesPage = () => {
  const [activeTab, setActiveTab] = useState("Math");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Using the same subjects structure from TrackerPage
  const subjects = {
      Chemistry: [
        {
          unit: 'Physical Chemistry',
          chapters: [
            { name: 'Biomolecule', notesUrl: 'https://xmind.ai/share/UDYdC6zc?xid=mMHyU5Ue' },
          ],
        },
        // Add more units as needed
      ],
    Math: [
      {
        unit: 'Algebra',
        chapters: [
          { name: 'Quadratic Equations', notesUrl: 'https://example.com/notes/quadratic' },
          { name: 'Sequences and Series', notesUrl: 'https://example.com/notes/sequences' },
          { name: 'Complex Numbers', notesUrl: 'https://example.com/notes/complex' },
        ],
      },
      // Add more units as needed
    ],
    Physics: [
      {
        unit: 'Mechanics',
        chapters: [
          { name: 'Kinematics', notesUrl: 'https://example.com/notes/kinematics' },
          { name: 'Laws of Motion', notesUrl: 'https://example.com/notes/laws-motion' },
          { name: 'Work, Energy and Power', notesUrl: 'https://example.com/notes/work-energy' },
        ],
      },
      // Add more units as needed
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
        setUserData(userSnap.data());
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  const isChapterLocked = (subject, unit, chapterIndex) => {
    if (!userData?.subjects?.[subject]) return true;
    
    const unitData = userData.subjects[subject].find(u => u.unit === unit);
    if (!unitData?.chaptersDone) return chapterIndex > 0;
    
    // A chapter is unlocked if all previous chapters are done
    for (let i = 0; i < chapterIndex; i++) {
      const prevChapter = subjects[subject]
        .find(u => u.unit === unit)
        .chapters[i].name;
      if (!unitData.chaptersDone.includes(prevChapter)) {
        return true;
      }
    }
    return false;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!currentUser) {
    return <div className="error">Please log in to access the notes.</div>;
  }

  return (
    <div className="notes-page">
      <header className="notes-header">
        <h1>Subject Notes</h1>
      </header>

      <div className="notes-tabs">
        {Object.keys(subjects).map((subject) => (
          <button
            key={subject}
            className={`notes-tab ${activeTab === subject ? "active" : ""}`}
            onClick={() => setActiveTab(subject)}
          >
            {subject}
          </button>
        ))}
      </div>

      <div className="notes-content">
        {subjects[activeTab].map((unit, unitIndex) => (
          <div key={unitIndex} className="notes-unit">
            <h2 className="notes-unit-title">{unit.unit}</h2>
            <div className="notes-grid">
              {unit.chapters.map((chapter, chapterIndex) => (
                <NotesCard
                  key={chapterIndex}
                  chapter={chapter.name}
                  isLocked={isChapterLocked(activeTab, unit.unit, chapterIndex)}
                  notesUrl={chapter.notesUrl}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesPage;