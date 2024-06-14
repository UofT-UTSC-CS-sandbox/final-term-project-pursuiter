import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import DashboardController from "../../controllers/DashboardController";
import "./Dashboard.css";
import { FaStar } from "react-icons/fa";

function ApplicantList() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobDetails, setJobDetails] = useState({});
  const [favoritedApplicants, setFavoritedApplicants] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const { user, logoutUser } = useContext(UserContext);

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  // Fetch applicants and job details
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await DashboardController.fetchApplicants(jobId);
        setApplicants(response);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    const fetchJobDetails = async () => {
      try {
        const response = await DashboardController.fetchJobDetails(jobId);
        setJobDetails(response);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchApplicants();
    fetchJobDetails();
  }, [jobId]);

  // Handle favorite
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

  const filteredApplicants = applicants.filter((applicant) =>
    applicant.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle select applicant
  const handleSelectApplicant = (applicant) => {
    setSelectedApplicant(applicant);
    setSelectedResume(applicant.resumeData);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo-container">
          <img
            src="https://via.placeholder.com/20"
            alt="logo"
            className="logo-image"
          />
          <div className="logo">PERSUITER</div>
        </div>
        <div className="header-links">
          <div
            className="header-link"
            onClick={() => navigate("/recruiter-dashboard")}
          >
            Dashboard
          </div>
          <div className="header-link logout-link" onClick={handleLogout}>
            Logout
          </div>
        </div>
      </header>
      <div className="dashboard-content">
        <div className="aesthetic-bar"></div>
        <div className="job-details">
          <div className="dashboard-detail-section">
            <strong>Job Title:</strong> {jobDetails.title || "Loading..."}
          </div>
          <div className="dashboard-detail-section">
            <strong>Company:</strong> {jobDetails.company || user.companyName}
          </div>
          <div className="dashboard-detail-section">
            <strong>Location:</strong> {jobDetails.location || "Loading..."}
          </div>
          <div className="dashboard-detail-section">
            <strong>Type:</strong> {jobDetails.type || "Loading..."}
          </div>
        </div>
        <div className="aesthetic-bar"></div>
        <div className="search-and-filters">
          <div className="search">
            <input
              type="text"
              className="search-input"
              placeholder="Search by experience, keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">SEARCH</button>
          </div>
          <div className="filter-buttons">
            <p>Filter by:</p>
            <button className="filter-button">Experience</button>
            <button className="filter-button">Education</button>
            <button className="filter-button">Keywords</button>
            <button className="filter-button">Skills</button>
          </div>
        </div>
        <div className="dashboard-listings">
          <div className="dashboard-list">
            <div className="dashboard-count">
              Showing {filteredApplicants.length} Applicants
            </div>
            {filteredApplicants.length > 0 ? (
              filteredApplicants.map((applicant, index) => (
                <div
                  key={index}
                  className="dashboard-item"
                  onClick={() => handleSelectApplicant(applicant)}
                >
                  <div className="dashboard-title">{applicant.fullName}</div>
                  <div className="dashboard-company">{applicant.email}</div>
                  <div className="dashboard-apply-by">
                    <strong>Applied On:</strong> {applicant.applyDate}
                  </div>
                  <div
                    className={`favorite-icon ${isFavorited(applicant) ? "favorited" : ""}`}
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
              <div className="no-applicants">
                No applicants found for this job.
              </div>
            )}
          </div>
          <div className="dashboard-detail">
            {selectedApplicant ? (
              <>
                <div className="dashboard-detail-header">
                  <div className="dashboard-detail-title">
                    {selectedApplicant.fullName}
                  </div>
                </div>
                <div className="dashboard-detail-body">
                  <div className="dashboard-detail-section">
                    <strong>Email:</strong> {selectedApplicant.email}
                  </div>
                  <div className="dashboard-detail-section">
                    <strong>AI Generated Compatibility:</strong>
                    <p>To be implemented in another feature</p>
                  </div>
                  <div className="dashboard-detail-section">
                    <strong>AI Generated Summary:</strong>
                    <p>To be implemented in another feature</p>
                  </div>
                  <div className="dashboard-detail-section">
                    <strong>Status:</strong>
                    <p>To be implemented in another feature</p>
                  </div>
                  <div className="dashboard-detail-section">
                    <strong>Resume:</strong>
                    {selectedResume ? (
                      <iframe
                        src={selectedResume}
                        className="resume-iframe"
                        title="Resume"
                      ></iframe>
                    ) : (
                      "Resume not available"
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="dashboard-detail-body">
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
