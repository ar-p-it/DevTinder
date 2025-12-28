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

### userRouter
GET /user/connection
GET /user/requests
GET /user/feed

### Status: Ignore,interested,rejected,accepted