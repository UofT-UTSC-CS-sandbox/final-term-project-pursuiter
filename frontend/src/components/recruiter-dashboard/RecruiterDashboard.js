import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../contexts/UserContext";
import { FaStar } from 'react-icons/fa';
import './RecruiterDashboard.css';
import axios from 'axios';
import Modal from './Modal';

function RecruiterDashboard() {
    const navigate = useNavigate();
    const [selectedJob, setSelectedJob] = useState(null);
    const [favoritedJobs, setFavoritedJobs] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [showJobForm, setShowJobForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [newJob, setNewJob] = useState({
        title: '',
        company: '',
        location: '',
        type: '',
        applyBy: '',
        hiddenKeywords: '',
        description: '',
        qualifications: '',
        recruiterID: ''
    });
    const { user, logoutUser } = useContext(UserContext);

    useEffect(() => {
        console.log('UserContext:', user);
        axios.get('http://localhost:4000/jobs/')
            .then(response => {
                const filteredJobs = response.data.filter(job => job.recruiterID.toString() === user.userId);
                setJobs(filteredJobs);
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

    const handleJobInputChange = (e) => {
        const { name, value } = e.target;
        setNewJob(prevJob => ({
            ...prevJob,
            [name]: value
        }));
    };

    const handleJobSubmit = async (e) => {
        e.preventDefault();
        const jobToSubmit = { ...newJob, recruiterID: user.userId };
    
        try {
            if (editMode) {
                const response = await axios.put(`http://localhost:4000/jobs/${selectedJob._id}`, jobToSubmit);
                setJobs(prevJobs => prevJobs.map(job => job._id === selectedJob._id ? response.data.job : job));
                setEditMode(false);
                setSelectedJob(null);
                window.location.reload();
            } else {
                const response = await axios.post('http://localhost:4000/jobs/add', jobToSubmit);
                setJobs(prevJobs => [response.data, ...prevJobs]);
            }
    
            setNewJob({
                title: '',
                company: '',
                location: '',
                type: '',
                applyBy: '',
                hiddenKeywords: '',
                description: '',
                qualifications: '',
                recruiterID: ''
            });
            setShowJobForm(false);
            window.location.reload();
        } catch (error) {
            console.error('Error submitting job:', error);
        }
    };
    

    const handleEdit = (job) => {
        setNewJob({
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.type,
            applyBy: job.applyBy,
            hiddenKeywords: job.hiddenKeywords,
            description: job.description,
            qualifications: job.qualifications,
            recruiterID: job.recruiterID
        });
        setSelectedJob(job);
        setEditMode(true);
        setShowJobForm(true);
    };

    const handleDelete = async (jobId) => {
        try {
          const response = await axios.delete(
            `http://localhost:4000/jobs/${jobId}`,
          );
          if (response.status === 200) {
            console.log(response.data.message);
            setJobs(jobs.filter((job) => job._id !== jobId));
            setSelectedJob(null);
          } else {
            console.error(response.data.message);
          }
        } catch (error) {
          console.error("Error deleting job:", error);
        }
      };

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
                <button className="new-job-button" onClick={() => setShowJobForm(true)}>NEW JOB</button> {/* Show modal on click */}
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
                                        <button className="edit-button" onClick={() => handleEdit(selectedJob)}>EDIT</button>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(selectedJob._id)}
                                            >
                                            DELETE
                                        </button>
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
            <Modal show={showJobForm} onClose={() => setShowJobForm(false)}> {/* Modal component */}
                <form className="new-job-form" onSubmit={handleJobSubmit}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Job Title"
                        value={newJob.title}
                        onChange={handleJobInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="company"
                        placeholder="Company"
                        value={newJob.company}
                        onChange={handleJobInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={newJob.location}
                        onChange={handleJobInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="type"
                        placeholder="Job Type"
                        value={newJob.type}
                        onChange={handleJobInputChange}
                        required
                    />
                    <input
                        type="date"
                        name="applyBy"
                        placeholder="Apply By"
                        value={newJob.applyBy}
                        onChange={handleJobInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="hiddenKeywords"
                        placeholder="Hidden Keywords"
                        value={newJob.hiddenKeywords}
                        onChange={handleJobInputChange}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Job Description"
                        value={newJob.description}
                        onChange={handleJobInputChange}
                        required
                    ></textarea>
                    <textarea
                        name="qualifications"
                        placeholder="Qualifications"
                        value={newJob.qualifications}
                        onChange={handleJobInputChange}
                        required
                    ></textarea>
                    <button type="submit">{editMode ? 'Update Job' : 'Submit'}</button>
                    <button type="button" onClick={() => setShowJobForm(false)}>Cancel</button>
                </form>
            </Modal>
        </div>
    );
}

export default RecruiterDashboard;