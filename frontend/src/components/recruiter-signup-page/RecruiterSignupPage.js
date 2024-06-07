import "./RecruiterSignupPage.css";

import SignupPage from "../signup-page/SignupPage";

function RecruiterSignupPage() {
  return <SignupPage userType="recruiter" navigateTo="/applicant-dashboard" />;
}

export default RecruiterSignupPage;
