import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { FaStar } from "react-icons/fa";
import Modal from "../modal/Modal";

import DashboardController from "../../controllers/DashboardController";
import "./Dashboard.css";
import * as pdfjsLib from "pdfjs-dist/webpack";
import { all } from "axios";

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
  const [resumeState, setResumeState] = useState("Upload");
  const [qualified, setQualified] = useState(false);
  const { user, logoutUser } = useContext(UserContext);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  // Fetch jobs and favorited jobs
  useEffect(() => {
    if (user) {
      fetchFavoritedJobs(user.userId, setFavoritedItems);
      fetchJobs(user.userId, setItems);
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

  // Handle apply for job
  const handleApply = async () => {
    const application = {
      jobID: selectedItem._id,
      userID: user._id,
    };

    try {
      await DashboardController.applyForJob(application);
    } catch (error) {
      console.error("Error applying for job:", error);
    }
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
    }      
    else{
      const applicationToSubmit = {
        applicantID: user.userId,
        jobID: selectedItem._id,
        resumeData: resumeFile,
      };
  
      try {
        const response =
          await DashboardController.applyForJob(applicationToSubmit);
        setApplications((prevApplications) => [response, ...prevApplications]);
        setShowApplicationForm(false);
        setShowConfirmation(true);
        setResumeState("Upload");        
        setTimeout(() => {
        window.location.reload();
        }, 100);
    } catch (error) {
        console.error("Error submitting application:", error);
      }
    }
  };

  // Handle the checking for qualifications in the master resume
  const handleQualificationsCheck = async (keywords, resume) => {
    const keywordsArray = keywords.toLowerCase().split(",").map(keyword => keyword.trim());
    
    const base64String = resume.split(",")[1];
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
                  handleQualificationsCheck(item.hiddenKeywords, "data:application/pdf;base64,JVBERi0xLjMKMyAwIG9iago8PC9UeXBlIC9QYWdlCi9QYXJlbnQgMSAwIFIKL1Jlc291cmNlcyAyIDAgUgovQ29udGVudHMgNCAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9GaWx0ZXIgL0ZsYXRlRGVjb2RlIC9MZW5ndGggNDY1Pj4Kc3RyZWFtCnicbZJLb9swEITv+RV7TICYJakHRZ9a22mBAAWMxkUfyIWmVjYNmRQoKo7/fSnJBlwoB12ImW9HO8vh+Y6STMDpbrGBT18ZME4ohU0FT5v+iRc5YQkImREhYFPC/bPbW1g5fIDN4SriBREURC5IygfR01GZeg6HqCWlw8/4ro5NjUS7460vo4QxEIkkdISv987iHF7vGU9eHyDN8pkoJL3xDBnpfxkTRpiEvOBEFuP09wa9QatvQ15UWUryZFC9uCqclEdY4RvWLlpABfiyWMLSHRtlz1MzzwmX4xaU7ZQ/A6ecwgzWHlu0YeLIpCAyHRw/sG2cbc3W1CYYbOcwVeeS5HRQz66pjN3BCbegmqY2WgUTGdC1/fP6HOK6QNkSVgdld+4DYsoIzy7EpatrtXU+QnqoCXvQ3rXtrOqs7sGqhoDq2EJwUGJlLA5wpfcmhoHGuwPqADun6vaDWfF05DX9L2+GKbpGZR8hnoMN8VPbGh8HKFaV0bGjANqV055SQUlyabPsxv+eitJ4rON2FzFkXJcHV8GLHroHY4cmuxCbvbxNESwh+VjpT2ve0LcmnHvI7z9/J+KkyEgyzvvmVdmpgOUcvqv+DJi8yv8BjhzvWwplbmRzdHJlYW0KZW5kb2JqCjEgMCBvYmoKPDwvVHlwZSAvUGFnZXMKL0tpZHMgWzMgMCBSIF0KL0NvdW50IDEKL01lZGlhQm94IFswIDAgNTk1LjI4IDg0MS44OV0KPj4KZW5kb2JqCjUgMCBvYmoKPDwvVHlwZSAvRm9udAovQmFzZUZvbnQgL0hlbHZldGljYQovU3VidHlwZSAvVHlwZTEKL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1Byb2NTZXQgWy9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUldCi9Gb250IDw8Ci9GMSA1IDAgUgo+PgovWE9iamVjdCA8PAo+Pgo+PgplbmRvYmoKNiAwIG9iago8PAovUHJvZHVjZXIgKFB5RlBERiAxLjcuMiBodHRwOi8vcHlmcGRmLmdvb2dsZWNvZGUuY29tLykKL0NyZWF0aW9uRGF0ZSAoRDoyMDI0MDYxNDA0NTI1NSkKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDEgMCBSCi9PcGVuQWN0aW9uIFszIDAgUiAvRml0SCBudWxsXQovUGFnZUxheW91dCAvT25lQ29sdW1uCj4+CmVuZG9iagp4cmVmCjAgOAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDA2MjIgMDAwMDAgbiAKMDAwMDAwMDgwNSAwMDAwMCBuIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwODcgMDAwMDAgbiAKMDAwMDAwMDcwOSAwMDAwMCBuIAowMDAwMDAwOTA5IDAwMDAwIG4gCjAwMDAwMDEwMTggMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA4Ci9Sb290IDcgMCBSCi9JbmZvIDYgMCBSCj4+CnN0YXJ0eHJlZgoxMTIxCiUlRU9GCg==");
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
                      <button
                        className={(qualified === true) ? "apply-button" : "disabled-button"}
                        onClick={() => {
                          if (qualified) {
                            setShowApplicationForm(true);
                          } else {
                            alert("Master resume doesn't contain the required keywords for this posting");
                          }
                        }}
                      >
                        Apply
                      </button>
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
                  <div className="dashboard-detail-section">
                    <h2>Hidden Keywords:</h2>{" "}
                    <p>{selectedItem.hiddenKeywords}</p>
                  </div>
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
          <p style={{ color: (resumeState === "Missing") ? "#800020" : "#1e1e1e" }}>
          {
            (() => {
              switch (resumeState) {
                case "Missing":
                  return "Resume is required for this application";
                case "Attached":
                  return "Resume attached";
                default:
                  return "Upload resume: ";
              }
            })()
          }
          </p>          
          <input
            type="file"
            accept=".pdf"
            onChange={(event) => handleFileChange(event, "resume")}
          />
          <button 
            type="submit"
            className={(resumeState === "Attached") ? "" : "disabled-button"}
          >
            {editMode ? "Update Application" : "Submit"}
          </button>
          <button
            className="cancel-button"
            onClick={() => {
              setShowApplicationForm(false);
              setResumeState("Upload");
              setResumeFile(null);
            }}
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
