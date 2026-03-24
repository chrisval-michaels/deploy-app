# Exercise Set 7 - Persistent logins with sessions and cookies


# Task 1 –Session-based authentication 
Implementation
User Model – kept from previous version, now with optional role field (default 'user').

Passport Strategy – local strategy using email and password.
Serialization stores only the user ID; deserialization fetches the full user document.

Session Middleware – added in app.js:

Auth Middleware – isAuthenticated checks req.isAuthenticated().

Routes:

POST /users/register – public, creates user.
![Register](screenshots/user%20role(admin).png)
POST /users/login – public, authenticates and starts session.
![Register](screenshots/must%20login%20with%20cookies.png)
![Register](screenshots/cookies%20generated%20after%20logein.png)

GET /users/logout – destroys session.
![Register](screenshots/loged%20out.png)

GET /albums and GET /albums/:id – public.
![Register](screenshots/readfull%20album(public).png)

POST /albums, PUT /albums/:id, DELETE /albums/:id – protected by isAuthenticated.

![Register](screenshots/forbiden%20.png)



# Task 2 – User Roles & Authorization

User Model – added role field (enum ['user', 'admin'], default 'user').
Existing users updated with default role via MongoDB script.

Album Model – includes userId (reference to User), set during album creation.

Middleware – isOwnerOrAdmin in auth.js:
Album Routes – protected with isAuthenticated + isOwnerOrAdmin for PUT and DELETE.

User Routes (Admin only) – optionally added:

GET /users – list all users (admin only)
![Register](screenshots/get%20all%20users.png)

GET /users ID– a single user(admin only)
![Register](screenshots/get%20single%20user.png)

DELETE /users/:id – delete a user (admin only)
![Register](screenshots/delete%20user.png)

Protected by isAuthenticated + custom isAdmin middleware.