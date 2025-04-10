// routes/admin.js

import express from "express";
import * as adminController from "../controllers/adminController.js";

const router = express.Router();

// Optionally, protect these routes with an admin authentication middleware
// const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware");
// router.use(adminAuthMiddleware);

// Endpoint to fetch flagged posts
router.get("/flagged-posts", adminController.getFlaggedPosts);

// Endpoint to approve a flagged post (set reported to false)
router.post("/approve-post", adminController.approvePost);

// Endpoint to delete a flagged post
router.post("/delete-post", adminController.deletePost);

export default router;

