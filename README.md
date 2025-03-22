# 📌 Component Hub

## 🌟 Overview
Component Hub is a full-stack web application designed to manage and showcase UI components created by users. It consists of a **frontend** built with Angular and a **backend** powered by Spring Boot using PostgreSQL as the database.


## 🏗️ Folder Structure
```
/project-root
│── CompHub/   # Backend
│── CompHub-ui/    # Frontend  
```

## 🚀 Tech Stack
- **Frontend:** Angular , PrimeNg 
- **Backend:** Spring Boot
- **Database:** PostgreSQL
- **Other Tools:** Docker

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/Thompson6626/ComponentHub.git
cd ComponentHub
```

### 2️⃣ Backend Setup
Navigate to the `CompHub/` directory and create a .env file and set up the environment variables then run:

```sh
docker-compose up
```

Then run the spring boot app:
```sh
cd CompHub

./mvnw spring-boot:run 
```


### 3️⃣ Frontend Setup
Navigate to the `CompHub-ui/` directory:
```sh
cd CompHub-ui
npm install  # Install dependencies
ng serve  # Start angular
```
Then access the `search` url because i currently have no landing page 🔨.

## 🛠️ Todos
- [ ] Add a landing page because it currently has none.
- [ ] Improve the search ui filter so that it updates when the user manually types the params.
- [ ] Small changes so that the database url can be changed to Neon or similar.
- [ ] Improve further the responsiveness of the frontend, because its lacking.




