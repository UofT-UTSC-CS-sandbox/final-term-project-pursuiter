import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from "../../contexts/UserContext";
import './ApplicantList.css';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';

function ApplicantList() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [jobDetails, setJobDetails] = useState({});
    const [favoritedApplicants, setFavoritedApplicants] = useState([]);
    const { user, logoutUser } = useContext(UserContext);

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    useEffect(() => {
        const fetchApplicants = async () => {
            console.log(`Fetching applicants for jobId: ${jobId}`); // Log the jobId
    
            try {
                const response = await axios.get(`http://localhost:4000/applications/${jobId}`);
                console.log('Applicants fetched:', response.data); // Log the fetched applicants
                setApplicants(response.data);
            } catch (error) {
                console.error('Error fetching applicants:', error);
            }
        };
    
        const fetchJobDetails = async () => {
            console.log(`Fetching job details for jobId: ${jobId}`); // Log the jobId
    
            try {
                const response = await axios.get('http://localhost:4000/jobs');
                const job = response.data.find(job => job._id === jobId);
                console.log('Job details:', job); // Log the job details
                setJobDetails(job);
            } catch (error) {
                console.error('Error fetching job details:', error);
            }
        };
    
        fetchApplicants();
        fetchJobDetails();
    }, [jobId]);

    const handleFavorite = (applicant) => {
        setFavoritedApplicants((prevFavorites) => {
            if (prevFavorites.includes(applicant)) {
                return prevFavorites.filter((fav) => fav !== applicant);
            } else {
                return [applicant, ...prevFavorites];
            }
        });
    };

    const isFavorited = (applicant) => favoritedApplicants.includes(applicant);

    const filteredApplicants = applicants.filter(applicant =>
        applicant.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // function displayPDFFromDatabase(fileData) {
    //     const reader = new FileReader();
    //     let substringData = fileData;
    //     reader.onload = function(event) {
    //         const fileData = event.target.result; // This should be a string
    //         if (typeof fileData === 'string') {
    //             substringData = fileData.substring(28);
    //             console.log(substringData);
    //         } else {
    //             console.error('fileData is not a string');
    //         }
    //     };
    //     // change substringData to a blob:
    //     const blob = new Blob([substringData], { type: 'application/pdf' });
    //     const url = URL.createObjectURL(blob);
    //     // window.open(url);

    //     reader.readAsText(blob);
    
    //   }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="logo">PERSUITER</div>
                <div className="header-links">
                    <div className="header-link" onClick={() => navigate('/recruiter-dashboard')}>Dashboard</div>
                    <div className="header-link logout-link" onClick={handleLogout}>Logout</div>
                </div>
            </header>
            <div className="dashboard-content">
                <div className="aesthetic-bar"></div>
                <div className="job-details">
                    {console.log('Job Details:', jobDetails)} {/* Debugging line to check the job details */}
                    <div className="job-detail-section">
                        <strong>Job Title:</strong> {jobDetails.title || 'Loading...'}
                    </div>
                    <div className="job-detail-section">
                        <strong>Company:</strong> {jobDetails.company || user.companyName}
                    </div>
                    <div className="job-detail-section">
                        <strong>Location:</strong> {jobDetails.location || 'Loading...'}
                    </div>
                    <div className="job-detail-section">
                        <strong>Type:</strong> {jobDetails.type || 'Loading...'}
                    </div>
                </div>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by experience, keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="filter-buttons">
                    <button className="filter-button">Experience</button>
                    <button className="filter-button">Education</button>
                    <button className="filter-button">Keywords</button>
                    <button className="filter-button">Skills</button>
                    <button className="search-button">SEARCH</button>
                </div>
                <div className="aesthetic-bar"></div>
                <div className="job-listings">
                    <div className="job-list">
                        <div className="job-count">Showing {filteredApplicants.length} Applicants</div>
                        {filteredApplicants.length > 0 ? (
                            filteredApplicants.map((applicant, index) => (
                                <div
                                    key={index}
                                    className="applicant-item"
                                    onClick={() => setSelectedApplicant(applicant)}
                                >
                                    <div>
                                        <div className="applicant-name">{applicant.fullName}</div>
                                        <div className="applicant-email">{applicant.email}</div>
                                        <div className="applicant-apply-date"><strong>Applied On:</strong> {applicant.applyDate}</div>
                                    </div>
                                    <div
                                        className={`favorite-icon ${isFavorited(applicant) ? 'favorited' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleFavorite(applicant);
                                        }}
                                    >
                                        <FaStar />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-applicants">No applicants found for this job.</div>
                        )}
                    </div>
                    <div className="applicant-detail">
                        {selectedApplicant ? (
                            <>
                                <div className="applicant-detail-header">
                                    <div className="applicant-detail-title">{selectedApplicant.fullName}</div>
                                </div>
                                <div className="applicant-detail-body">
                                    <div className="applicant-detail-section">
                                        <strong>Email:</strong> {selectedApplicant.email}
                                    </div>
                                    <div className="applicant-detail-section">
                                        <strong>Ai Generated Compatibility:</strong>
                                        <p>To be implemented in another feature</p>
                                    </div>
                                    <div className="applicant-detail-section">
                                        <strong>Ai Generated Summary:</strong>
                                        <p>To be implemented in another feature</p>
                                    </div>
                                    <div className="applicant-detail-section">
                                        <strong>Resume:</strong> {selectedApplicant.resume || 'Not available'}
                                    </div>
                                    <div className="applicant-detail-section">
                                        <strong>Cover Letter:</strong> {selectedApplicant.coverLetter || 'Not available'}
                                    </div>
                                    <div className="applicant-detail-section">
                                        <strong>Status:</strong>
                                        <p>To be implemented in another feature</p>
                                    </div>
                                    <div className="applicant-detail-section">
                                        {/* <strong>Resume:</strong> {displayPDFFromDatabase(selectedApplicant.resumeData) || 'Not available'} */}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="applicant-detail-body">
                                <p>Select an applicant to see the details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApplicantList;
