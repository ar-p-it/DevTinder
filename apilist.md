# Devtinder API

### authRouter

POST /signup
POST /login
POST /logout

### profileRouter

-GET /profile/view
-PATCH /profile/edit
PATCH /profile/password

### connectionRequestRouter

-POST /request/send/interested/:userId
-POST /request/send/ignored/:userId
-POST /request/send/accepted/:requestId
-POST /request/send/rejected/requestId

<!-- *{Dynamic} -->

-POST /request/send/:status/requestId
-POST//request/review/accepted/695e3888699427800106a9b0

<!-- *{Dynamic} -->



-get user/request/received
-get user/requests/connections

### userRouter

GET /user/connection
GET /user/requests
GET /user/feed

### Status: Ignore,interested,rejected,accepted
