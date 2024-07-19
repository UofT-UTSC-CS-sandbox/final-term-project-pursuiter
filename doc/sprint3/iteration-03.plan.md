# Pursuiter

## Iteration 03

 * Start date: 08/07/2024
 * End date: 19/07/2024

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

  * Employer applications filtering - [PUR-18](https://mohammadqassim000.atlassian.net/browse/PUR-18): As an employer, I want to use filters for my applicants such as experience, education etc., so that I can efficiently sort by matching qualifications.
    * Develop Filter UI in Frontend - [PUR-59](https://mohammadqassim000.atlassian.net/browse/PUR-59): Create the filter section in the frontend, allowing users to select various filter options.
    * Implement Filter Logic in Backend - [PUR-60](https://mohammadqassim000.atlassian.net/browse/PUR-60): Develop the logic in the backend to handle filter options and return job listings that match the selected filters. Connect the frontend filter options with the backend logic, ensuring the job listings are filtered according to the selected criteria.
* Job seeker search filter - [PUR-6](https://mohammadqassim000.atlassian.net/browse/PUR-6): As a job seeker, I want to filter jobs using a “filters” section, so that I see certain types of jobs.
    * Develop Filter UI in Frontend - [PUR-57](https://mohammadqassim000.atlassian.net/browse/PUR-57): Create the filter section in the frontend, allowing users to select various filter options.
    * Implement Filter Logic in Backend - [PUR-58](https://mohammadqassim000.atlassian.net/browse/PUR-58): Connect the frontend filter options with the backend logic, ensuring the job listings are filtered according to the selected criteria.
* Employer applications search - [PUR-17](https://mohammadqassim000.atlassian.net/browse/PUR-17): As an employer, I want to search for specific things via the search bar in my applications, so that I can see applicants with matching qualifications.
    * Implement Search Bar in Frontend - [PUR-55](https://mohammadqassim000.atlassian.net/browse/PUR-55): Develop the search bar component in the frontend, allowing users to enter search terms.
    * Develop Search API Endpoint - [PUR-56](https://mohammadqassim000.atlassian.net/browse/PUR-56): Create an API endpoint that handles search queries and returns applicants that match the search terms. Integrate the search bar with the backend API, ensuring the frontend displays the search results correctly.
* Job seeker search - [PUR-4](https://mohammadqassim000.atlassian.net/browse/PUR-4): As a job seeker, I want to search for jobs, so that I can see jobs with particular description.
    * Implement Search Bar in Frontend - [PUR-53](https://mohammadqassim000.atlassian.net/browse/PUR-53): Develop the search bar component in the frontend, allowing users to enter search terms.
    * Develop Search API Endpoint - [PUR-54](https://mohammadqassim000.atlassian.net/browse/PUR-54): Create an API endpoint that handles search queries and returns job listings that match the search terms. Integrate the search bar with the backend API, ensuring the frontend displays the search results correctly.
* Job seeker application tracking - [PUR-10](https://mohammadqassim000.atlassian.net/browse/PUR-10): As a job seeker, I want to receive updates on the statuses of my applications, so that I can track them.
    * Develop Backend Logic for Application Status Updates - [PUR-61](https://mohammadqassim000.atlassian.net/browse/PUR-61): Implement the backend logic to track and update the statuses of job applications based on employer updates.
    * Integrate Status Updates into User’s Application Section - [PUR-62](https://mohammadqassim000.atlassian.net/browse/PUR-62): Ensure that updates from the backend are reflected in the job seeker’s “Applications” section in the frontend.
* Employer edit applicant status - [PUR-21](https://mohammadqassim000.atlassian.net/browse/PUR-21): As an employer, I want to edit applicant status for my applicants, so that potential employees can see their progress within the application.
    * Develop Backend Logic for Editing Application Status - [PUR-63](https://mohammadqassim000.atlassian.net/browse/PUR-63): Implement the backend logic to allow employers to edit the status of job applications.
    * Integrate Status Updates into Frontend - [PUR-64](https://mohammadqassim000.atlassian.net/browse/PUR-64): Ensure that the updated status is reflected in both the employer’s and applicant’s view in the frontend.
* Apply to waitlist - [PUR-79](https://mohammadqassim000.atlassian.net/browse/PUR-79): As a job-seeker, I want to see when I do not qualify for a job and apply to the waitlist. 
    * Implement frontend - [PUR-81](https://mohammadqassim000.atlassian.net/browse/PUR-81): When a user is not qualified for a job, show the warning message and change the button to “Apply to Waitlist”.
    * Link backend - [PUR-82](https://mohammadqassim000.atlassian.net/browse/PUR-82): Given that a user does not qualify for a job and applies to the waitlist, their application is added to the applications collection with type “waitlist”.
* View waitlist applicants - [PUR-80](https://mohammadqassim000.atlassian.net/browse/PUR-80): As a recruiter, I want to be able to see applicants who do not qualify and are waitlisted in the “Waitlist” tab. 
* Cover Letter functionality - [PUR-84](https://mohammadqassim000.atlassian.net/browse/PUR-84): As a job-seeker, I want to upload cover letters to my job applications so I can submit a complete application package to employers. 
    * Add the cover letter to the database - [PUR-85](https://mohammadqassim000.atlassian.net/browse/PUR-85): Cover letter should be stored in the database. 
    * Implement Applicant Ai descriptions based on the cover letter - [PUR-86](https://mohammadqassim000.atlassian.net/browse/PUR-86): AI descriptions should be based on cover letters rather than resumes. 
    * Add the cover letter on the frontend - [PUR-87](https://mohammadqassim000.atlassian.net/browse/PUR-87): User should be able to add a cover letter in the application submission modal.
* Add missing skills when not qualified - [PUR-78](https://mohammadqassim000.atlassian.net/browse/PUR-78): As a job-seeker, if I am not qualified for a job, I want to see the skills that I am missing to become eligible so that I can work on and add them to my skillset. 
* Tab switching reloading takes too long - [PUR-83](https://mohammadqassim000.atlassian.net/browse/PUR-83): Switching between the New Jobs and My Applications tab on the dashboard takes too long to load.
* New job button opens prefilled form if edit button previously pressed - [PUR-41](https://mohammadqassim000.atlassian.net/browse/PUR-41): Changing a selected posting and clicking new job opens a pre-filled form with info from previously selected job posting.
* Applied_on date not showing - [PUR-35](https://mohammadqassim000.atlassian.net/browse/PUR-35): Date is not stored in the database.
* Modal overlay does not cover navbar - [PUR-43](https://mohammadqassim000.atlassian.net/browse/PUR-43): The modal does not cover the navbar section of the screen. So, when scrolling down, any content that is now in place of the navbar is not covered by the modal overlay. 
* Add confirmation to minimum qualifications - [PUR-88](https://mohammadqassim000.atlassian.net/browse/PUR-88): Add description to minimum qualifications in application modal and confirmation popup when adding the job to clarify that applicants who do not match these qualifications will not be eligible to apply and can only apply to the waitlist. 


#### Artifacts

 * Added "My Applications" tab on the dashboard to be able to track applications and their statuses.  
 * Implemented status change so recruiters can change the status of applications. 
 * Added search and filters for job applications so users can find any postings they want with ease. 
 * Added srach and filters for applicants so recruiters can find applicants they want with ease. 
 * Added waitlist functionality so job-seekers who do not qualify for a job can still apply to be waitlisted. Recruiters can view waitlisted applicants in a separate tab on the recruiter dashboard.
 * Added support for cover letters. Users can now upload cover letters with their applications. The AI generated description on the recruiter's page will be a summary of the cover letter rather than the resume. 
