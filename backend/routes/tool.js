
const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const {
  newTool,getTool,updateTool,deleteTool,getSingleTool,calculateScore
  } = require("../controllers/toolController");
const { isAuthenticatedUser,authorizeRoles } = require('../middlewares/auth');


router.post(
    "/admin/tool/new",
    isAuthenticatedUser,
    authorizeRoles("admin"),
    upload.array("timages", 10),
    newTool
  );
router.get("/tool", getTool);
router
  .route("/admin/tool/:toolId", isAuthenticatedUser, 
  authorizeRoles("admin"))
  .put(upload.array("timages", 10), updateTool)
  .delete(deleteTool);
router.get("/tool/:id", getSingleTool);
router.post("/calculate-score", calculateScore);
module.exports = router