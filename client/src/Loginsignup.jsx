import React, { useState } from 'react';
import './loginsignup.css';
import './style.css';
import logo from './assets/edutrack.jpg';
import { useNavigate } from 'react-router-dom';


function LoginSignup() {
  const navigate = useNavigate();

  const [activeForm, setActiveForm] = useState('login');

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    last: '',
    email: '',
    password: '',
    confirm: '',
    role: ''
  });

  // Handle input changes
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email.trim(),
          password: loginData.password
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Login successful');

        // Optional: Save token to localStorage if backend returns it
        if (data.token) {
        localStorage.setItem('token', data.token);
        }

        // 🚨 Redirect to dashboard
        navigate('/Books');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed. Server not responding.');
    }
  };


  // Submit Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirm) {
      return alert('Passwords do not match');
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerData.name.trim(),
          last: registerData.last.trim(),
          email: registerData.email.trim(),
          password: registerData.password,
          role: registerData.role
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Registration successful');
        setActiveForm('login');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Register error:', err);
      alert('Registration failed. Server not responding.');
    }
  };

  return (
    <div className="container">
      {/* LOGIN FORM */}
      <div className={`form-box ${activeForm === 'login' ? 'active' : ''}`}>
        <form onSubmit={handleLoginSubmit}>
          <img src={logo} alt="Tech Factors" className="top-image1" width="150" height="70" />
          <h2>Login</h2>

          <label>Email address</label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleLoginChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleLoginChange}
            required
          />

          <button type="submit">Login</button>

          <div style={{ textAlign: 'left', marginTop: '20px' }}>
            <label style={{ fontSize: 'small' }}>
              <input type="checkbox" style={{ marginRight: '6px' }} />
              Remember me
            </label>
          </div>

          <p>
            Don&apos;t have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveForm('register'); }}>
              Register
            </a>
          </p>
        </form>
      </div>

      {/* REGISTER FORM */}
      <div className={`form-box ${activeForm === 'register' ? 'active' : ''}`}>
        <form onSubmit={handleRegisterSubmit}>
          <img src={logo} alt="Tech Factors" className="top-image2" width="150" height="70" />
          <h2>Register</h2>

          <input
            type="text"
            name="name"
            placeholder="First name*"
            value={registerData.name}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="text"
            name="last"
            placeholder="Last name*"
            value={registerData.last}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email*"
            value={registerData.email}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password*"
            value={registerData.password}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="password"
            name="confirm"
            placeholder="Confirm password*"
            value={registerData.confirm}
            onChange={handleRegisterChange}
            required
          />

          <select
            name="role"
            value={registerData.role}
            onChange={handleRegisterChange}
            required
          >
            <option value="">Select Role*</option>
            <option value="author">Author</option>
            <option value="editor">Editor</option>
            <option value="artist">Artist</option>
            <option value="qa">QA</option>
            <option value="head">Head</option>
          </select>

          <button type="submit">Register</button>

          <p>
            Already have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveForm('login'); }}>
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginSignup;
