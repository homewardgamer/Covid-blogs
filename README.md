# Covid-Blogs
## [Visit here](https://covid-blogs.herokuapp.com/)
### A backend centric webApp that enables users to share their covid experience to the world.

# How to run it locally?
### Clone the Repo `git clone <repo_link>`
### Use `npm install` to install all the dependencies
### Run the command `node app.js`
### The server will be running at [localhost:3000](https://localhost:3000)
### NOTE : You have to set up a .env file in order to ensure proper functioning.

# Features
* ### Create delete and edit your posts anytime.
* ### Comment and like other users posts.
* ### Visit other user's profile and see their posts and liked posts.
* ### Login from Google OAuth2.0
* ### Filter posts by posted today and liked posts
* ### Sort posts in ascending and descending order of date, comments and likes.
* ### Enabling cookies & sessions so no need to login everytime you visit until your browser is open.
* ### Hashing and salting is implemented to ensure passwords are safe even in the database.

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
 
 # Routes
 

 
 ### `GET /login`
 
res
* status : 201

---
 ### `GET /register`
 
res
* status : 201

 
 ### `GET /home?key=value`
 
 key,value : 
 
 * sort = {likesasc , likesdsc , commentasc , commentdsc , dateasc ,datedsc}
 * filter = {liked , today}
 
 
 req 
 * body {isAuthenticated(),user}
 
 res
 
 * body :  {posts , user}
 * status : 201
 
 ---
 
 ### `GET /posts/:userid/new`
 
 res
 * body : {user}
 * status : 201

---

### `GET /posts/:userid/myposts`

req
* body : {isAuthenticated(),params = userid}

req

* body : {posts,userid}
* status : 201

---
### `GET /posts/:postid/:userid`

req
* body : {isAuthenticated()}
* params : {userid , postid}

req

* body : {post,userid}
* status : 201

---

### `GET /user/:userid/:visitorid/profile`

req
* body : {isAuthenticated()}
* params : userid , visitorid

req

* body : {user, likedPostsArr , visitorid , posts }
* status : 201

---

### `GET /posts/:userid/:postid/edit`

req
* body : {isAuthenticated()
* params : {userid , postid}

req

* body : {post,userid}
* status : 201

---
# POST

 ### `POST /login`
 
 req 
 * body
    * required {username,password}


 res
 * body
    * status :  201
    * body  : {sessionToken , user}
 
 ---
 
### `POST /register`

 req 
 * body : {username,password}


 res
 * body
    * status :  200
    * body  : {sessionToken , user}


 ---

### `POST /posts/:postid/:userid/like`

req
* params : {postid,userid}

res
* status : 200

function : increases the likesCount by one and adds the postid to user's likedPosts ,if postid is not in user's likedPosts.

---
### `POST /posts/:postid/:userid/comment`

req
* params : {postid,userid}
* body : {comment}

res
* status : 200

function : pushes the comment in the Post's comments Array.

---
### `POST /posts/:postid/edit`

req
* params : {postid}
* body : {isAuthenticated(), title , body}

res
* status : 200

function : updates the post with the title and the body.
 
---

### `POST /posts/:userid/new`

req
* params : {userid}
* body : {title,body}

res
* status : 200

function : adds new post to the database

---
### `POST /posts/:postid/delete`

req 
* params : {postid}
* body : {isAuthenticated()}

res
* status : 200

function : removes post from  the database

---






 
 
 
