# Yeetup

https://meetup-au8t.onrender.com

A social networking site allowing for users to come together to form groups based on common interests as well as creating and attending events.

Technologies Used:
 *  Sequelize
 *  Express.js
 *  REACT 18
 *  Redux 4.2.1
 *  PostgreSQL
 
General flow of Yeetup is as follows:
 * Users registers or logs in
 * User can view groups and events as well as create them
 * User can update and delete groups and events
 
 TODO: Implement update feature for events as well as CRUD operations for venues and attendances.

To launch the application locally:
* Clone the repository
* Open the root folder and type "npm install" to install root dependencies
* Open the backend folder and type "npm i && npx dotenv sequelize-cli db:migrate && npx dotenv sequelize-cli db:seed:all && npm start" to install backend dependencies
* Open the frontend folder and type "npm i" to install frontend dependencies
* Inside the backend folder, type "npm start" to start the express server on localhost:8000
* Inside the frontend folder, type "npm start" to start the react frontend server on localhost:3000
* The application should now be running!


![main_image](https://github.com/CheadleCheadle/Yeetup/assets/108553712/4fb5559b-4805-47a5-9424-3f66634a9578)


If you wish to stop using the application, you can close it by hitting ctrl + c inside of both the backend and frontend folders.
