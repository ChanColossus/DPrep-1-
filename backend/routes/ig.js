
const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const {
  newIg,getIg,getSingleIg,deleteIg,updateIg
} = require("../controllers/igController");
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.post(
  "/admin/ig/new",
  upload.array("gimages", 10),
  newIg
);
router.get("/ig", getIg);    
router.get("/ig/:id", getSingleIg);
router
  .route("/admin/ig/:id", isAuthenticatedUser, 
  authorizeRoles("admin"))
  .put(upload.array("gimages", 10), updateIg)
  .delete(deleteIg);
module.exports = router