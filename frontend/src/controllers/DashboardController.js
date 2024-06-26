import axios from "axios";

const API_URL = "http://localhost:4000";

const DashboardController = {
  // Fetch all jobs
  fetchJobs: async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs`);
      return response.data;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  },

  // Fetch favorited jobs
  fetchFavoritedJobs: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/favorites/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching favorited jobs:", error);
      throw error;
    }
  },

  // Add job to favorites
  addFavoriteJob: async (userId, jobId) => {
    try {
      const response = await axios.post(`${API_URL}/favorites/add`, {
        userId,
        jobId,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding favorite job:", error);
      throw error;
    }
  },

  // Remove job from favorites
  removeFavoriteJob: async (userId, jobId) => {
    try {
      const response = await axios.post(`${API_URL}/favorites/remove`, {
        userId,
        jobId,
      });
      return response.data;
    } catch (error) {
      console.error("Error removing favorite job:", error);
      throw error;
    }
  },

  // Apply for a job
  applyForJob: async (application) => {
    try {
      const response = await axios.post(
        `${API_URL}/applications/add`,
        application,
      );
      return response.data;
    } catch (error) {
      console.error("Error applying for job:", error);
      throw error;
    }
  },

  // Post a new job
  postJob: async (job) => {
    try {
      const response = await axios.post(`${API_URL}/jobs/add`, job);
      return response.data;
    } catch (error) {
      console.error("Error posting job:", error);
      throw error;
    }
  },

  // Edit a job
  editJob: async (jobId, job) => {
    try {
      const response = await axios.put(`${API_URL}/jobs/${jobId}`, job);
      return response.data;
    } catch (error) {
      console.error("Error editing job:", error);
      throw error;
    }
  },

  // Delete a job
  deleteJob: async (jobId) => {
    try {
      const response = await axios.delete(`${API_URL}/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting job:", error);
      throw error;
    }
  },

  // Fetch applicants for a job
  fetchApplicants: async (jobId) => {
    try {
      const response = await axios.get(`${API_URL}/applications/${jobId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching applicants:", error);
      throw error;
    }
  },

  fetchUserApplications: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/applications/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user applications:", error);
      throw error;
    }
  },

  // Fetch job details
  fetchJobDetails: async (jobId) => {
    try {
      const response = await axios.get(`${API_URL}/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching job details:", error);
      throw error;
    }
  },
};

export default DashboardController;
