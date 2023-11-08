<h1>Home</h1>

<p>
  This website is a mandatory assignment for the class Full stack development
  with Node.js at KEA Computer Science 4th semester.
  <br />
  Purpose of assignment is to demonstrate skills in:
</p>
<div class="container">
  <ul class="homeUL">
    <li>Security: Authentication and authorization, handling passwords etc.</li>
    <li>Use of nodemailer.</li>
    <li>Use of database of own choice.</li>
    <li>Use of web framework</li>
    <li>Use of toasts</li>
  </ul>
</div>
<br />
<p>To implement this i've used:</p>
<div class="container">
  <ul class="homeUL">
    <li>Bcrypt for handling hashing and salting of passwords.</li>
    <li>Session</li>
    <li>MongoDB</li>
    <li>Etheral mail for nodemailer.</li>
    <li>Svelte</li>
  </ul>
</div>
<p>
  You can sign up with new user, login and reset password. There are two
  different roles, a admin and a user. For the signup you are set as a user pr.
  default. Admin is created when server starts if it does not already exist in
  DB.
  <br />
  There's a page for members (user and admin both) where address can be added and
  there's a admin page that gives you an overview of all users in db.
</p>
