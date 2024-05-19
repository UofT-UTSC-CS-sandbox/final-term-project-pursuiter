# CSCC01 Final Term Project - Pursuiter
## Prerequisites
- Node.js (v22.2.0): https://nodejs.org/en/download/package-manager
- MongoDB (v7.0.8): https://www.mongodb.com/docs/manual/administration/install-community/
- MongoDB Compass Download (GUI): https://www.mongodb.com/try/download/atlascli

## Run backend
Run `cd backend` to navigate to the backend directory. 
1. Install dependencies
```
npm install
```
2. Setup database cirectory
```
mkdir data
cd data
mkdir db
cd ..
```
3. Start MongoDB server
```
mongod --dbpath=./data/db
```
4. Run the application
```
npm run dev
```

## Run frontend
Run `cd frontend` to navigate to the frontend directory.
1. Install dependencies
```
npm install
```
2. Run the application
```
npm start
```