import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { FaStar } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { FaCaretDown } from 'react-icons/fa6'

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
  const [filterTerm, setFilterTerm] = useState({ jobType: "", dueDate: "", createdDate: "", appliedDate: ""});
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
    dateCreated: "",
    hiddenKeywords: "",
    description: "",
    qualifications: "",
    recruiterID: "",
  });
  const [applications, setApplications] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeState, setResumeState] = useState("Missing");
  const [masterResume, setMasterResume] = useState("loading");
  const [MasterResumeRecommendation, setMasterResumeRecommendation] =
    useState("Loading...");
  const [qualified, setQualified] = useState(false);
  const { user, selectedTab, setSelectedTab } = useContext(UserContext);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [ResumeRecommendation, setResumeRecommendation] = useState("");
  const [isGenerateButtonDisabled, setIsGenerateButtonDisabled] =
    useState(true);
  const [isGenerateButtonClicked, setIsGenerateButtonClicked] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [isQualificationsLoading, setIsQualificationsLoading] = useState(false);
  const [recruiterInfo, setRecruiterInfo] = useState({});
  const [missingQualifications, setMissingQualifications] = useState([]);
  const handleNewJob = () => {
    setNewItem({
      title: "",
      company: recruiterInfo.companyName || "",
      location: recruiterInfo.address || "",
      type: "",
      applyBy: "",
      dateCreated: new Date().toISOString().slice(0, 10) || "",
      hiddenKeywords: "",
      description: "",
      qualifications: "",
      recruiterID: user.userId,
    });
    setEditMode(false);
    setShowItemForm(true);
  };  
  const [isFormValid, setIsFormValid] = useState(false);
  const [initialItem, setInitialItem] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    applyBy: "",
    dateCreated: "",
    hiddenKeywords: "",
    description: "",
    qualifications: "",
  });
  const [showWarning, setShowWarning] = useState(false);

  // Fetch jobs and favorited jobs
  useEffect(() => {
    if (user) {
      if (selectedTab === "myApplications") {
        fetchApplications(user.userId, searchTerm, filterTerm);
      } else {
        fetchFavoritedJobs(user.userId, setFavoritedItems);
        fetchJobs(user.userId, setItems, searchTerm, filterTerm);

        UserController.fetchUserInformation(user.userId)
          .then((userInfo) => {
            setMasterResume(userInfo.masterResume || null);
          })
          .catch((error) => {
            console.error("Error fetching user information:", error);
            setMasterResume(null);
          });
      }
    }
  }, [user, fetchFavoritedJobs, fetchJobs, selectedTab]);
  
  // Fetch recruiter information
  useEffect(() => {
    if (user && role === "recruiter") {
      UserController.fetchUserInformation(user.userId)
        .then((userInfo) => {
          setRecruiterInfo(userInfo);
        })
        .catch((error) => {
          console.error("Error fetching recruiter information:", error);
        });
    }
  }, [user, role]);

   // Fetch user's applications
   const fetchApplications = async (userId, searchTerm) => {
    try {
      const response = await DashboardController.fetchUserApplications(userId);
      if (response) {
        const applicationsWithJobDetails = await Promise.all(
          response.map(async (application) => {
            const jobDetails = await DashboardController.fetchJobDetails(application.jobID);
            return { ...application, jobDetails };
          })
        );
        if (searchTerm.trim() === "") {
          setApplications(applicationsWithJobDetails);
        } else { 
          const searchWords = searchTerm.trim().toLowerCase().split(/\s+/);
    
          const filteredJobs = applicationsWithJobDetails.filter((job) => {
            return searchWords.some((word) =>
              job.jobDetails.title.toLowerCase().includes(word) ||
              job.jobDetails.company.toLowerCase().includes(word) ||
              job.jobDetails.location.toLowerCase().includes(word) ||
              job.jobDetails.type.toLowerCase().includes(word) ||
              job.jobDetails.description.toLowerCase().includes(word) ||
              job.jobDetails.qualifications.toLowerCase().includes(word)
            );
          });   
          setApplications(filteredJobs);
        }     
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

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
        dateCreated: "",
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
    setInitialItem({
      title: item.title,
      company: item.company,
      location: item.location,
      type: item.type,
      applyBy: item.applyBy,
      dateCreated: item.dateCreated,
      hiddenKeywords: item.hiddenKeywords,
      description: item.description,
      qualifications: item.qualifications,
    });
    setNewItem({
      title: item.title,
      company: item.company,
      location: item.location,
      type: item.type,
      applyBy: item.applyBy,
      dateCreated: item.dateCreated,
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
        setIsGenerateButtonDisabled(false);
        setIsGenerateButtonClicked(false);
        setResumeRecommendation("");
        setResumeState("Attached");
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle application submission
  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (resumeFile === null) {
      setResumeState("Missing");
    } else {
      setIsSubmitting(true);
      setSubmissionStatus("Submitting application");
      setShowConfirmation(true);
      setShowApplicationForm(false);
      try {
        const scoreFormattedData = await formatScoreData(
          selectedItem.qualifications,
          selectedItem.description,
          resumeFile,
        );
        const scoreResponse =
          await DashboardController.fetchGeminiResponse(scoreFormattedData);
        const scoreCleanedResponse = scoreResponse.response.replace(
          /```json|```/g,
          "",
        );
        const scoreResponseJson = JSON.parse(scoreCleanedResponse);
  
        const descFormattedData = await formatDescData(
          selectedItem.qualifications,
          selectedItem.description,
          resumeFile,
        );
        const descResponse =
          await DashboardController.fetchGeminiResponse(descFormattedData);
        const descCleanedResponse = descResponse.response.replace(
          /```json|```/g,
          "",
        );
        const descResponseJson = JSON.parse(descCleanedResponse);
  
        const applicationToSubmit = {
          applicantID: user.userId,
          jobID: selectedItem._id,
          resumeData: resumeFile,
          applyDate: new Date().toISOString().slice(0, 10),
          totalScore: scoreResponseJson.totalScore,
          qualificationsScore: {
            score: scoreResponseJson.qualificationsScore.score,
            description: scoreResponseJson.qualificationsScore.description,
          },
          jobDescriptionScore: {
            score: scoreResponseJson.jobDescriptionScore.score,
            description: scoreResponseJson.jobDescriptionScore.description,
          },
          applicantSummary: {
            longSummary: descResponseJson.applicantSummary.longSummary,
            shortSummary: descResponseJson.applicantSummary.shortSummary,
          },
          type: qualified ? "application" : "waitlist",
        };
        const response =
          await DashboardController.applyForJob(applicationToSubmit);
        setApplications((prevApplications) => [response, ...prevApplications]);
        setShowApplicationForm(false);
        setResumeState("Missing");
        setSubmissionStatus("Application submitted successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } catch (error) {
        console.error("Error submitting application:", error);
        setSubmissionStatus("Error submitting application.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Checks if all form fields are filled
  const checkFormValidity = () => {
    const { title, company, location, type, applyBy, hiddenKeywords, description, qualifications } = newItem;
    const allFieldsFilled =
      title.trim() !== "" &&
      company.trim() !== "" &&
      location.trim() !== "" &&
      type.trim() !== "" &&
      applyBy.trim() !== "" &&
      hiddenKeywords.trim() !== "" &&
      description.trim() !== "" &&
      qualifications.trim() !== "";
  
    const anyFieldChanged =
      title !== initialItem.title ||
      company !== initialItem.company ||
      location !== initialItem.location ||
      type !== initialItem.type ||
      applyBy !== initialItem.applyBy ||
      hiddenKeywords !== initialItem.hiddenKeywords ||
      description !== initialItem.description ||
      qualifications !== initialItem.qualifications;
  
    setIsFormValid(allFieldsFilled && anyFieldChanged);
  };

  // Call checkFormValidity whenever newItem changes
  useEffect(() => {
    checkFormValidity();
  }, [newItem]);
  
  const allItems = items.filter(
    (item) => !favoritedItems.some((fav) => fav._id === item._id),
  );

  // Handles tab change
  const handleTabChange = (tab) => {
    setSelectedItem(null);
    setSelectedTab(tab);
    if (tab === "newJobs") {
      fetchJobs(user.userId, setItems, "");
    } else {
      fetchApplications(user.userId, "");
    }
  };

  //Turn pdf base64 string into text
  const TurnPdfToString = async (pdf) => {
    try {
      const base64String = pdf.split(",")[1];
      if (!base64String) throw new Error("Invalid PDF base64 string");
  
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
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + " ";
      }
  
      return fullText.trim();
    } catch (error) {
      console.error("Error turning PDF to string:", error);
      return "";
    }
  };
  

  // Format the application data for the API call for the Compatibility Score
  const formatScoreData = async (
    qualifications,
    jobDescription,
    resumeFile,
  ) => {
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

  // Format the application data for the API call for the Applicant Description
  const formatDescData = async (qualifications, jobDescription, resumeFile) => {
    const resumeText = await TurnPdfToString(resumeFile);
    return `
      Instructions:
      - Evaluate the resume based on the job posting qualifications and job description below.
      - For longSummary: Provide a concise description of the applicant, emphasizing the key skills and experiences that align with the 
        job requirements. Highlight the most relevant qualifications that demonstrate the applicant's fit for the position.
        Keep the description to a couple of sentences. Add spacing often, using a newline character. Include a
        sentence at the bottom that summarizes how well the applicant aligns with the job posting. 
      - For shortSummary: Provide a short summary of the applicant's qualifications and experience that align with the job posting.
        It must be no longer than 12 words and in the following format. Use no more than three bullet points and separate each bullet
        point with the newline character.
        Example: '• 3 years with Python
        • Great communication skills
        • Contributed to open-source projects'
      - Format the response as follows:
      {
        "applicantSummary": {
          "longSummary": "<long_summary>",
          "shortSummary": "<short_summary>"
        }
      }
      
      Job Posting:
      Qualifications:
      ${qualifications}

      Job Description:
      ${jobDescription}

      Resume:
      ${resumeText}
    `;
  };

  // Format the resume analysis data for the API call for the AI resume review
  const formatResumeData = async (
    qualifications,
    jobDescription,
    resumeText,
  ) => {
    return `
      Instructions:
      - Evaluate the master resume based on how much the applicant matches the Qualifications and Job Description provided below.
      - Return a detailed paragraph of text that provides a detailed analysis of the applicant's master resume, they need to know how well they match the posting,
      things worth highlighting in the resume they submit crafted from the master resume, how likely are they to get an interview.
      - use second person (words like you, your) as you are talking directly to the applicant.
      - the response should not exceed 1500 characters.
      - try to mention things specifically from the master resume in your response and link concepts to the job posting

      Job Posting:
      Qualifications:
      ${qualifications}

      Job Description:
      ${jobDescription}

      Master Resume:
      ${resumeText}
    `;
  };

  // Handle the checking for qualifications in the master resume
  const handleQualificationsCheck = async (
    keywords,
    resume,
    qualifications,
    jobDescription
  ) => {
    setIsQualificationsLoading(true);
  
    if (masterResume === null) {
      setQualified(false);
      setMissingQualifications([]);
      setIsQualificationsLoading(false);
      return;
    }
  
    const keywordsArray = keywords
      .toLowerCase()
      .split(",")
      .map((keyword) => keyword.trim());
  
    let resumeText = await TurnPdfToString(resume);
    resumeText = resumeText.toLowerCase();
  
    const missingKeywords = keywordsArray.filter(
      (keyword) => !resumeText.includes(keyword)
    );
  
    if (missingKeywords.length === 0) {
      setQualified(true);
      setMissingQualifications([]);
      setShowWarning(false);
      setIsQualificationsLoading(false);
      const formattedData = await formatResumeData(
        qualifications,
        jobDescription,
        resumeText
      );
      const resumeResponse =
        await DashboardController.fetchGeminiResponse(formattedData);
      setMasterResumeRecommendation(resumeResponse.response);
    } else {
      setQualified(false);
      setMissingQualifications(missingKeywords);
      setMasterResumeRecommendation("");
    }
    setShowWarning(true);
    setIsQualificationsLoading(false);
  };
  
  
  const fetchApplications = async (userId, searchTerm, filterTerm) => {
    try {
      const response = await DashboardController.fetchUserApplications(userId);
      if (!response) return;
  
      const applicationsWithJobDetails = await Promise.all(
        response.map(async (application) => ({
          ...application,
          jobDetails: await DashboardController.fetchJobDetails(application.jobID),
        }))
      );
  
      let filteredApplications = applicationsWithJobDetails;
  
      const dateRanges = {
        "In 1 week": 7,
        "In 2 weeks": 14,
        "In 1 month": 30,
        "In 4 months": 120,
        "1 week ago": -7,
        "2 weeks ago": -14,
        "1 month ago": -30,
        "4 months ago": -120,
      };
  
      const getDateRange = (days) => {
        const currentDate = new Date();
        return new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);
      };
  
      const filterByDate = (applications, dateKey, type) => {
        const days = dateRanges[filterTerm[dateKey]];
        if (!days) return applications;
  
        const targetDate = getDateRange(days);
        return applications.filter((application) => {
          const date = new Date(type === 'applyDate' ? application[type] : application.jobDetails[type]);
          return type === 'applyBy' ? date >= new Date() && date <= targetDate : date >= targetDate && date <= new Date();
        });
      };
  
      if (filterTerm.jobType) {
        filteredApplications = filteredApplications.filter(
          (application) => application.jobDetails.type.toLowerCase() === filterTerm.jobType.toLowerCase()
        );
      }
  
      if (filterTerm.appliedDate) {
        filteredApplications = filterByDate(filteredApplications, 'appliedDate', 'applyDate');
      }
  
      if (filterTerm.createdDate) {
        filteredApplications = filterByDate(filteredApplications, 'createdDate', 'createdDate');
      }
  
      if (searchTerm.trim()) {
        const searchWords = searchTerm.trim().toLowerCase().split(/\s+/);
        filteredApplications = filteredApplications.filter((job) =>
          searchWords.some((word) =>
            ['title', 'company', 'location', 'type', 'description', 'qualifications'].some((field) =>
              job.jobDetails[field].toLowerCase().includes(word)
            )
          )
        );
      }
  
      setApplications(filteredApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };
  


  const addFilterWord = (filterType, word) => {
    setFilterTerm(filterTerm => ({
      ...filterTerm,
      [filterType]: word
    }));
  };

  // Checks if all form fields are filled
  const checkFormValidity = () => {
    const { title, company, location, type, applyBy, dateCreated, hiddenKeywords, description, qualifications } = newItem;
    const allFieldsFilled =
      title.trim() !== "" &&
      company.trim() !== "" &&
      location.trim() !== "" &&
      type.trim() !== "" &&
      applyBy.trim() !== "" &&
      dateCreated.trim() !== "" &&
      hiddenKeywords.trim() !== "" &&
      description.trim() !== "" &&
      qualifications.trim() !== "";
  
    const anyFieldChanged =
      title !== initialItem.title ||
      company !== initialItem.company ||
      location !== initialItem.location ||
      type !== initialItem.type ||
      applyBy !== initialItem.applyBy ||
      dateCreated !== initialItem.dateCreated ||
      hiddenKeywords !== initialItem.hiddenKeywords ||
      description !== initialItem.description ||
      qualifications !== initialItem.qualifications;
  
    setIsFormValid(allFieldsFilled && anyFieldChanged);
  };

  // Call checkFormValidity whenever newItem changes
  useEffect(() => {
    checkFormValidity();
  }, [newItem]);
  
  const allItems = items.filter(
    (item) => !favoritedItems.some((fav) => fav._id === item._id),
  );
  const displayedItems = selectedTab === "myApplications" ? applications : [...favoritedItems, ...allItems];

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
      {role === "applicant" && masterResume === null && selectedTab === "newJobs" &&(
        <div className="warning-message dashboard-warning-message">
          Warning: You have not uploaded a master resume and your eligibility for job postings cannot be determined. You can only apply to the waitlist.
        </div>
      )}
        {role === "recruiter" && (
          <button className="new-item-button" onClick={handleNewJob}>
            New Job
          </button>
        )}
        <div className="aesthetic-bar"></div>
        <div className="search-and-filters">
          <div className="search">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search by experience, keywords..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedItem(null);
                }}
              />
              {searchTerm && (
                <button
                  className="clear-button"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedItem(null);                   
                  }}
                >
                  <div className="icon"><FaXmark/></div>
                </button>
              )}
            </div>
          </div>
          <div className="filter-dropdowns">
            { !filterTerm.jobType && (
              <div class="filter-dropdown">
                <button class="dropbtn">
                  Job Type <div class="icon"><FaCaretDown/></div></button>
                <div class="dropdown-content" 
                    onClick={(e) => {addFilterWord("jobType", e.target.textContent);
                                     setSelectedItem(null);
                    }}>
                  <span>Full-time</span>
                  <span>Part-time</span>
                  <span>Internship</span>
                  <span>Co-op</span>
                  <span>Contract</span>
                  <span>Freelance</span>
                  <span>Apprenticeship</span>
                </div>
              </div>
            )}
            {filterTerm.jobType && (
                <button class="filter-display-btn" onClick={() => {setFilterTerm({...filterTerm, jobType: ''}); setSelectedItem(null);}}>
                  {filterTerm.jobType} <div className="icon"><FaXmark/></div>
                </button>
            )}
            {selectedTab === "myApplications" ? (
              !filterTerm.appliedDate ? (
                <div class="filter-dropdown">
                  <button class="dropbtn">
                    Applied <div class="icon"><FaCaretDown/></div>
                  </button>
                  <div class="dropdown-content" onClick={(e) => {addFilterWord("appliedDate", e.target.textContent); setSelectedItem(null);}}>
                    <span>1 weeks ago</span>
                    <span>2 weeks ago</span>
                    <span>1 month ago</span>
                    <span>4 months ago</span>
                  </div>
                </div>
              ) : (
                <button class="filter-display-btn" onClick={() => {setFilterTerm({...filterTerm, appliedDate: ''}); setSelectedItem(null);}}>
                  {filterTerm.appliedDate} <div className="icon"><FaXmark/></div>
                </button>
              )
            ) : (
              !filterTerm.dueDate ? (
                <div class="filter-dropdown">
                  <button class="dropbtn">
                    Job Due <div class="icon"><FaCaretDown/></div>
                  </button>
                  <div class="dropdown-content" onClick={(e) => {addFilterWord("dueDate", e.target.textContent); setSelectedItem(null);}}>
                    <span>In 1 week</span>
                    <span>In 2 weeks</span>
                    <span>In 1 month</span>
                    <span>In 4 months</span>
                  </div>
                </div>
              ) : (
                <button class="filter-display-btn" onClick={() => {setFilterTerm({...filterTerm, dueDate: ''}); setSelectedItem(null);}}>
                  {filterTerm.dueDate} <div className="icon"><FaXmark/></div>
                </button>
              )
            )}
            { !filterTerm.createdDate && (
              <div class="filter-dropdown">
                <button class="dropbtn">
                  Job Created <div class="icon"><FaCaretDown/></div>
                </button>
                <div class="dropdown-content" onClick={(e) => {addFilterWord("createdDate", e.target.textContent); setSelectedItem(null);}}>
                  <span>1 week ago</span>
                  <span>2 weeks ago</span>
                  <span>1 month ago</span>
                  <span>4 months ago</span>
                </div>
              </div>
            )}
            {filterTerm.createdDate && (
                <button class="filter-display-btn" onClick={() => {setFilterTerm({...filterTerm, createdDate: ''}); setSelectedItem(null);}}>
                  {filterTerm.createdDate} <div className="icon"><FaXmark/></div>
                </button>
            )}
          </div>
        </div>
        {role === "applicant" && (
          <div className="tab-bar">
            <div className="tab-container">
            <button
                className={`tab-button ${selectedTab === "newJobs" ? "selected" : ""}`}
                onClick={() => handleTabChange("newJobs")}
              >
                New Jobs
              </button>
              <button
                className={`tab-button ${selectedTab === "myApplications" ? "selected" : ""}`}
                onClick={() => handleTabChange("myApplications")}
              >
                My Applications
              </button>
            </div>
          </div>
        )}
        <div className="dashboard-listings">
          <div className="dashboard-list">
            <div className="dashboard-count">
              Showing {displayedItems.length} Jobs
            </div>
            {displayedItems.map((item, index) => (
              <div
              key={index}
              className={`dashboard-item ${item.type === 'waitlist' ? 'waitlist-item' : ''}`}
              onClick={() => {
                setSelectedItem(item);
                setQualified(false);
                setMasterResumeRecommendation("Loading...");
                if (selectedTab === "myApplications") {
                  handleQualificationsCheck(
                    item.jobDetails.hiddenKeywords,
                    masterResume,
                    item.jobDetails.qualifications,
                    item.jobDetails.description
                  );
                } else {
                  handleQualificationsCheck(
                    item.hiddenKeywords,
                    masterResume,
                    item.qualifications,
                    item.description
                  );
                }
              }}
            >
              {selectedTab === "myApplications" ? (
                <>
                  <div className="dashboard-title">
                    {item.jobDetails.title}
                    {item.type === "waitlist" && (
                      <div className="dashboard-waitlist">
                        Waitlisted
                      </div>
                    )}
                  </div>
                  <div className="dashboard-company">{item.jobDetails.company}</div>
                  <div className="dashboard-location">{item.jobDetails.location}</div>
                  <div className="dashboard-type">{item.jobDetails.type}</div>
                </>
              ) : (
                <>
                  <div className="dashboard-title">{item.title}</div>
                  <div className="dashboard-company">{item.company}</div>
                  <div className="dashboard-location">{item.location}</div>
                  <div className="dashboard-type">{item.type}</div>
                  <div className="dashboard-apply-by">
                    <strong>Apply by:</strong> {item.applyBy}
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
                </>
              )}
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
                    selectedTab !== "myApplications" && (
                      <div className="dashboard-detail-actions">
                        <button
                          className="resume-submit-button"
                          disabled={
                            isQualificationsLoading
                          }
                          onClick={() => setShowApplicationForm(true)}
                        >
                          {isQualificationsLoading ? (
                            <div className="loading-dots-container">
                              <div className="loading-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                            </div>
                          ) : (
                            qualified ? "Apply" : "Apply to Waitlist"
                          )}
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="dashboard-detail-body">
              {showWarning && selectedTab === "newJobs" &&(
                  <div className="warning-message">
                    Warning: You do not meet the minimum qualifications for this job and can only apply to the waitlist.
                  </div>
                )}
                {selectedTab === "myApplications" ? (
                    <>
                      <div className="dashboard-detail-section job-title">
                        {selectedItem.jobDetails.title}
                      </div>
                      <div className="dashboard-detail-section">
                        <h2>Company:</h2>
                        <p>{selectedItem.jobDetails.company}</p>
                      </div>
                      <div className="dashboard-detail-section">
                        <h2>Location:</h2>
                        <p>{selectedItem.jobDetails.location}</p>
                      </div>
                      <div className="dashboard-detail-section">
                        <h2>Type:</h2>
                        <p>{selectedItem.jobDetails.type}</p>
                      </div>
                      <div className="dashboard-detail-section">
                        <h2>Description:</h2>
                        <p>{selectedItem.jobDetails.description}</p>
                      </div>
                      <div className="dashboard-detail-section">
                        <h2>Qualifications:</h2>
                        <p>{selectedItem.jobDetails.qualifications}</p>
                      </div>
                      <div className="dashboard-detail-section">
                        <h2>Status:</h2>
                        <p>{selectedItem.status}</p>
                      </div>
                      <div className="dashboard-detail-section">
                        <h2>Resume:</h2>
                        {selectedItem.resumeData ? (
                          <iframe
                            src={selectedItem.resumeData}
                            className="resume-iframe"
                            title="Resume"
                          ></iframe>
                        ) : (
                          "Resume not available"
                        )}
                      </div>
                      <div className="dashboard-detail-section">
                        <strong>Applied Date:</strong> {selectedItem.applyDate}
                      </div>
                    </>
                ) : (
                  <>
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
                      <h2>Description:</h2>
                      <p>{selectedItem.description}</p>
                    </div>
                    <div className="dashboard-detail-section">
                      <h2>Qualifications:</h2>
                      <p>{selectedItem.qualifications}</p>
                    </div>
                    {role === "recruiter" && (
                      <div className="dashboard-detail-section">
                        <h2>Hidden Keywords:</h2>
                        <p>{selectedItem.hiddenKeywords}</p>
                      </div>
                    )}
                  {!qualified && missingQualifications.length > 0 ? (
                      <div className="dashboard-detail-section">
                      <h2>Missing Qualifications:</h2>
                      <ul>
                        {missingQualifications.map((qualification, index) => (
                          <li key={index}>{qualification}</li>
                        ))}
                      </ul>
                    </div>
                    ) : (
                      <>
                      {role === "applicant" && (
                        <div className="dashboard-detail-section">
                          <h2>AI master resume analysis:</h2>
                          {masterResume !== null ? (
                            <>
                              {MasterResumeRecommendation === "Loading..." ? (
                                <div className="loading-dots-container">
                                  <div className="loading-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                  </div>
                                </div>
                              ) : (
                                <p>{MasterResumeRecommendation}</p>
                              )}
                            </>
                          ) : (
                            <p>
                              Master resume has not been uploaded. Analysis
                              will be available once you upload it from the
                              account page.
                            </p>
                          )}
                        </div>
                      )}
                      </>
                    )}
                  </>
                )}
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
        <select
          name="type"
          value={newItem.type}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Job Type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Co-op">Co-op</option>
          <option value="Contract">Contract</option>
          <option value="Freelance">Freelance</option>
          <option value="Apprenticeship">Apprenticeship</option>
          <option value="On-call">On-call</option>
        </select>
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
        <button type="submit" disabled={!isFormValid}>
          {editMode ? "Update Job" : "Submit"}
        </button>
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
        onClose={() => {
          setShowApplicationForm(false);
          setResumeRecommendation("");
          setIsGenerateButtonDisabled(true);
          setIsGenerateButtonClicked(false);
          setResumeFile(null);
          setResumeState("Missing");
        }}
        title="New Application"
      >
        <form className="new-item-form" onSubmit={handleApplicationSubmit}>
          <p>Upload resume: </p>
          <input
            type="file"
            accept=".pdf"
            onChange={(event) => handleFileChange(event, "resume")}
          />
          {qualified && (
            <div className="ai-feedback-section">
              <div className="ai-feedback-header">
                <h3>
                  AI Generated Feedback
                  <span className="tooltip-container">
                    <span className="tooltip-icon">?</span>
                    <span className="tooltip tooltip-modal">
                      Upload a customized resume for detailed feedback
                    </span>
                  </span>
                </h3>
                <div className="tooltip-container">
                  <button
                    type="button"
                    className="generate-feedback-button"
                    disabled={isGenerateButtonDisabled || isGenerateButtonClicked}
                    onClick={async () => {
                      setIsGenerateButtonClicked(true);
                      setResumeRecommendation("Loading...");

                      try {
                        const resumeText = await TurnPdfToString(resumeFile);
                        const formattedData = await formatResumeData(
                          selectedItem.qualifications,
                          selectedItem.description,
                          resumeText
                        );
                        const response =
                          await DashboardController.fetchGeminiResponse(
                            formattedData
                          );
                        setResumeRecommendation(response.response);
                      } catch (error) {
                        console.error("Error generating feedback:", error);
                        setResumeRecommendation("Error generating feedback.");
                      }
                    }}
                  >
                    Generate Feedback
                  </button>
                  {(isGenerateButtonDisabled || isGenerateButtonClicked) && (
                    <span className="tooltip tooltip-modal">
                      Upload a new resume to generate corresponding feedback
                    </span>
                  )}
                </div>
              </div>
              <div className="ai-feedback-box">
                {ResumeRecommendation === "Loading..." ? (
                  <div className="loading-dots-container">
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                ) : (
                  <p>{ResumeRecommendation || "No feedback generated yet."}</p>
                )}
              </div>
            </div>
          )}
          <button
            type="submit"
            className="resume-submit-button"
            disabled={resumeState !== "Attached"}
          >
            {" "}
            Submit
          </button>
          <button
            className="cancel-button"
            onClick={() => {
              setShowApplicationForm(false);
              setResumeRecommendation("");
              setIsGenerateButtonDisabled(true);
              setIsGenerateButtonClicked(false);
              setResumeFile(null);
              setResumeState("Missing");
            }}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </form>
      </Modal>
      <Modal
        show={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setIsGenerateButtonDisabled(true);
          setIsGenerateButtonClicked(false);
          setResumeFile(null);
          setResumeState("Missing");
        }}
      >
        <div className="modal-header">
          {submissionStatus === "Error submitting application." && (
            <button
              className="modal-close-button"
              onClick={() => {
                setShowConfirmation(false);
                setIsGenerateButtonDisabled(true);
                setIsGenerateButtonClicked(false);
                setResumeFile(null);
                setResumeRecommendation("");
                setResumeState("Missing");
              }}
            >
              X
            </button>
          )}
        </div>
        {submissionStatus === "Submitting application" ? (
          <div className="loading-dots-container">
            <p>{submissionStatus}</p>
            <div className="loading-dots modal-loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : (
          <p>{submissionStatus}</p>
        )}
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

const fetchJobsForRecruiter = async (userId, setItems, searchTerm) => {
  try {
    const response = await DashboardController.fetchJobs();
    const availableJobs = response.filter(
      (job) => job.recruiterID.toString() === userId,
    );
    if (searchTerm.trim() === "") {
      setItems(availableJobs);
    } else { 
      const searchWords = searchTerm.trim().toLowerCase().split(/\s+/);

      const filteredJobs = availableJobs.filter((job) => {
        return searchWords.some((word) =>
          job.title.toLowerCase().includes(word) ||
          job.company.toLowerCase().includes(word) ||
          job.location.toLowerCase().includes(word) ||
          job.type.toLowerCase().includes(word) ||
          job.description.toLowerCase().includes(word) ||
          job.qualifications.toLowerCase().includes(word) ||
          job.hiddenKeywords.toLowerCase().includes(word)
        );
      });
      setItems(filteredJobs);
    }
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
};

const fetchJobsForApplicant = async (userId, setItems, searchTerm, filterTerm) => {
  try {
    const jobsResponse = await DashboardController.fetchJobs();
    const applicationsResponse = await DashboardController.fetchUserApplications(userId);

    if (!applicationsResponse) {
      setItems(jobsResponse);
      return;
    }

    const appliedJobIds = new Set(applicationsResponse.map((application) => application.jobID));

    let availableJobs = jobsResponse.filter((job) => !appliedJobIds.has(job._id));

    const dateRanges = {
      "In 1 week": 7,
      "In 2 weeks": 14,
      "In 1 month": 30,
      "In 4 months": 120,
      "1 week ago": -7,
      "2 weeks ago": -14,
      "1 month ago": -30,
      "4 months ago": -120,
    };

    const getDateRange = (days) => {
      const currentDate = new Date();
      return new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);
    };

    const filterByDate = (jobs, dateKey, type) => {
      const days = dateRanges[filterTerm[dateKey]];
      if (!days) return jobs;

      const targetDate = getDateRange(days);
      return jobs.filter((job) => {
        const date = new Date(job[type]);
        return type === 'applyBy' ? date >= new Date() && date <= targetDate : date >= targetDate && date <= new Date();
      });
    };

    if (filterTerm.jobType) {
      availableJobs = availableJobs.filter(
        (job) => job.type.toLowerCase() === filterTerm.jobType.toLowerCase()
      );
    }

    if (filterTerm.dueDate) {
      availableJobs = filterByDate(availableJobs, 'dueDate', 'applyBy');
    }

    if (filterTerm.createdDate) {
      availableJobs = filterByDate(availableJobs, 'createdDate', 'createdDate');
    }

    if (searchTerm.trim()) {
      const searchWords = searchTerm.trim().toLowerCase().split(/\s+/);
      availableJobs = availableJobs.filter((job) =>
        searchWords.some((word) =>
          ['title', 'company', 'location', 'type', 'description', 'qualifications'].some((field) =>
            job[field].toLowerCase().includes(word)
          )
        )
      );
    }

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
