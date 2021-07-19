# Covid-Blogs
## [Visit here](https://covid-blogs.herokuapp.com/)
### A backend centric webApps that enables users to share their covid experience to the world.

# How to run it locally?
### Clone the Repo `git clone https://github.com/homewardgamer/homewardgamer-WebD-Round2.git`
### Use `npm install` to install all the dependencies
### Run the command `node app.js`
### The server will be running at [localhost:3000](https://localhost:3000)
### NOTE : You have to set up a .env file in order to ensure proper functioning.

# Features
### Create delete and edit your posts anytime.
### Comment and like other users posts.
### View other user's profile and see their posts and liked posts.
### Login from google OAuth2.0
### Filter posts by posted today and liked posts
### Sort posts in ascending and descending order of date, comments and likes.
### Enabling sessions so no need to login everytime you visit until your browser is open.
### hashing and salting is also implemented so your passwords are safe even in the database.

# User Schema 
<table>
  <tr>
    <td>Username</td>
    <td>String</td>
  </tr>
  <tr>
    <td>Password</td>
    <td>String</td>
  </tr>
  <tr>
    <td>Liked Posts</td>
    <td>Array[String]</td>
  </tr>
 </table>
 
 # Post Schema
 
 <table>
  <tr>
    <td>Title</td>
    <td>String</td>
  </tr>
  <tr>
    <td>Body</td>
    <td>String</td>
  </tr>
  <tr>
    <td>Author</td>
    <td>String</td>
  </tr>
  <tr>
    <td>Likes</td>
    <td>Number</td>
  </tr>
    <tr>
    <td>Comments</td>
    <td>Array[{body : String , date : Date}]</td>
  </tr>
  <tr>
    <td>date</td>
    <td>Date</td>
  </tr>
  <tr>
    <td>userID</td>
    <td>String</td>
  </tr>
 </table>
 
 
 
