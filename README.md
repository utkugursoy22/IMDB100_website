Movie Rating and Watchlist Application

Project Overview
This project is a web application that allows users to view movie details, add movies to their watchlist, and rate movies. The application is built using Node.js with Express.js for the backend and MySQL as the database. The frontend uses HTML, CSS, and JavaScript. The application also supports user registration and login, with session management to track user activities.

Features
User Registration and Login:

Users can register with their name, surname, email, password, country, and city.
Passwords are hashed using bcrypt for security.
Users can log in using their email and password.
Sessions are used to maintain the user's logged-in state.

Movie Management:

Users can view details of movies, including title, description, trailer, and popularity score.
A search functionality allows users to search for movies by title, description, or actor names.
Watchlist:

Logged-in users can add movies to their watchlist.
The watchlist status is saved in the database and persists across sessions.
The watchlist button updates dynamically to reflect the movie's status (added or not).
Rating System:

Users can rate movies, with a rating between 1 and 10.
The average rating for each movie is displayed.
Ratings are saved in the database and can be updated by the users.

Data Model
Tables
users:

id: INT, Primary Key, Auto Increment
name: VARCHAR(255)
surname: VARCHAR(255)
email: VARCHAR(255), Unique
password: VARCHAR(255)
country: VARCHAR(255)
city: VARCHAR(255)
movies:

id: INT, Primary Key, Auto Increment
name: VARCHAR(255)
desc_english: TEXT
desc_turkish: TEXT
image: VARCHAR(255)
trailer: VARCHAR(255)
actor1_name: VARCHAR(255)
actor1_photo: VARCHAR(255)
actor2_name: VARCHAR(255)
actor2_photo: VARCHAR(255)
actor3_name: VARCHAR(255)
actor3_photo: VARCHAR(255)
actor4_name: VARCHAR(255)
actor4_photo: VARCHAR(255)
actor5_name: VARCHAR(255)
actor5_photo: VARCHAR(255)
watchlist:

id: INT, Primary Key, Auto Increment
user_id: INT, Foreign Key to users.id
movie_id: INT, Foreign Key to movies.id
ratings:

id: INT, Primary Key, Auto Increment
user_id: INT, Foreign Key to users.id
movie_id: INT, Foreign Key to movies.id
rating: INT
Assumptions
Users are unique based on their email addresses.
Each user can rate a movie only once, but they can update their rating.
Only logged-in users can add movies to their watchlist or rate movies.
Movie details, including actors, are pre-populated in the database.
Problems Encountered
Session Management:

Managing user sessions was challenging. Ensuring that user states (logged in or not) persist across different pages required careful handling of session cookies and server-side session management.
Integrating session management with Express.js and ensuring that the session data was consistent across various API endpoints required significant effort.
Frontend-Backend Integration:

Synchronizing the watchlist status and rating features between the frontend and backend was complex. Ensuring that the frontend correctly reflected the backend data involved handling asynchronous operations and updating the UI dynamically.
Handling user feedback (e.g., showing whether a movie is already in the watchlist or displaying the average rating) required careful integration of API responses with the frontend code.
Database Design:

Designing the database schema to support multiple features (user management, movie details, watchlist, and ratings) while ensuring data integrity and efficiency required thoughtful planning.
Ensuring that database queries were optimized and that relationships between tables (e.g., users and movies through ratings and watchlists) were correctly implemented was crucial for performance.


GOOGLE DRIVE LINK: https://drive.google.com/file/d/17owJAjD_h6U19eaQ4tl6zUfff7FoKys4/view?usp=drive_link
