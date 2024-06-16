import React from "react";
import Dashboard, {
  fetchFavoritedJobs,
  fetchJobsForRecruiter,
} from "./Dashboard";

const RecruiterDashboard = () => (
  <Dashboard
    role="recruiter"
    fetchJobs={fetchJobsForRecruiter}
    fetchFavoritedJobs={fetchFavoritedJobs}
  />
);

export default RecruiterDashboard;
