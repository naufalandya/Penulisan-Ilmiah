import { featureControllerv1 } from "@/controllers/v1/index.controller";
import express, { type Router } from "express";
import { verifytoken } from "@/middlewares/auth.middleware";
//TODO : rate-limiter, verifytoken ☑, checkrole, add validator, redis cache for get

const feature : Router = express.Router()
    //user-related
    //user
    .get('/user', verifytoken, featureControllerv1.getUserProfileController)
    .patch('/user', verifytoken, featureControllerv1.editUserInfoController)
    //feed
    .post('/post', verifytoken, featureControllerv1.createPostController)
    .get('/post', verifytoken, featureControllerv1.getPostController)
    .get('/learn', verifytoken, featureControllerv1.feedByFollowingController)
    .get('/speech', verifytoken, featureControllerv1.feedByTagsController)
    .patch('/tag', verifytoken, featureControllerv1.editUserTagsController)
    //react
    .post('/like', verifytoken, featureControllerv1.likePostController)
    .delete('/like', verifytoken, featureControllerv1.unlikePostController)
    //activities-post
    .post('/reminders', verifytoken, featureControllerv1.createReminderController)
    .post('/diary', verifytoken, featureControllerv1.createDiaryController)
    // .post('/notes', verifytoken, featureControllerv1.createNoteController)
    .post('/random-quotes', verifytoken, featureControllerv1.createRandomQuoteController)
    //activities-get
    .get('/reminders', verifytoken, featureControllerv1.getRemindersController)
    .get('/diary', verifytoken, featureControllerv1.getDiaryController)
    // .get('/notes', verifytoken, featureControllerv1.getNotesController)
    .get('/random-quotes', verifytoken, featureControllerv1.getRandomQuotesController)
    //by-id

export default feature




