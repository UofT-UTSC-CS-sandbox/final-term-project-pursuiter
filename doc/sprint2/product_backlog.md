1. User story - Job seeker search

As a job seeker, I want to search for jobs, so that I can see jobs with particular description.

Acceptance criteria: Given that words are entered into the search bar, when the search button is pressed, then jobs that fit the search descriptions are displayed.

Priority: 3 - Low

a. Subtask - Implement Search Bar in Frontend

Develop the search bar component in the frontend, allowing users to enter search terms.

Priority: 3 - Low

b. Subtask - Develop Search API Endpoint

Create an API endpoint that handles search queries and returns job listings that match the search terms. Integrate the search bar with the backend API, ensuring the frontend displays the search results correctly.

Priority: 3 - Low

2. User story - Employer applications search

As an employer, I want to search for specific things via the search bar in my applications, so that I can see applicants with matching qualifications.

Acceptance criteria: Given that the search bar has been filled with something, when the search button is pressed,
then the employer will be able to view all the applicants that have the matching qualifications.

Priority: 3 - Low

a. Subtask - Implement Search Bar in Frontend

Develop the search bar component in the frontend, allowing users to enter search terms.

Priority: 3 - Low

b. Subtask - Develop Search API Endpoint

Create an API endpoint that handles search queries and returns applicants that match the search terms. Integrate the search bar with the backend API, ensuring the frontend displays the search results correctly.

Priority: 3 - Low

3. User Story - Job seeker search filter

As a job seeker, I want to filter jobs using a “filters” section, so that I see certain types of jobs.

Acceptance criteria: Given that filters are set, when looking at the list of jobs, then only the jobs that match the filters are displayed.

Priority: 3 - Low

a. Subtask - Develop Filter UI in Frontend

Create the filter section in the frontend, allowing users to select various filter options.

Priority: 3 - Low

b. Subtask - Implement Filter Logic in Backend

Develop the logic in the backend to handle filter options and return job listings that match the selected filters. Connect the frontend filter options with the backend logic, ensuring the job listings are filtered according to the selected criteria.

Priority: 3 - Low

4. User Story - Employer applications filtering

As an employer, I want to use filters for my applicants such as experience, education etc., so that I can efficiently sort by matching qualifications.

Acceptance criteria: Given that the applicant filters are selected, when looking at the "Applicants" list,
then the employer will be able to view all the applicants that have the matching qualifications.

Priority: 3 - Low

a. Subtask - Develop Filter UI in Frontend

Create the filter section in the frontend, allowing users to select various filter options.

Priority: 3 - Low

b. Subtask - Implement Filter Logic in Backend

Develop the logic in the backend to handle filter options and return job listings that match the selected filters. Connect the frontend filter options with the backend logic, ensuring the job listings are filtered according to the selected criteria.

Priority: 3 - Low

5. User Story - Job seeker application tracking

As a job seeker, I want to receive updates on the statuses of my applications, so that I can track them.

Acceptance criteria: Given that the job seeker applied to a job, when updates by the employer occur, then the job seeker is shown them under their “applications” section.

Priority: 2 - Medium

a. Subtask - Develop Backend Logic for Application Status Updates

Implement the backend logic to track and update the statuses of job applications based on employer updates.

Priority: 2 - Medium

b. Subtask - Integrate Status Updates into User’s Application Section

Ensure that updates from the backend are reflected in the job seeker’s “Applications” section in the frontend.

Priority: 2 - Medium

6. User Story - Employer edit applicant status

As an employer, I want to edit applicant status for my applicants, so that potential employees can see their progress within the application.

Acceptance criteria: Given that the application status is specified by the employer, when the application is viewed by either the applicant or the employer, then the application status is displayed.

Priority: 3 - Low

a. Subtask - Develop Backend Logic for Editing Application Status

Implement the backend logic to allow employers to edit the status of job applications.

Priority: 3 - Low

b. Subtask - Integrate Status Updates into Frontend

Ensure that the updated status is reflected in both the employer’s and applicant’s view in the frontend.

Priority: 3 - Low

7. Task - Implement the Applied-To tab

After a successful application to a job, the user should be able to go to a separate tab of applied jobs and be able to see the list of applied jobs there.

Priority: 2 - Medium

8. Bug - Applied_on date not showing

Date is not stored in the database.

Priority: 1 - High

9. Bug - New job button opens prefilled form if edit button previously pressed

Changing a selected posting and clicking new job opens a pre-filled form with info from previously selected job posting.

