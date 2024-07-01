import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { FaStar } from "react-icons/fa";
import Modal from "../modal/Modal";
import UserController from "../../controllers/UserController";

import DashboardController from "../../controllers/DashboardController";
import "./Dashboard.css";
import * as pdfjsLib from "pdfjs-dist/webpack";

const Dashboard = ({ role, fetchJobs, fetchFavoritedJobs }) => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [favoritedItems, setFavoritedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    applyBy: "",
    hiddenKeywords: "",
    description: "",
    qualifications: "",
    recruiterID: "",
  });
  const [applications, setApplications] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeState, setResumeState] = useState("Missing");
  const [masterResume, setMasterResume] = useState(null);
  const [qualified, setQualified] = useState(false);
  const { user, logoutUser } = useContext(UserContext);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  // Fetch jobs and favorited jobs
  useEffect(() => {
    if (user) {
      fetchFavoritedJobs(user.userId, setFavoritedItems);
      fetchJobs(user.userId, setItems);

      UserController.fetchUserInformation(user.userId)
      .then((userInfo) => {
        setMasterResume(userInfo.masterResume || null);
      })
      .catch((error) => {
        console.error("Error fetching user information:", error);
      });      
    }
  }, [user, fetchFavoritedJobs, fetchJobs]);

  // Handle favorite
  const handleFavorite = async (item) => {
    try {
      const isFav = isFavorited(item);
      if (isFav) {
        await DashboardController.removeFavoriteJob(user.userId, item._id);
      } else {
        await DashboardController.addFavoriteJob(user.userId, item._id);
      }

      setFavoritedItems((prevFavorites) => {
        if (isFav) {
          return prevFavorites.filter((fav) => fav._id !== item._id);
        } else {
          return [item, ...prevFavorites];
        }
      });
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  // Handle input change on add/edit jobs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  // Handle form submission for add/edit jobs
  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemToSubmit = { ...newItem, recruiterID: user.userId };

    try {
      if (editMode) {
        const response = await DashboardController.editJob(
          selectedItem._id,
          itemToSubmit,
        );
        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === selectedItem._id ? response.job : item,
          ),
        );
        setEditMode(false);
        setSelectedItem(null);
        window.location.reload();
      } else {
        const response = await DashboardController.postJob(itemToSubmit);
        setItems((prevItems) => [response, ...prevItems]);
      }

      setNewItem({
        title: "",
        company: "",
        location: "",
        type: "",
        applyBy: "",
        hiddenKeywords: "",
        description: "",
        qualifications: "",
        recruiterID: "",
      });
      setShowItemForm(false);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting item:", error);
    }
  };

  // Handle edit job
  const handleEdit = (item) => {
    setNewItem({
      title: item.title,
      company: item.company,
      location: item.location,
      type: item.type,
      applyBy: item.applyBy,
      hiddenKeywords: item.hiddenKeywords,
      description: item.description,
      qualifications: item.qualifications,
      recruiterID: item.recruiterID,
    });
    setSelectedItem(item);
    setEditMode(true);
    setShowItemForm(true);
  };

  // Handle delete job
  const handleDelete = async () => {
    try {
      await DashboardController.deleteJob(itemToDelete._id);
      setItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemToDelete._id),
      );
      setFavoritedItems((prevFavoritedItems) =>
        prevFavoritedItems.filter((fav) => fav._id !== itemToDelete._id),
      );
      setSelectedItem(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Confirm delete job
  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const isFavorited = (item) =>
    favoritedItems.some((fav) => fav._id === item._id);

  // Handle see applicants
  const handleSeeApplicants = (item) => {
    navigate(`/applicants/${item._id}`);
  };

  // Handle file change in apply to job
  const handleFileChange = (event, fileType) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (fileType === "resume") {
        setResumeFile(reader.result);
        setResumeState("Attached");
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle job application submission
  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (resumeFile === null) {
      setResumeState("Missing");
    } else {
      setIsSubmitting(true);
      try {
        const formattedData = await formatApplicationData(selectedItem.qualifications, selectedItem.description, resumeFile);
        const scoreResponse = await DashboardController.fetchGeminiResponse(formattedData);
        const cleanedResponse = scoreResponse.response.replace(/```json|```/g, '');
        const responseJson = JSON.parse(cleanedResponse);  
        const applicationToSubmit = {
          applicantID: user.userId,
          jobID: selectedItem._id,
          resumeData: resumeFile,
          totalScore: responseJson.totalScore,
          qualificationsScore: {
            score: responseJson.qualificationsScore.score,
            description: responseJson.qualificationsScore.description
          },
          jobDescriptionScore: {
            score: responseJson.jobDescriptionScore.score,
            description: responseJson.jobDescriptionScore.description
          }
        };
        const response = await DashboardController.applyForJob(applicationToSubmit);
        setApplications((prevApplications) => [response, ...prevApplications]);
        setShowApplicationForm(false);
        setShowConfirmation(true);
        setResumeState("Missing");
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } catch (error) {
        console.error("Error submitting application:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  
  
  //Turn pdf base64 string into text
  const TurnPdfToString = async (pdf) => {
    const base64String = pdf.split(",")[1];
    const pdfData = atob(base64String);
  
    const pdfArray = new Uint8Array(pdfData.length);
    for (let i = 0; i < pdfData.length; i++) {
      pdfArray[i] = pdfData.charCodeAt(i);
    }
  
    const loadingTask = pdfjsLib.getDocument({ data: pdfArray });
    const pdfDocument = await loadingTask.promise;
  
    let fullText = "";
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(" ");
      fullText += pageText + " ";
    }
  
    return fullText.trim();
  };

  // Format the application data for the API call for the Compatibility Score
  const formatApplicationData = async (qualifications, jobDescription, resumeFile) => {
    const resumeText = await TurnPdfToString(resumeFile);
    return `
      Instructions:
      - Evaluate the resume based on the criteria provided below.
      - Return a detailed score for each criterion (keep it to a couple of words) along with a total score.
      - Format the response as follows:
      {
        "totalScore": <total_score>,
        "qualificationsScore": {
          "score": <qualifications_score>,
          "description": "<qualifications_description>"
        },
        "jobDescriptionScore": {
          "score": <job_description_score>,
          "description": "<job_description_description>"
        }
      }

      Criteria:
      Qualifications Match:
      - 5 points: Applicant meets all the listed qualifications.
      - 3-4 points: Applicant meets most (70%-99%) of the listed qualifications.
      - 2 points: Applicant meets some (30%-69%) of the listed qualifications.
      - 1 point: Applicant meets few (1%-29%) of the listed qualifications.
      - 0 points: Applicant does not meet any of the listed qualifications.

      Job Description Fit:
      - 5 points: Applicant’s experience and skills closely match the job description.
      - 3-4 points: Applicant’s experience and skills moderately match the job description.
      - 2 points: Applicant’s experience and skills somewhat match the job description.
      - 1 point: Applicant’s experience and skills minimally match the job description.
      - 0 points: Applicant’s experience and skills do not match the job description.

      Job Posting:
      Qualifications:
      ${qualifications}

      Job Description:
      ${jobDescription}

      Resume:
      ${resumeText}
    `;
  };


  // Handle the checking for qualifications in the master resume
  const handleQualificationsCheck = async (keywords, resume) => {
    if(masterResume === null){
      setQualified(false);
      return;
    }

    const keywordsArray = keywords.toLowerCase().split(",").map(keyword => keyword.trim());
    
    let fullText = await TurnPdfToString(resume);

    fullText = fullText.toLowerCase();

    const allKeywordsFound = keywordsArray.every(keyword => fullText.includes(keyword));

    if(allKeywordsFound){
      setQualified(true);
    }
    else{
      setQualified(false);
    }
  };   

  const allItems = items.filter(
    (item) => !favoritedItems.some((fav) => fav._id === item._id),
  );
  const displayedItems = [...favoritedItems, ...allItems];

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {role === "recruiter" && (
          <button
            className="new-item-button"
            onClick={() => setShowItemForm(true)}
          >
            New Job
          </button>
        )}
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
              Showing {displayedItems.length} Jobs
            </div>
            {displayedItems.map((item, index) => (
              <div
                key={index}
                className="dashboard-item"
                onClick={() => {
                  setSelectedItem(item);
                  handleQualificationsCheck(item.hiddenKeywords, masterResume);
                }}
              >
                <div className="dashboard-title">{item.title}</div>
                <div className="dashboard-company">{item.company}</div>
                <div className="dashboard-location">{item.location}</div>
                <div className="dashboard-type">{item.type}</div>
                <div className="dashboard-apply-by">
                  <strong>Closing Date:</strong> {item.applyBy}
                </div>
                <div
                  className={`favorite-icon ${isFavorited(item) ? "favorited" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavorite(item);
                  }}
                >
                  <FaStar />
                </div>
              </div>
            ))}
          </div>
          <div className="dashboard-detail">
            {selectedItem ? (
              <>
                <div className="dashboard-detail-header">
                  <div className="dashboard-detail-title">
                    {selectedItem.title}
                  </div>
                  <div className="dashboard-detail-actions">
                    {role === "recruiter" ? (
                      <>
                        <button
                          className="see-applicants-button"
                          onClick={() => handleSeeApplicants(selectedItem)}
                        >
                          See Applicants
                        </button>
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(selectedItem)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => confirmDelete(selectedItem)}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <div className="tooltip-apply-container">
                        <button
                          className="resume-submit-button"
                          disabled={qualified !== true}                          
                          onClick={() => {
                            if (qualified) {
                              setShowApplicationForm(true);
                            }
                          }}
                        >
                          Apply
                        </button>
                        {(qualified !== true) && (
                          <span className="tooltip-apply">
                            Master resume does not contain the required keywords for this posting
                          </span>
                        )}                        
                      </div>
                    )}
                  </div>
                </div>
                <div className="dashboard-detail-body">
                  <div className="dashboard-detail-section">
                    <h2>Company:</h2>
                    <p>{selectedItem.company}</p>
                  </div>
                  <div className="dashboard-detail-section">
                    <h2>Location:</h2>
                    <p>{selectedItem.location}</p>
                  </div>
                  <div className="dashboard-detail-section">
                    <h2>Type:</h2>
                    <p>{selectedItem.type}</p>
                  </div>
                  {role === "recruiter" ? (
                      <>
                        <div className="dashboard-detail-section">
                          <h2>Hidden Keywords:</h2>{" "}
                          <p>{selectedItem.hiddenKeywords}</p>
                        </div>
                      </>
                    ) : (
                      <>
                      </>
                  )}
                  <div className="dashboard-detail-section">
                    <h2>Description:</h2>
                    <p>{selectedItem.description}</p>
                  </div>
                  <div className="dashboard-detail-section">
                    <h2>Qualifications:</h2>
                    <p>{selectedItem.qualifications}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="dashboard-detail-body">
                <p>Select a job to see the details</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal
        show={showItemForm}
        onClose={() => setShowItemForm(false)}
        title={editMode ? "Edit Job" : "New Job"}
      >
        <form className="new-item-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={newItem.title}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={newItem.company}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={newItem.location}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="type"
            placeholder="Job Type"
            value={newItem.type}
            onChange={handleInputChange}
            required
          />
          <input
            type="date"
            name="applyBy"
            placeholder="Apply By"
            value={newItem.applyBy}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="hiddenKeywords"
            placeholder="Hidden Keywords"
            value={newItem.hiddenKeywords}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Job Description"
            value={newItem.description}
            onChange={handleInputChange}
            required
          ></textarea>
          <textarea
            name="qualifications"
            placeholder="Qualifications"
            value={newItem.qualifications}
            onChange={handleInputChange}
            required
          ></textarea>
          <button type="submit">{editMode ? "Update Job" : "Submit"}</button>
          <button
            className="cancel-button"
            onClick={() => setShowItemForm(false)}
          >
            Cancel
          </button>
        </form>
      </Modal>
      <Modal
        show={showApplicationForm}
        onClose={() => setShowApplicationForm(false)}
        title={editMode ? "Edit Application" : "New Application"}
      >
        <form className="new-item-form" onSubmit={handleApplicationSubmit}>
          <p>Upload resume: </p>        
          <input
            type="file"
            accept=".pdf"
            onChange={(event) => handleFileChange(event, "resume")}
          />
          {isSubmitting ? (
          <div className="submitting-message">
          Submitting application
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
        </div>
        ) : (
          <button 
            type="submit"
            className="resume-submit-button"
            disabled={resumeState !== "Attached"}            
          >
            {editMode ? "Update Application" : "Submit"}
          </button>
    )}
          <button
            className="cancel-button"
            onClick={() => {
              setShowApplicationForm(false);
              setResumeState("Missing");
              setResumeFile(null);
            }}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </form>
      </Modal>
      <Modal show={showConfirmation} onClose={() => setShowConfirmation(false)}>
        <p>Application submitted successfully!</p>
      </Modal>
      <Modal
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to delete this job?</p>
        <div className="delete-modal">
          <button className="delete-button" onClick={handleDelete}>
            Delete
          </button>
          <button
            className="cancel-button"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

const fetchFavoritedJobs = async (userId, setFavoritedItems) => {
  try {
    const response = await DashboardController.fetchFavoritedJobs(userId);
    setFavoritedItems(response);
  } catch (error) {
    console.error("Error fetching favorited jobs:", error);
  }
};

const fetchJobsForRecruiter = async (userId, setItems) => {
  try {
    const response = await DashboardController.fetchJobs();
    const filteredJobs = response.filter(
      (job) => job.recruiterID.toString() === userId,
    );
    setItems(filteredJobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
};

const fetchJobsForApplicant = async (userId, setItems) => {
  try {
    const jobsResponse = await DashboardController.fetchJobs();
    const applicationsResponse = await DashboardController.fetchUserApplications(userId);
    const appliedJobIds = new Set();
    applicationsResponse.forEach(application => {
      if (application.jobID) {
        appliedJobIds.add(application.jobID);
      } else {
        console.error("Application does not contain jobID:", application);
      }
    });
    const availableJobs = jobsResponse.filter(job => !appliedJobIds.has(job._id));
    setItems(availableJobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
};

export {
  Dashboard as default,
  fetchFavoritedJobs,
  fetchJobsForRecruiter,
  fetchJobsForApplicant,
};
