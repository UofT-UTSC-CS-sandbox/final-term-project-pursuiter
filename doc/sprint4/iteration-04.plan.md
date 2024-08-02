# Pursuiter

## Iteration 04

 * Start date: 22/07/2024
 * End date: 02/08/2024

## Process

#### Changes from previous iteration

 * No changes to process from previous iteration. 

#### Roles & responsibilities

 * Elena Manneh is the Scrum Master
 * All members develop both backend and frontend by picking up tickets from Jira and implementing the required functionality on a new branch on GitHub.
 * After completing the functionality, a pull request is opened towards the development branch (dev), which is then reviewed by at least one more member and the ticket branch is deleted after merging.
 * Members are required to do sufficient testing and formatting of the code they write

#### Events

 * In-person meeting every Tuesday at 15:00 on campus, to discuss progress, challenges, and plan next steps.
 * Daily asynchronous standup on on Slack. Purpose is to let team members know about your progress and what you will working on.
 * Online meetings over Discord whenever there is an issue that needs to be discussed.

#### Artifacts

 * We designed a priority ranking system from 1-3 for user stories to organize them into groups, after which they are further ordered based on prerequisites and significance to the sprint.
 * We made a Jira board that is linked to our project GitHub. We use it to track tickets, visualize sprint progress and distribute weight of the work fairly across the team members.
 * Initial task assignment is done during the first sprint planning meeting. Tasks maybe added, removed or reassigned based on availability of team members and discoveries made during development.

 #### Git / GitHub workflow

 * Branching Strategy: Our project uses a structured Git flow. All development should take place in feature branches, which should be created from the dev branch. Branch names must follow the format `PUR-ticketnumber`.
 * Pull Requests (PRs): After completing development on a feature branch, a pull request is created to the dev branch. The PR title should clearly state the purpose of the changes, and the description should reference the relevant issue or ticket number.
 * Code Reviews: At least one peer review is required for each pull request. This is done to ensure that the changes meet all project standards.
 * Merging: No direct commits to the main branch are allowed. At the end of each development sprint, the dev branch is merged into main. This is done to ensure that dev is stable before performing the merge.


## Product

#### Goals and tasks

  * Favorite applicants in recruiter applicants view do not stay after a refresh - [PUR-36](https://mohammadqassim000.atlassian.net/browse/PUR-36): Favourites do not persist after refreshing. They also do not move to the top of the page.
  * Add OAuth Signup/Login - [PUR-44](https://mohammadqassim000.atlassian.net/browse/PUR-44): As a user, I want to sign up and log in using OAuth, so that I can easily access the application with my existing social media accounts.
    * Integrate OAuth SDK - [PUR-65](https://mohammadqassim000.atlassian.net/browse/PUR-65): Integrate the OAuth SDK (such as Google, Facebook, etc.) into the backend to enable OAuth authentication.
    * Develop OAuth Signup/Login API Endpoint - [PUR-66](https://mohammadqassim000.atlassian.net/browse/PUR-66): Create an API endpoint to handle OAuth signup and login requests, ensuring the user is authenticated and their session is managed appropriately.
    * Frontend Implementation - [PUR-67](https://mohammadqassim000.atlassian.net/browse/PUR-67): Add the OAuth signup/login buttons to the frontend and ensure they correctly initiate the OAuth flow and handle responses.
* Organization Accounts - [PUR-45](https://mohammadqassim000.atlassian.net/browse/PUR-45): As an organization, I want to display all jobs posted by my company and show who posted or edited each job posting, so that I can manage job listings and track user activity.
    * Store Posted-By/Edited-By Information - [PUR-68](https://mohammadqassim000.atlassian.net/browse/PUR-68): Implement functionality to store the information about who posted and edited each job posting in the database.
    * Display All Jobs for Company - [PUR-69](https://mohammadqassim000.atlassian.net/browse/PUR-69): Implement the functionality to display all job postings associated with the company in the organization's account view.
    * Show Posted-By/Edited-By Information - [PUR-70](https://mohammadqassim000.atlassian.net/browse/PUR-70): Develop the logic to display who posted and edited each job posting in the job listings for the organization's account.
* Dashboard pagination - [PUR-46](https://mohammadqassim000.atlassian.net/browse/PUR-46): As a job-seeker, I want to have pagination on the dashboard, so that I can navigate through job listings easily without overwhelming the page.
    * Implement Pagination in Frontend - [PUR-71](https://mohammadqassim000.atlassian.net/browse/PUR-71): Develop the pagination controls in the frontend to allow users to navigate through different pages of job listings.
    * Implement Pagination Logic in Backend - [PUR-72](https://mohammadqassim000.atlassian.net/browse/PUR-72): Develop the backend logic to handle pagination requests, returning the appropriate subset of job listings for each page.
* Applicant List pagination - [PUR-73](https://mohammadqassim000.atlassian.net/browse/PUR-73): As a recruiter, I want to have pagination on the dashboard, so that I can navigate through applicants easily without overwhelming the page.
    * Implement Pagination in Frontend - [PUR-74](https://mohammadqassim000.atlassian.net/browse/PUR-74): Develop the pagination controls in the frontend to allow users to navigate through different pages of applicants.
    * Implement Pagination Logic in Backend - [PUR-75](https://mohammadqassim000.atlassian.net/browse/PUR-75): Develop the backend logic to handle pagination requests, returning the appropriate subset of applicants for each page.
* Reformat the personal info, login, and landing page frontend to abide by Figma - [PUR-40](https://mohammadqassim000.atlassian.net/browse/PUR-40):
    - Make the landing page scale to size instead of being clipped to the bottom.
    - Make text in the input field of the login pages the default size.
    - Make the “Login“ text on the login page the default header size.
* Reformat the dashboard frontend to abide by Figma - [PUR-39](https://mohammadqassim000.atlassian.net/browse/PUR-39):
    - Make favourites star change colour to a lighter grey when hovered and not favourited
    - Add the containers to the dashboards.
    - Make the “select a job to see details text” the default size
* Cleanup Frontend terminal logs unused vars after compiling - [PUR-76](https://mohammadqassim000.atlassian.net/browse/PUR-76): Remove warnings when compiling the frontend.

#### Artifacts

 * Added OAuth sign up and login for both recruiters and job-seekers. 
 * Implemented organization accounts so that recruiters from the same company can view all company job postings. The user who posted and last edited the posting are also shown.
 * Implemented pagination for dashboards and applicant lists.
