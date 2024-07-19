1. [PUR-36](https://mohammadqassim000.atlassian.net/browse/PUR-36) Bug - Favorite applicants in recruiter applicants view do not stay after a refresh

Favourites do not persist after refreshing. They also do not move to the top of the page.

Priority: 1 - High

2. [PUR-44](https://mohammadqassim000.atlassian.net/browse/PUR-44) User Story - Add OAuth Signup/Login

As a user, I want to sign up and log in using OAuth, so that I can easily access the application with my existing social media accounts.

Acceptance criteria: Given that the user opts to sign up or log in via OAuth, when they choose a supported social media account, then their credentials are authenticated, and they are granted access to the application.

Priority: 3 - Low

a. [PUR-65](https://mohammadqassim000.atlassian.net/browse/PUR-65) Subtask - Integrate OAuth SDK

Integrate the OAuth SDK (such as Google, Facebook, etc.) into the backend to enable OAuth authentication.

Priority: 3 - Low

b. [PUR-66](https://mohammadqassim000.atlassian.net/browse/PUR-66) Subtask - Develop OAuth Signup/Login API Endpoint

Create an API endpoint to handle OAuth signup and login requests, ensuring the user is authenticated and their session is managed appropriately.

Priority: 3 - Low

c. [PUR-67](https://mohammadqassim000.atlassian.net/browse/PUR-67) Subtask - Frontend Implementation

Add the OAuth signup/login buttons to the frontend and ensure they correctly initiate the OAuth flow and handle responses.

Priority: 3 - Low

13. [PUR-45](https://mohammadqassim000.atlassian.net/browse/PUR-45) User Story - Organization Accounts

As an organization, I want to display all jobs posted by my company and show who posted or edited each job posting, so that I can manage job listings and track user activity.

Acceptance criteria: Given that a user accesses the organization account, when they view the job listings, then all jobs posted by the company are displayed along with the posted-by and edited-by information for each posting.

Priority: 2 - Medium

a. [PUR-68](https://mohammadqassim000.atlassian.net/browse/PUR-68) Subtask - Store Posted-By/Edited-By Information

Implement functionality to store the information about who posted and edited each job posting in the database.

Priority: 2 - Medium

b. [PUR-69](https://mohammadqassim000.atlassian.net/browse/PUR-69) Subtask - Display All Jobs for Company

Implement the functionality to display all job postings associated with the company in the organization's account view.

Priority: 2 - Medium

c. [PUR-70](https://mohammadqassim000.atlassian.net/browse/PUR-70) Subtask - Show Posted-By/Edited-By Information

Develop the logic to display who posted and edited each job posting in the job listings for the organization's account.

Priority: 2 - Medium

14. [PUR-46](https://mohammadqassim000.atlassian.net/browse/PUR-46) User Story - Dashboard pagination

As a job-seeker, I want to have pagination on the dashboard, so that I can navigate through job listings easily without overwhelming the page.

Acceptance criteria: Given that there are many job listings, when the user views the dashboard, then the listings are displayed in pages with navigation controls to move between pages.

Priority: 2 - Medium

a. [PUR-71](https://mohammadqassim000.atlassian.net/browse/PUR-71) Subtask - Implement Pagination in Frontend

Develop the pagination controls in the frontend to allow users to navigate through different pages of job listings.

Priority: 2 - Medium

b. [PUR-72](https://mohammadqassim000.atlassian.net/browse/PUR-72) Subtask - Implement Pagination Logic in Backend

Develop the backend logic to handle pagination requests, returning the appropriate subset of job listings for each page.

Priority: 2 - Medium

15. [PUR-73](https://mohammadqassim000.atlassian.net/browse/PUR-73) User Story - Applicant List pagination

As a recruiter, I want to have pagination on the dashboard, so that I can navigate through applicants easily without overwhelming the page.

Acceptance criteria: Given that there are many applicants, when the user views the dashboard, then the applicants are displayed in pages with navigation controls to move between pages.

Priority: 2 - Medium

a. [PUR-74](https://mohammadqassim000.atlassian.net/browse/PUR-74) Subtask - Implement Pagination in Frontend

Develop the pagination controls in the frontend to allow users to navigate through different pages of applicants.

Priority: 2 - Medium

b. [PUR-75](https://mohammadqassim000.atlassian.net/browse/PUR-75) Subtask - Implement Pagination Logic in Backend

Develop the backend logic to handle pagination requests, returning the appropriate subset of applicants for each page.

Priority: 2 - Medium

16. [PUR-40](https://mohammadqassim000.atlassian.net/browse/PUR-40) Task - Reformat the personal info, login, and landing page frontend to abide by Figma

- Make the landing page scale to size instead of being clipped to the bottom.
- Make text in the input field of the login pages the default size.
- Make the “Login“ text on the login page the default header size.

Priority: 3 - Low

17. [PUR-39](https://mohammadqassim000.atlassian.net/browse/PUR-39) Task - Reformat the dashboard frontend to abide by Figma

- Make favourites star change colour to a lighter grey when hovered and not favourited
- Add the containers to the dashboards.
- Make the “select a job to see details text” the default size

Priority: 3 - Low

18. [PUR-76](https://mohammadqassim000.atlassian.net/browse/PUR-76) Bug - Cleanup Frontend terminal logs unused vars after compiling

Remove warnings when compiling the frontend.

Priority: 3 - Low
