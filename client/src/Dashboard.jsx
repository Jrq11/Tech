import React, { useEffect, useRef } from 'react';
import './dashboard.css';
import Chart from 'chart.js/auto';
import logo from './assets/techfactors.jpeg';
import './style.css';

const Dashboard = () => {
  const chartRef = useRef(null); // Chart instance reference

  useEffect(() => {
    const ctx1 = document.getElementById('statusChart')?.getContext('2d');

    if (ctx1) {
      // 🔥 Destroy old chart if it exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      // ✅ Create new chart and assign to ref
      chartRef.current = new Chart(ctx1, {
        type: 'pie',
        data: {
          labels: ['On Progress', 'On Hold', 'Approved', 'Pending'],
          datasets: [
            {
              data: [40, 25, 25, 10],
              backgroundColor: ['#3366cc', '#dc3912', '#109618', '#ff9900'],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
            },
          },
        },
      });
    }

    // Cleanup chart on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <img src="img/techfactors.jpeg" alt="Tech Factors" className="top-image" />
        <a href="dashboard.html"><button>Overview</button></a>
        <a href="books&lesson.html"><button>Books & Lessons</button></a>
        <a href="q&a.html"><button>QA/Approval</button></a>

        <select name="department" required>
          <option value="">Department</option>
          <option value="user">K-10</option>
          <option value="user">SHS</option>
          <option value="admin">2TECH</option>
        </select>

        <a href="login&register.html">
          <button className="logout">Logout</button>
        </a>
      </div>

      {/* Main Content */}
      <div className="main">
        <div className="header">
          <div className="search-bar">
            <input type="text" placeholder="Search for anything..." />
          </div>
          <div className="user-info">
            <i className="fas fa-bell"></i>
            <span>Juan Dela Cruz | Author</span>
            <img src="https://via.placeholder.com/30" alt="profile" />
          </div>
        </div>

        <div className="content">
          {/* Left Section */}
          <div className="left">
            <div className="table-section">
              <table>
                <thead>
                  <tr className="bookTable">
                    <th>Book</th>
                    <th>Lesson</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>THPY.25.4.1</td>
                    <td>Python Programming</td>
                    <td>07.05.2025</td>
                    <td className="status approved">Approved</td>
                  </tr>
                  <tr>
                    <td>THPY.25.4.1</td>
                    <td>Python Programming</td>
                    <td>07.11.2025</td>
                    <td className="status progress">On progress</td>
                  </tr>
                  <tr>
                    <td>THPY.25.4.1</td>
                    <td>Python Programming</td>
                    <td>07.15.2025</td>
                    <td className="status hold">On Hold</td>
                  </tr>
                  <tr>
                    <td>THPY.25.4.1</td>
                    <td>Python Programming</td>
                    <td>07.20.2025</td>
                    <td className="status hold">On Hold</td>
                  </tr>
                  <tr>
                    <td>THPY.25.4.1</td>
                    <td>Python Programming</td>
                    <td>07.25.2025</td>
                    <td className="status pending">Pending</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="projects-section">
              <h3>Projects</h3>
              <div className="projects-grid">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="project-card">{`Book${i} - ${['K10', 'SHS', 'K10', '2Tech', 'SHS', '2Tech'][i - 1]}`}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="right">
            <div className="chart">
              <h3>Chart</h3>
              <select className="pWeek">
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
              <canvas id="statusChart" width="100" height="100"></canvas>
            </div>

            <div className="calendar">
              <div className="calendar-header">
                <button id="prev-month">&lt;</button>
                <h2 id="month-year"></h2>
                <button id="next-month">&gt;</button>
                <button className="add-btn">+ Add Event</button>
              </div>
              <div className="calendar-weekdays">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>
              <div className="calendar-days" id="calendar-days"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
