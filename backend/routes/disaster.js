
const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const {
    newDisaster,getDisaster,updateDisaster,deleteDisaster,getSingleDisaster
  } = require("../controllers/disasterController");
const { isAuthenticatedUser,authorizeRoles } = require('../middlewares/auth');

router.post(
    "/admin/disaster/new",
    isAuthenticatedUser,
    // authorizeRoles("admin"),
    upload.array("images", 10),
    newDisaster
  );
router.get("/disasters", getDisaster);
router
  .route("/admin/disaster/:id", 
   isAuthenticatedUser) 
  // authorizeRoles("admin"))
  .put(upload.array("images", 10), updateDisaster)
  .delete(deleteDisaster);
router.get("/disasters/:id", getSingleDisaster);
module.exports = router;