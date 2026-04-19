import React, { useRef, useEffect, useState } from 'react';
import './bookform.css';

const BookForm = ({ onClose }) => {
  const modalRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    bookcode: '',
    date: '',
    edition: '',
    units: '',
    lesson: '',
    description: '',
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Book saved successfully!");
        console.log(result);
        setFormData({
          title: '',
          bookcode: '',
          date: '',
          edition: '',
          units: '',
          lesson: '',
          description: '',
        });
        onClose();
      } else {
        alert("Failed: " + result.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="notif-modal">
      <div className="notif-content" ref={modalRef}>
        <h3>New Book</h3>
        <form id="newLessonForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Book Title:</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Book Code:</label>
            <input
              type="text"
              name="bookcode"
              required
              value={formData.bookcode}
              onChange={(e) => setFormData({ ...formData, bookcode: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              required
              value={formData.copyright}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Edition No:</label>
            <input
              type="text"
              name="edition"
              required
              value={formData.edition}
              onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>No. of Units:</label>
            <input
              type="text"
              name="units"
              required
              value={formData.units}
              onChange={(e) => setFormData({ ...formData, units: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>No. of Lessons:</label>
            <input
              type="text"
              name="lesson"
              required
              value={formData.lesson}
              onChange={(e) => setFormData({ ...formData, lesson: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              required
              rows="4"
              style={{
                fontSize: '14px',
                padding: '10px',
                width: '90%',
                height: '90px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                resize: 'none',
                background: 'white',
                outline: 'none',
              }}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="button-group">
            <button type="submit" className="upload-btn">Save</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
