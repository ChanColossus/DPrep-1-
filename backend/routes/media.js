// routes.js

const express = require('express');
const router = express.Router();
const upload = require("../utils/videoMulter");
const { newMedia,getMedia,getSingleMedia,deleteMedia,updateMedia } = require("../controllers/mediaController");
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');


router.post("/admin/media/new", upload.single("mvideo"), newMedia);
router.get("/media", getMedia);    
router.get("/media/:id", getSingleMedia);
router
  .route("/admin/media/:id", isAuthenticatedUser, 
  authorizeRoles("admin"))
  .put(upload.array("mvideo"), updateMedia)
  .delete(deleteMedia);
module.exports = router;



