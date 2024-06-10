import "./ApplicantJobs.css";

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { FaStar } from "react-icons/fa";
import "./ApplicantJobs.css";
import axios from "axios";

function ApplicantJobs() {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [favoritedJobs, setFavoritedJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const { user, logoutUser } = useContext(UserContext);

  useEffect(() => {
      console.log('UserContext:', user); // Debugging line to check the user context
      axios.get('http://localhost:4000/jobs/')
          .then(response => {
            // FILTER JOBS BY RECRUITER ID
            //   const filteredJobs = response.data.filter(job => job.recruiterID.toString() === user.userId);
            //   setJobs(filteredJobs);
            // ////////////////////////////

                setJobs(response.data);
          })
          .catch(error => {
              console.log(error);
          });
  }, [user]);

  const handleLogout = () => {
      logoutUser();
      navigate('/');
  };

  const handleFavorite = (job) => {
      setFavoritedJobs((prevFavorites) => {
          if (prevFavorites.includes(job)) {
              return prevFavorites.filter((fav) => fav !== job);
          } else {
              return [job, ...prevFavorites];
          }
      });
  };

  const isFavorited = (job) => favoritedJobs.includes(job);

  const allJobs = jobs.filter(job => !favoritedJobs.includes(job));
  const displayedJobs = [...favoritedJobs, ...allJobs];

  return (
      <div className="dashboard-container">
          <header className="dashboard-header">
              <div className="logo">PERSUITER</div>
              <div className="header-links">
                  <div className="header-link">Postings</div>
                  <div className="header-link">Account</div>
                  <div className="header-link logout-link" onClick={handleLogout}>Logout</div>
              </div>
          </header>
          <div className="dashboard-content">
              <button className="new-job-button">NEW JOB</button>
              <div className="aesthetic-bar"></div>
              <div className="job-listings">
                  <div className="job-list">
                      <div className="job-count">Showing {displayedJobs.length} Jobs</div>
                      {displayedJobs.map((job, index) => (
                          <div
                              key={index}
                              className="job-item"
                              onClick={() => setSelectedJob(job)}
                          >
                              <div className="job-title">{job.title}</div>
                              <div className="job-company">{job.company}</div>
                              <div className="job-location">{job.location}</div>
                              <div className="job-type">{job.type}</div>
                              <div className="job-apply-by">
                                  <strong>Closing Date:</strong> {job.applyBy}
                              </div>
                              <div
                                  className={`favorite-icon ${isFavorited(job) ? 'favorited' : ''}`}
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      handleFavorite(job);
                                  }}
                              >
                                  <FaStar />
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="job-detail">
                      {selectedJob ? (
                          <>
                              <div className="job-detail-header">
                                  <div className="job-detail-title">{selectedJob.title}</div>
                                  <div className="job-detail-actions">
                                      <button className="see-applicants-button">SEE APPLICANTS</button>
                                      <button className="edit-button">EDIT</button>
                                  </div>
                              </div>
                              <div className="job-detail-body">
                                  <div className="job-detail-section">
                                      <strong>Company:</strong> {selectedJob.company}
                                  </div>
                                  <div className="job-detail-section">
                                      <strong>Location:</strong> {selectedJob.location}
                                  </div>
                                  <div className="job-detail-section">
                                      <strong>Type:</strong> {selectedJob.type}
                                  </div>
                                  <div className="job-detail-section">
                                      <strong>Hidden Keywords:</strong> {selectedJob.hiddenKeywords}
                                  </div>
                                  <div className="job-detail-section">
                                      <strong>Description:</strong>
                                      <p>{selectedJob.description}</p>
                                  </div>
                                  <div className="job-detail-section">
                                      <strong>Qualifications:</strong>
                                      <p>{selectedJob.qualifications}</p>
                                  </div>
                              </div>
                          </>
                      ) : (
                          <div className="job-detail-body">
                              <p>Select a job to see the details</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>
  );
}

export default ApplicantJobs;