import React, { useRef, useEffect, useState } from 'react';
import './bookform.css';

const LessonForm = ({ onClose, lesson }) => {
  const modalRef = useRef(null);

  const [formData, setFormData] = useState({
    title: lesson?.title || '',
    bookcode: lesson?.book?.bookcode || '',
    date: lesson?.createdAt ? lesson.createdAt.substring(0, 10) : '',
    edition: lesson?.book?.edition || '',
    units: lesson?.book?.units || '',
    lessonNumber: lesson?.lessonNumber || '',
    description: lesson?.book?.description || '',
  });

  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleFileUpload = async () => {
    if (!file || !lesson?._id) return alert("Please select a file.");

    const uploadForm = new FormData();
    uploadForm.append('file', file);

    try {
      setUploading(true);
      const res = await fetch(`http://localhost:8000/api/lessons/${lesson._id}/upload`, {
        method: 'PUT',
        body: uploadForm,
      });

      const result = await res.json();
      if (res.ok) {
        alert('File uploaded successfully!');
        onClose();
      } else {
        alert('Upload failed: ' + result.message);
      }
    } catch (err) {
      alert('Error uploading file: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="notif-modal">
      <div className="notif-content" ref={modalRef}>
        <h3>Upload Lesson File</h3>
        <form onSubmit={(e) => { e.preventDefault(); handleFileUpload(); }}>
          {[
            { label: 'Book Title:', name: 'title' },
            { label: 'Book Code:', name: 'bookcode' },
            { label: 'Edition No:', name: 'edition' },
            { label: 'No. of Units:', name: 'units' },
            { label: 'Lesson #:', name: 'lessonNumber' },
            { label: 'Date:', name: 'date', type: 'date' },
          ].map(({ label, name, type }) => (
            <div className="form-group" key={name}>
              <label>{label}</label>
              <input
                type={type || 'text'}
                name={name}
                value={formData[name]}
                readOnly
              />
            </div>
          ))}

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              readOnly
              rows="4"
              style={{
                fontSize: '14px',
                padding: '10px',
                width: '90%',
                height: '90px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                resize: 'none',
                background: '#f8f8f8',
                outline: 'none',
              }}
            />
          </div>

          <div className="form-group">
            <label>Upload File:</label>
            <input type="file" required onChange={(e) => setFile(e.target.files[0])} />
          </div>

          <div className="button-group">
            <button type="submit" className="upload-btn" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonForm;
