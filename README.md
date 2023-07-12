# MERN-CHAT-APP: Chat/\App
A Real-Time Chatting Application build with MERN stack. Equiped with Web Sockets, Notifications, Search, Profile view and many more.

## Types of Chats
* Individual Chat
* Group Chat

## User Permissions
* making an account is required
* can search for other users

## Features
* Real Time Application
* Notification Features
* Encryption

## View live App

Hosted at **NA**


## Tech Stack Used

### The MERN Stack

* [MongoDB](https://docs.mongodb.com/) - Document database - to store data as JSON 
* [Express.js](https://devdocs.io/express/) - Back-end web application framework running on top of Node.js
* [React](https://reactjs.org/docs/) - Front-end web app framework used
* [Node.js](https://nodejs.org/en/docs/) - JavaScript runtime environment 

### Middleware

* [Mongoose](https://mongoosejs.com/docs/guide.html) - ODM for MongoDB

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Your machine should have npm and node.js installed to use it locally.

### Setup and Installation


1. First fork the repo to your account.  
   Go to the forked repo and clone it to your local machine:

```sh
git clone https://github.com/AKSourav/MERN-CHAT-APP.git
```

This will make a copy of the code to your local machine.

2. Move to `backend` folder and install all the necessary dependencies by the following command:

```sh
cd backend
npm install --legacy-peer-deps
cd ..
```

3. Move to `frontend` folder and install all the necessary dependencies by the following command:

```sh
cd client
npm install --legacy-peer-deps
cd ..
```

4. Create a `.env` file in the `MERN-CHAT-APP` directory and add the following

```sh
MONGODB_URL=YOUR_MONGODB_URL
```

### Run locally

Run the below command to start the app:

```sh
npm run dev
```
* The **backend** runs on port **5000**
* The **frontend** side runs on port **3000**
* Both client and server must run **concurrently.**
**Go to: [http://localhost:3000](http://localhost:3000)**


## Deployment

1. Add the following lines to server.js :

```(JavaScript)
// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
  
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }
```
2. Add the following script to the package.json of server

```(JSON)
"heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client"
```

3. Install Heroku CLI and make sure you have intialised a git repository in the project directory. Enter the following commands in the terminal :

```(bash)
heroku login
heroku create
git add .
git commit -am "Deployed to Heroku"
git push heroku master
```
4. Open your heroku account and in settings configure **MongoURI** variable.
5. Open your heroku account and click on **Open App** option in the dashboard.