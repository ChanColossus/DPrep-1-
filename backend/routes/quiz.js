
const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const {
  newQuiz, getQuiz, updateQuiz, deleteQuiz,getSingleQuiz
} = require("../controllers/quizController");
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// router.use();
router.post(
  "/admin/quiz/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  upload.array(),
  newQuiz
);
router.get("/quiz", getQuiz);
router
  .route("/admin/quiz/:quizId", isAuthenticatedUser,
    authorizeRoles("admin"))
  .put(upload.array(),updateQuiz)
  .delete(deleteQuiz);
  router.get("/quiz/:id", getSingleQuiz);
module.exports = router