Priority: 1 - High

10. Bug - Modal overlay does not cover navbar

The modal does not cover the navbar section of the screen. So, when scrolling down, any content that is now in place of the navbar is not covered by the modal overlay.

Priority: 3 - Low

11. Bug - Favorite applicants in recruiter applicants view do not stay after a refresh

Favourites do not persist after refreshing. They also do not move to the top of the page.

Priority: 1 - High

12. User Story - Add OAuth Signup/Login

As a user, I want to sign up and log in using OAuth, so that I can easily access the application with my existing social media accounts.

Acceptance criteria: Given that the user opts to sign up or log in via OAuth, when they choose a supported social media account, then their credentials are authenticated, and they are granted access to the application.

Priority: 3 - Low

a. Subtask - Integrate OAuth SDK

Integrate the OAuth SDK (such as Google, Facebook, etc.) into the backend to enable OAuth authentication.

Priority: 3 - Low

b. Subtask - Develop OAuth Signup/Login API Endpoint

Create an API endpoint to handle OAuth signup and login requests, ensuring the user is authenticated and their session is managed appropriately.

Priority: 3 - Low

c. Subtask - Frontend Implementation

Add the OAuth signup/login buttons to the frontend and ensure they correctly initiate the OAuth flow and handle responses.

Priority: 3 - Low

13. User Story - Organization Accounts

As an organization, I want to display all jobs posted by my company and show who posted or edited each job posting, so that I can manage job listings and track user activity.

Acceptance criteria: Given that a user accesses the organization account, when they view the job listings, then all jobs posted by the company are displayed along with the posted-by and edited-by information for each posting.

Priority: 2 - Medium

a. Subtask - Store Posted-By/Edited-By Information

Implement functionality to store the information about who posted and edited each job posting in the database.

Priority: 2 - Medium

b. Subtask - Display All Jobs for Company

Implement the functionality to display all job postings associated with the company in the organization's account view.

Priority: 2 - Medium

c. Subtask - Show Posted-By/Edited-By Information

Develop the logic to display who posted and edited each job posting in the job listings for the organization's account.

Priority: 2 - Medium

14. User Story - Dashboard pagination

As a job-seeker, I want to have pagination on the dashboard, so that I can navigate through job listings easily without overwhelming the page.

Acceptance criteria: Given that there are many job listings, when the user views the dashboard, then the listings are displayed in pages with navigation controls to move between pages.

Priority: 2 - Medium

a. Subtask - Implement Pagination in Frontend

Develop the pagination controls in the frontend to allow users to navigate through different pages of job listings.

Priority: 2 - Medium

b. Subtask - Implement Pagination Logic in Backend

Develop the backend logic to handle pagination requests, returning the appropriate subset of job listings for each page.

Priority: 2 - Medium

15. User Story - Applicant List pagination

As a recruiter, I want to have pagination on the dashboard, so that I can navigate through applicants easily without overwhelming the page.

Acceptance criteria: Given that there are many applicants, when the user views the dashboard, then the applicants are displayed in pages with navigation controls to move between pages.

Priority: 2 - Medium

a. Subtask - Implement Pagination in Frontend

Develop the pagination controls in the frontend to allow users to navigate through different pages of applicants.

Priority: 2 - Medium

b. Subtask - Implement Pagination Logic in Backend

Develop the backend logic to handle pagination requests, returning the appropriate subset of applicants for each page.

Priority: 2 - Medium

16. Task - Reformat the personal info, login, and landing page frontend to abide by Figma

- Make the landing page scale to size instead of being clipped to the bottom.
- Make text in the input field of the login pages the default size.
- Make the “Login“ text on the login page the default header size.
- Put a little padding on the left side of the login pages for bigger screens (implement scaling to bigger screen sizes)
- Edit the text on the login page that redirects to the create account pages to not say the same thing twice

Priority: 3 - Low

17. Task - Reformat the dashboard frontend to abide by Figma

- Make favourites star change colour to a lighter grey when hovered and not favourited
- Add the containers to the dashboards.
- Add the frontend buttons for switching between available and applied-to jobs.
- Add the page names to the top of the page (ex. “Jobs” on the job view page).
- Make the “select a job to see details text” the default size

Priority: 3 - Low

18. Bug - Cleanup Frontend terminal logs unused vars after compiling

After compiling the frontend. There are a couple of warnings of unused variables. It is better off cleaning the code and remove any unused variables.

Priority: 3 - Low
