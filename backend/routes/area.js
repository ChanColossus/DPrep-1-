
const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const {
    newArea, getArea,updateArea,deleteArea,getSingleArea
  } = require("../controllers/areaController");
const { isAuthenticatedUser,authorizeRoles } = require('../middlewares/auth');


router.post(
    "/admin/area/new",
    // isAuthenticatedUser,
    // authorizeRoles("admin"),
    upload.array("bimages", 10),
    newArea
  );
router.get("/area", getArea);
router
  .route("/admin/area/:areaId", isAuthenticatedUser, 
  authorizeRoles("admin"))
  .put(upload.array("bimages", 10), updateArea)
  .delete(deleteArea);
router.get("/area/:id", getSingleArea);
module.exports = router