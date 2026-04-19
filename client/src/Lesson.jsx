import React, { useState, useEffect } from 'react';
import './lesson.css'; // Rename if needed
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from './assets/edutrack.jpg';
import LessonForm from './LessonForm'; // Rename this too if needed
import axios from 'axios';

import { useNavigate, useParams } from 'react-router-dom';

const LessonsDashboard = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null); // 🆕 track clicked lesson

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/lessons');
        const sortedLessons = res.data
          .filter((lesson) => !bookId || lesson.book?._id === bookId)
          .sort((a, b) => a.lessonNumber - b.lessonNumber);
        setLessons(sortedLessons);
      } catch (err) {
        console.error('Failed to fetch lessons:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [bookId]);

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar and Header unchanged */}

      <div className="content">
        <div className="content-header">
          <h2 className="bookhead">My Lessons ({lessons.length.toString().padStart(2, '0')})</h2>
          <div className="buttons">
            <button className="new-btn" onClick={() => navigate('/new-book')}>
              <i className="fas fa-plus"></i> New
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading lessons...</p>
        ) : lessons.length === 0 ? (
          <p>No lessons uploaded yet.</p>
        ) : (
          lessons.map((lesson) => (
            <div className="book-list" key={lesson._id}>
              <div
                className="book-item"
                onClick={() => handleLessonClick(lesson)} // 🆕 open modal
                style={{ cursor: 'pointer' }}
              >
                <div className="book-info">
                  <strong>{lesson.title}</strong>
                  <small style={{ color: '#1ad295' }}>
                    • Lesson #{lesson.lessonNumber}
                  </small>
                </div>
                <div>
                  <small>Book: {lesson.book?.title || 'Unknown Book'}</small>
                </div>
                <div className="book-type-date">
                  <span>
                    <i className="fas fa-calendar-alt"></i>{' '}
                    {new Date(lesson.createdAt).toLocaleDateString()}
                  </span>
                  {lesson.file && (
                    <a
                      href={`http://localhost:8000/api/lessons/${lesson._id}/file`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-btn"
                      onClick={(e) => e.stopPropagation()}
                      style={{ marginLeft: '10px' }}
                    >
                      <i className="fas fa-file"></i> View File
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {selectedLesson && (
          <LessonForm
            lesson={selectedLesson}
            onClose={() => setSelectedLesson(null)} // close modal
          />
        )}
      </div>
    </div>
  );
};


export default LessonsDashboard;
