import React, { useState, useEffect } from 'react';
import './Books.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from './assets/edutrack.jpg';
import { useNavigate } from 'react-router-dom';
import BookForm from './bookform';
import axios from 'axios';

const MyBooksDashboard = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/books');
      const sortedBooks = res.data.sort((a, b) => a.title.localeCompare(b.title));
      setBooks(sortedBooks);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchBooks();
}, []);


  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img src={logo} alt="Tech Factors" className="top-image" width="160" height="90" />
        <a href="dashboard.html"><button>Overview</button></a>
        <a href="books&lesson.html"><button>Books & Lessons</button></a>
        <a href="q&a.html"><button>QA/Approval</button></a>
        <select name="department" required>
          <option value="">Department</option>
          <option value="user">K-10</option>
          <option value="user">SHS</option>
          <option value="admin">2TECH</option>
        </select>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </div>

      <div className="main">
        <div className="header">
          <div className="search-bar">
            <input type="text" placeholder="Search for anything..." />
          </div>
          <div className="user-info">
            <i className="fas fa-bell"></i>
            <span>Juan Dela Cruz | Author</span>
            <img src="https://via.placeholder.com/30" alt="profile" style={{ borderRadius: '50%' }} />
          </div>
        </div>

        <div className="content">
          <div className="content-header">
            <h2 className="bookhead">My Books ({books.length.toString().padStart(2, '0')})</h2>
            <div className="buttons">
              <button className="new-btn" onClick={() => setShowForm(true)}>
                <i className="fas fa-plus"></i> New
              </button>
              <button className="trash-btn">
                <i className="fas fa-trash"></i> Trash
              </button>
              <button className="list-btn" onClick={() => window.location.href = 'books&lesson.html'}>
                <i className="fas fa-list"></i> List
              </button>
              <button className="board-btn" onClick={() => window.location.href = 'b&lboard.html'}>
                <i className="fas fa-th"></i> Board
              </button>
            </div>
          </div>

          {loading ? (
            <p>Loading books...</p>
          ) : books.length === 0 ? (
            <p>No books uploaded yet.</p>
          ) : (
            books.map((book, index) => (
             <div className="book-list" key={index}>
  <div
    className="book-item"
    onClick={() => navigate(`/Books/${book._id}`)}
    style={{ cursor: 'pointer' }}
  >
    <div className="book-info">
      <strong>{book.title}</strong>
      <small style={{ color: '#1ad295' }}>• {book.lesson || 0} Lessons</small>
    </div>
    <div>
      <small>Lessons approved: 0/{parseInt(book.lesson) || 0}</small>
    </div>
    <div className="book-type-date">
      <span style={{ marginRight: '55px' }}>
        {book.units || '0'} Units
      </span>
      <span>
        <i className="fas fa-calendar-alt"></i>{' '}
        {new Date(book.createdAt).toLocaleDateString()}
      </span>
      <a
        href={`http://localhost:8000/api/files/${book.fileName}`}
        target="_blank"
        rel="noopener noreferrer"
        className="download-btn"
        onClick={(e) => e.stopPropagation()} // prevents click from navigating
        style={{ marginLeft: '10px' }}
      >
      </a>
    </div>
  </div>
</div>

            ))
          )}

          {showForm && <BookForm onClose={() => setShowForm(false)} />}
        </div>
      </div>
    </div>
  );
};

export default MyBooksDashboard;
