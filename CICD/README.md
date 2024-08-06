# README

## Overview

Pursuiter was pushed to GitLab and the CI/CD pipeline was set up to automate the deployment process. 

## Project Structure

.
├── backend
│ ├── package.json
│ ├── server.js
│ └── ...
├── frontend
│ ├── package.json
│ ├── src
│ │ ├── App.js
│ │ └── ...
├── Dockerfile-frontend
├── Dockerfile-backend
├── docker-compose.yml
└── README.md

## Setup and Installation

### Prerequisites

- Docker
- Docker Compose

### Steps

1. **Clone the Repository**

First, clone the repository:
    
    ```bash
    git clone https://gitlab.com/pursuiterteam/pursuiter.git
    ```

2. **Build the Docker Images**

Navigate to the project directory, and build the Docker images:

    ```bash
    cd pursuiter
    docker-compose up --build
    ```

3. **Access the Application**

Once the images are built, you can access the application at:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:4000](http://localhost:4000)
