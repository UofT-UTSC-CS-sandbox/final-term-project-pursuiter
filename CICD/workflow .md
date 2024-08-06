# Pursuiter workflow

#### Continuous Integration (CI)

* **Version Control**: Git is used to track and merge changes
* **Testing**: Supertest has been chosen for unit tests

#### Continuous Deployment (CD)

* **DockerHub**: using docker compose to deply the app after successfull testing.

### Deployment Workflow

1. **Commit**: Software engineers push changes to the repository
2. **Docker Build**: Docker images are built for the frontend & backend
3. **Testing**: Unit tests are executed on the built docker images.
4. **Push**: After successful testing, the docker images are pushed to their correspeding images.
3. **Deployment**: The deployment script (on Azure) gets the latest Docker images and runs the application containers as a web application.


