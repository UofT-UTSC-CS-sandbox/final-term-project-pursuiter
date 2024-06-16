import React from "react";
import Dashboard, {
  fetchFavoritedJobs,
  fetchJobsForApplicant,
} from "./Dashboard";

const ApplicantDashboard = () => (
  <Dashboard
    role="applicant"
    fetchJobs={fetchJobsForApplicant}
    fetchFavoritedJobs={fetchFavoritedJobs}
  />
);

export default ApplicantDashboard;
