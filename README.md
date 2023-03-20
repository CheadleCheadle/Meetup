# Yeetup

https://meetup-au8t.onrender.com

Yeetup is a meetup clone looking to replicate the functionality and features of the website Meetup. Yeetup currently allows for groups to created, updated, and deleted as well as events to be created and deleted.

Technologies Used:
 * ORM: Sequelize
 * Backend: Express.js
 * Frontend: REACT 18
 * State manager: Redux 4.2.1
 * Development RDBMS: Sqlite3
 * Production RDBMS: Postgresql
 
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

![meetup-landing](https://user-images.githubusercontent.com/108553712/226253222-ada3c36f-ed14-437c-a24e-15c428a52361.PNG)


If you wish to stop using the application, you can close it by hitting ctrl + c inside of both the backend and frontend folders.
