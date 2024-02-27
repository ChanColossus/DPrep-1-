
const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const {
    newReport,getReport,updateReport,getSingleReport,deleteReport
  } = require("../controllers/reportController");
const { isAuthenticatedUser,authorizeRoles } = require('../middlewares/auth');

router.post(
    "/admin/report/new",
    isAuthenticatedUser,
    // authorizeRoles("admin"),
    newReport
  );
router.get("/reports", getReport);
router.put(
  "/admin/report/:id",
  isAuthenticatedUser,
  upload.none(), // Handle data not containing files
  updateReport
);
router.delete("/admin/report/:id",
    isAuthenticatedUser,
    // authorizeRoles("admin"),
    deleteReport
);
router.get("/report/:id", getSingleReport);
module.exports = router;