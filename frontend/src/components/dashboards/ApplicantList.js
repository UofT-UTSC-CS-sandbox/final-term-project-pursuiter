import React, { useState, useEffect, useContext, useRef } from "react";
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
  const [applicationDetails, setApplicationDetails] = useState(null);
  const { user, logoutUser } = useContext(UserContext);
  const progressBarRef = useRef(null);
  const [status, setStatus] = useState("");
  const [isStatusLoading, setIsStatusLoading] = useState(false);

  // Fetch applicants and job details
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await DashboardController.fetchApplicants(jobId);
        const applicantsWithScores = await Promise.all(
          response.map(async (applicant) => {
            const applicationDetails =
              await DashboardController.fetchApplicationDetails(
                applicant._id,
                jobId,
              );
            return {
              ...applicant,
              totalScore: applicationDetails
                ? applicationDetails.totalScore
                : 0,
              applicantSummary: applicationDetails
                ? applicationDetails.applicantSummary
                : {},
            };
          }),
        );
        applicantsWithScores.sort((a, b) => b.totalScore - a.totalScore);
        setApplicants(applicantsWithScores);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    const fetchJobDetails = async () => {
      try {
        const response = await DashboardController.fetchJobDetails(jobId);
        setJobDetails(response || {});
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
  const handleSelectApplicant = async (applicant) => {
    setSelectedApplicant(applicant);
    setSelectedResume(applicant.resumeData);
    await fetchApplicationDetails(applicant._id, jobId);
  };

  // Fetch application details
  const fetchApplicationDetails = async (applicantId, jobId) => {
    try {
      const response = await DashboardController.fetchApplicationDetails(
        applicantId,
        jobId,
      );
      setApplicationDetails(response);
      setStatus(response.status || "");
    } catch (error) {
      console.error("Error fetching application details:", error);
    }
  };

  // Handle applications status change
  const handleStatusChange = async (newStatus) => {
    if (!selectedApplicant) return;
    setIsStatusLoading(true);
    try {
      await DashboardController.updateApplicationStatus(selectedApplicant._id, jobId, newStatus);
      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating application status:", error);
    } finally {
      setIsStatusLoading(false);
    }
  };  

  // Calculate the width of the bar
  const progressBarWidth = applicationDetails
    ? (applicationDetails.totalScore / 10) * 100
    : 0;

  // Determine the color of the bar
  const getProgressBarColor = (width) => {
    if (width <= 30) {
      return "red";
    } else if (width <= 60) {
      return "orange";
    } else if (width <= 70) {
      return "#ffc34d";
    } else {
      return "green";
    }
  };

  // Determine the color of the score
  const getColorForScore = (score) => {
    if (score === 5) return "green";
    if (score >= 3 && score <= 4) return "#ffc34d";
    if (score === 2) return "orange";
    return "red";
  };

  useEffect(() => {
    if (selectedApplicant && progressBarRef.current) {
      const progressBar = progressBarRef.current;
      setTimeout(() => {
        progressBar.style.width = `${progressBarWidth}%`;
        progressBar.style.backgroundColor =
          getProgressBarColor(progressBarWidth);
      }, 100);
    }
  }, [selectedApplicant, progressBarWidth]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="aesthetic-bar"></div>
        <div className="job-details">
          <div className="dashboard-detail-section job-detail-section">
            <h2>Job Title:</h2>
            <p>{jobDetails.title || "Loading..."}</p>
          </div>
          <div className="dashboard-detail-section job-detail-section">
            <h2>Company:</h2>
            <p>{jobDetails.company || user.companyName}</p>
          </div>
          <div className="dashboard-detail-section job-detail-section">
            <h2>Location:</h2>
            <p>{jobDetails.location || "Loading..."}</p>
          </div>
          <div className="dashboard-detail-section job-detail-section">
            <h2>Type:</h2>
            <p>{jobDetails.type || "Loading..."}</p>
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
            <button className="search-button">Search</button>
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
                  {applicant.totalScore !== undefined && (
                    <div className="dashboard-total-score">
                      Compatibility score:{" "}
                      <strong>{applicant.totalScore}/10</strong>
                    </div>
                  )}{" "}
                  <br />
                  {applicant.applicantSummary.shortSummary !== undefined && (
                    <div className="dashboard-summary">
                      {applicant.applicantSummary.shortSummary.replace(
                        /\\n/g,
                        "\n",
                      )}
                    </div>
                  )}
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
                    <h2>AI Generated Compatibility:</h2>
                    {applicationDetails &&
                    applicationDetails.totalScore !== undefined ? (
                      <div className="progress-bar-container">
                        <div className="progress-bar">
                          <div
                            ref={progressBarRef}
                            className="progress-bar-fill"
                            style={{
                              width: 0,
                              backgroundColor: getColorForScore(
                                applicationDetails.totalScore,
                              ),
                            }}
                          ></div>
                        </div>
                        <div className="progress-bar-score">
                          {applicationDetails.totalScore}/10
                        </div>
                      </div>
                    ) : null}
                  </div>
                  {applicationDetails &&
                  applicationDetails.qualificationsScore !== undefined &&
                  applicationDetails.jobDescriptionScore !== undefined ? (
                    <>
                      <div className="dashboard-detail-section">
                        <h2>
                          Qualifications Score:
                          <span
                            className="score-number"
                            style={{
                              color: getColorForScore(
                                applicationDetails.qualificationsScore.score,
                              ),
                              marginLeft: "10px",
                            }}
                          >
                            {applicationDetails.qualificationsScore.score}
                          </span>
                        </h2>
                        <p className="score-description">
                          {applicationDetails.qualificationsScore.description}
                        </p>
                      </div>
                      <div className="dashboard-detail-section">
                        <h2>
                          Job Description Score:
                          <span
                            className="score-number"
                            style={{
                              color: getColorForScore(
                                applicationDetails.jobDescriptionScore.score,
                              ),
                              marginLeft: "10px",
                            }}
                          >
                            {applicationDetails.jobDescriptionScore.score}
                          </span>
                        </h2>
                        <p className="score-description">
                          {applicationDetails.jobDescriptionScore.description}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="dashboard-detail-section">
                      <p>Scores not stored on the database</p>
                    </div>
                  )}
                  {applicationDetails &&
                  applicationDetails.applicantSummary.longSummary !==
                    undefined ? (
                    <div className="dashboard-detail-section">
                      <h2>AI Generated Summary:</h2>
                      <p>
                        {applicationDetails.applicantSummary.longSummary.replace(
                          /\\n/g,
                          "\n",
                        )}
                      </p>
                    </div>
                  ) : null}
                  <div className="dashboard-detail-section">
                    <h2>Status:</h2>
                    <select className="dropdown"
                      value={status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={isStatusLoading}
                    >
                      <option value="Applied">Pending Review</option>
                      <option value="Review">Under Review</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="dashboard-detail-section">
                    <h2>Resume:</h2>
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
                  <div className="dashboard-detail-section">
                    <strong>Applied Date:</strong> {selectedApplicant.applyDate}
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
