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

    const handleApply = async () => {
        const application = {
            jobID: selectedJob._id, // Assuming the job object has an _id field
            userID: user._id, // Assuming you have a user object with an _id field
        };

        try {
            const response = await axios.post('http://localhost:4000/applications/', application);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
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
        <head>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
        </head>
          <header className="dashboard-header">
              <div className="logo-container">  
                    <img src="https://via.placeholder.com/20" alt="logo" className="logo-image" />
                    <div className="logo">PERSUITER</div>
              </div>
              
              <div className="header-links">
                  <div className="header-link">Postings</div>
                  <div className="header-link">ACCOUNT</div>
              </div>
          </header>
          <div className="dashboard-content">
                <h2 className="page-title">Job Listings</h2>

                <div className="search-container">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by: role, keywords, company...."
                            className="search-input"
                        />
                    </div>
                    <div className="location-bar">
                        <input
                            type="text"
                            placeholder="Location or 'remote'"
                            className="location-input"
                        />
                    </div>
                </div>

                <div className="filter-container">
                    <div className="filter-bar">
                        <div class="dropdown">
                            <button class="dropbtn">Position 
                                <i class="fa fa-caret-down"></i>
                            </button>
                            <div class="dropdown-content">
                                <a href="#">Link 1</a>
                                <a href="#">Link 2</a>
                                <a href="#">Link 3</a>
                            </div>
                        </div> 
                        <div class="dropdown">
                            <button class="dropbtn">Company 
                                <i class="fa fa-caret-down"></i>
                            </button>
                            <div class="dropdown-content">
                                <a href="#">Link 1</a>
                                <a href="#">Link 2</a>
                                <a href="#">Link 3</a>
                            </div>
                        </div> 
                        <div class="dropdown">
                            <button class="dropbtn">Location 
                                <i class="fa fa-caret-down"></i>
                            </button>
                            <div class="dropdown-content">
                                <a href="#">Link 1</a>
                                <a href="#">Link 2</a>
                                <a href="#">Link 3</a>
                            </div>
                        </div> 
                        <div class="dropdown">
                            <button class="dropbtn">Type 
                                <i class="fa fa-caret-down"></i>
                            </button>
                            <div class="dropdown-content">
                                <a href="#">Link 1</a>
                                <a href="#">Link 2</a>
                                <a href="#">Link 3</a>
                            </div>
                        </div> 
                        <div class="dropdown">
                            <button class="dropbtn">Apply By 
                                <i class="fa fa-caret-down"></i>
                            </button>
                            <div class="dropdown-content">
                                <a href="#">Link 1</a>
                                <a href="#">Link 2</a>
                                <a href="#">Link 3</a>
                            </div>
                        </div> 
                        <button className="search-button">SEARCH</button>
                    </div>
                    
                </div>
              
              <div className="aesthetic-bar"></div>
              <div className="job-listings">
                  <div className="job-list">
                      <div className="job-count">Showing {displayedJobs.length} Jobs</div>
                      {displayedJobs.map((job, index) => (
                          <div
                              key={index}
                              className="job-item"
                              onClick={() => setSelectedJob(job)}>
                              <div className="job-title">{job.title}</div>
                              <div className="job-company">{job.company}</div>
                              <div className="job-location">{job.location}</div>
                              <div className="job-type">{job.type}</div>
                              <div className="job-apply-by">
                                  <strong>Due:</strong> {job.applyBy}
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
                                  <button className="apply-button" onClick={handleApply}>APPLY</button>
                                  </div>
                              </div>
                              <div className="job-detail-body">
                                  <div className="job-detail-section-top-company">
                                      <strong>Company: &nbsp; </strong> {selectedJob.company}
                                  </div>
                                  <div className="job-detail-section-top">
                                      <strong>Location: &nbsp; </strong> {selectedJob.location}
                                  </div>
                                  <div className="job-detail-section-top">
                                      <strong>Type: &nbsp; </strong> {selectedJob.type}
                                  </div>
                                  <div className="job-detail-section">
                                      <strong>Description:  </strong> {selectedJob.description}
                                  </div>
                                  <div className="job-detail-section">
                                      <strong>Qualifications: </strong> {selectedJob.qualifications}
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