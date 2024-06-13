# CSCC01 Final Term Project - Pursuiter

- [About Persuiter](#about-persuiter)
- [Installation](#installation)
- [Software Architecture](#software-architecture)
- [Contribution](#contribution)

## About Persuiter

Pursuiter is a revolutionary job board designed to enhance the job application process for both applicants and employers. By providing pre-application feedback, it ensures applicants are well-prepared, enhancing their chances for success. Additionally, by requiring applicants to meet minimum criteria set by employers, it guarantees that employers receive fewer, but more qualified applications.

## Installation

### Prerequisites

- Node.js (v22.2.0): [Download Node.js](https://nodejs.org/en/download/package-manager)
- MongoDB (v7.0.8): [Install MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/)
- MongoDB Compass: [Download MongoDB Compass GUI](https://www.mongodb.com/try/download/atlascli)

### Run backend

Run `cd backend` to navigate to the backend directory.

1. Install dependencies

```
npm install
```

2. Setup database directory

```
mkdir data
cd data
mkdir db
cd ..
```

3. Start MongoDB server. Note: command is OS specific. If `mongod` is not available globally, use the path to the executable file.

```
mongod --dbpath=./data/db
```

4. Run the application

```
npm run dev
```

### Run frontend

Run `cd frontend` to navigate to the frontend directory.

1. Install dependencies

```
npm install
```

2. Run the application

```
npm start
```

## Software Architecture

This projecy leverages the Model-View-Controller (MVC) architecture to ensure easier management and scalability of the application. Each layer of the architecture plays a distinct role:

- **Model**: The model layer is managed by a backend server (`server.js`) which interacts with MongoDB. This setup handles all data logic, including data retrieval, storage, and processing.
- **View**: The view layer consists of React components, all stored within the `components` folder. Components do not contain business logic; they solely focus on presentation and user interaction.
- **Controller**: Controllers handle the logic necessary for processing user requests and ensuring the correct data flows back to the user interface. All controller components are stored within the `controller` folder.

## Contribution

### Workflow

- **Branching Strategy**: Our project uses a structured Git flow. All development should take place in feature branches, which should be created from the `dev` branch. Branch names must follow the format `yourname-ticketnumber`.
- **Pull Requests (PRs)**: After completing development on a feature branch, create a pull request to the `dev` branch. The PR title should clearly state the purpose of the changes, and the description should reference the relevant issue or ticket number.
- **Code Reviews**: At least one peer review is required for each pull request. Reviewers should ensure that the changes meet all project standards.
- **Merging**: No direct commits to the `main` branch are allowed. At the end of each development sprint, the `dev` branch is merged into `main`. Ensure that `dev` is stable before performing the merge.

### Coding Standards

- **Code Style**: Ensure that your code follows the existing formatting, naming conventions, and comment practices to maintain consistency across the codebase.
- **Component Structure**: All React components should be placed in the `components` folder. Each component should have its own folder named using kebab-case (e.g., `applicant-dashboard`). Inside this folder, both the JavaScript file and its corresponding CSS file should share the same name, using CamelCase (e.g., `ApplicantDashboard.js` and `ApplicantDashboard.css`).
- **Controller Organization**: Controllers should be stored in the `controllers` folder and named using CamelCase to reflect their functionality clearly (e.g., `UserController.js`).
