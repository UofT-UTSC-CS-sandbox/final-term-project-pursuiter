# Pursuiter

## Iteration 02

- Start date: 18/06/2024
- End date: 05/07/2024

## Process

#### Changes from previous iteration

- Changed our branch naming convention from `name-PUR-ticketnumber` to `PUR-ticketnumber`.
- Added subtasks to larger story tickets. In terms of github workflow, our branch will still be named after the story ticket. Reviews and merging will only be done for the story tickets and after all of the subtasks are completed.

Note: these changes were agreed upon and implemented after we received our sprint 1 feedback. Therefore, only work that was started after the feedback release date reflects them accordingly. These changes will also be carried forward to future sprints.

#### Roles & responsibilities

- Elena Manneh is the Scrum Master
- All members develop both backend and frontend by picking up tickets from Jira and implementing the required functionality on a new branch on GitHub.
- After completing the functionality, a pull request is opened towards the development branch (dev), which is then reviewed by at least one more member and the ticket branch is deleted after merging.
- Members are required to do sufficient testing and formatting of the code they write

#### Events

- In-person meeting every Tuesday at 15:00 on campus, to discuss progress, challenges, and plan next steps.
- Daily asynchronous standup on on Slack. Purpose is to let team members know about your progress and what you will working on.
- Online meetings over Discord whenever there is an issue that needs to be discussed.

#### Artifacts

- We designed a priority ranking system from 1-3 for user stories to organize them into groups, after which they are further ordered based on prerequisites and significance to the sprint.
- We made a Jira board that is linked to our project GitHub. We use it to track tickets, visualize sprint progress and distribute weight of the work fairly across the team members.
- Initial task assignment is done during the first sprint planning meeting. Tasks maybe added, removed or reassigned based on availability of team members and discoveries made during development.

#### Git / GitHub workflow

- Branching Strategy: Our project uses a structured Git flow. All development should take place in feature branches, which should be created from the dev branch. Branch names must follow the format `PUR-ticketnumber`.
- Pull Requests (PRs): After completing development on a feature branch, a pull request is created to the dev branch. The PR title should clearly state the purpose of the changes, and the description should reference the relevant issue or ticket number.
- Code Reviews: At least one peer review is required for each pull request. This is done to ensure that the changes meet all project standards.
- Merging: No direct commits to the main branch are allowed. At the end of each development sprint, the dev branch is merged into main. This is done to ensure that dev is stable before performing the merge.

## Product

#### Goals and tasks

- Job seeker AI resume recommendations: As a job seeker, I want to get AI recommendations on my resume, so that I can edit and adjust my application.
  - Resume Recommendation Endpoint: Create a service and API endpoint to handle requests for AI-generated resume recommendations.
  - Resume Recommendation Frontend Implementation: Integrate the AI recommendations feature into the frontend, ensuring job seekers can view and apply the suggestions.
- Employer compatibility score by AI: As an employer, I want to get a compatibility summary by AI for all my applicants, including a compatibility score, so that I can save time in viewing and choosing aspects of hiring.
  - Develop Compatibility Score Service: Create a service to handle API calls and generate compatibility scores based on applicant information.
  - Compatibility Score Frontend Implementation: Integrate the compatibility score feature into the employer’s view in the frontend, ensuring they can see the score in the “Applicants” list.
- Employer AI description of applicants: As an employer, I want to view detailed AI descriptions of my applicants when viewing submissions for a job posting, so that I view all the needed information about an applicant when making hiring decisions.
  - Develop Applicant Description Service: Create a service to handle API calls and generate detailed AI descriptions of applicants based on their submitted information.
  - Applicant Description Frontend Implementation: Integrate the AI-generated applicant descriptions feature into the employer’s view in the frontend, ensuring they can see detailed information when clicking on an applicant.
- Favourites and postings for recruiter temporarily disappear when changing information from settings: Postings disappear temporarily but gets fixed when you log out and log back in.

#### Artifacts

- Added master resume upload/view functionality in the user accounts page, so applicants can view their current version and update it if needed.
- Implemented functionality to block applicants from postings they do not qualify for based on their master resume to ensure that only qualified applicants are able to apply.
- Added AI generated feedback that is specific to the posting and relative to the master resume so applicants are aware of how they need to tailor their master resume to best suit this posting.
- Added AI generated feedback that is specific to the posting and relative to a resume upload within a job application so applicants are able to evaluate any updated they have made to their resume.
- Added AI generated description of applicants, so the recruiter has a summarized paragraph of each applicant.
- Added AI generated compaitibility score, so the recruiter has an estimate of how well-fitted an applicant is for the position.
