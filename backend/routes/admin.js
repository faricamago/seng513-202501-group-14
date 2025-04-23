// routes/admin.js

import express from "express";
import * as adminController from "../controllers/adminController.js";

const router = express.Router();


router.get("/flagged-posts", adminController.getFlaggedPosts);


router.post("/approve-post", adminController.approvePost);

router.post("/delete-post", adminController.deletePost);

export default router;

