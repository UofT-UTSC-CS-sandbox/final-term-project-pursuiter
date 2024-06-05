import './ApplicantSignupPage.css';

import SignupPage from '../signup-page/SignupPage';

function JobSeekerSignupPage() {
    return <SignupPage userType="applicant" navigateTo="/applicant-dashboard" />;
}

export default JobSeekerSignupPage;
