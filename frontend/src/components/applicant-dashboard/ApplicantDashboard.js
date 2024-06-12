import "./ApplicantDashboard.css";

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { FaStar } from "react-icons/fa";
import axios from "axios";

function ApplicantDashboard() {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [favoritedJobs, setFavoritedJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const { user, logoutUser } = useContext(UserContext);

  useEffect(() => {
    const fetchFavoritedJobs = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/favorites/${user.userId}`);
            setFavoritedJobs(response.data);
        } catch (error) {
            console.error("Error fetching favorited jobs:", error);
        }
    };

    if (user) {
        fetchFavoritedJobs();
        axios.get('http://localhost:4000/jobs/')
            .then(response => {
                setJobs(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }
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

    const handleFavorite = async (job) => {
        try {
            const isFav = isFavorited(job);
            const url = isFav ? 'http://localhost:4000/favorites/remove' : 'http://localhost:4000/favorites/add';
            const payload = { userId: user.userId, jobId: job._id };
    
            await axios.post(url, payload);
    
            setFavoritedJobs((prevFavorites) => {
                if (isFav) {
                    return prevFavorites.filter((fav) => fav._id !== job._id);
                } else {
                    return [job, ...prevFavorites];
                }
            });
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };
    

  const isFavorited = (job) => favoritedJobs.includes(job);

  const allJobs = jobs.filter(job => !favoritedJobs.some(fav => fav._id === job._id));
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
                  <div className="header-link">Jobs</div>
                  <div className="header-link" onClick={() => navigate("/applicant-information")}>ACCOUNT</div>
                  <div className="header-link" onClick={handleLogout}>LOGOUT</div>
              </div>
          </header>
          <div className="dashboard-content">
                <h2 className="page-title">Job Listings</h2>

                <div className="search-container">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by: role, keywords, company...."
                            className="search-bar-input"
                        />
                    </div>
                    <div className="location-bar">
                        <input
                            type="text"
                            placeholder="Location or 'remote'"
                            className="location-bar-input"
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
              
              <div className="aesthetics-bar"></div>
              <div className="jobs-listings">
                  <div className="jobs-list">
                      <div className="num-jobs">Showing {displayedJobs.length} Jobs</div>
                      {displayedJobs.map((job, index) => (
                          <div
                              key={index}
                              className="job-item"
                              onClick={() => setSelectedJob(job)}>
                              <div className="job-title">{job.title}</div>
                              <div className="job-company">{job.company}</div>
                              <div className="job-location">{job.location}</div>
                              <div className="job-type">{job.type}</div>
                              <div className="job-apply-date">
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
                  <div className="jobs-details">
                      {selectedJob ? (
                          <>
                              <div className="jobs-details-header">
                                  <div className="jobs-details-title">{selectedJob.title}</div>
                                  <div className="jobs-details-actions">
                                  <button className="apply-button" onClick={handleApply}>APPLY</button>
                                  </div>
                              </div>
                              <div className="jobs-details-body">
                                  <div className="jobs-details-section-top-company">
                                      <strong>Company: &nbsp; </strong> {selectedJob.company}
                                  </div>
                                  <div className="jobs-details-section-top">
                                      <strong>Location: &nbsp; </strong> {selectedJob.location}
                                  </div>
                                  <div className="jobs-details-section-top">
                                      <strong>Type: &nbsp; </strong> {selectedJob.type}
                                  </div>
                                  <div className="jobs-details-section">
                                      <strong>Description:  </strong> {selectedJob.description}
                                  </div>
                                  <div className="jobs-details-section">
                                      <strong>Qualifications: </strong> {selectedJob.qualifications}
                                  </div>
                              </div>
                          </>
                      ) : (
                          <div className="jobs-details-body">
                              <p>Select a job to see the details</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>
  );
}

export default ApplicantDashboard;