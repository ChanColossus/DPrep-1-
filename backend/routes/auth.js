
const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { registerUser, loginUser,logout,forgotPassword,resetPassword, getUserProfile,updatePassword,updateProfile,allUsers,getUserDetails,deleteUser,updateUserRoleToEmployee,updateUserRoleToAdmin,updateUserRoleToUser} = require('../controllers/authController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.post("/register", upload.single("avatar"), registerUser);
router.post('/login', loginUser);
router.get('/logout',logout);

// router.post('/password/forgot',forgotPassword);
// router.put('/password/reset/:token',resetPassword);

router.get('/me', isAuthenticatedUser,getUserProfile)
// router.put('/password/update',isAuthenticatedUser,updatePassword)
router.put('/me/update/:id',isAuthenticatedUser, upload.single('avatar'), updateProfile)
router.put('/updateRoleE/:id', updateUserRoleToEmployee)
router.put('/updateRoleA/:id', updateUserRoleToAdmin)
router.put('/updateRoleU/:id', updateUserRoleToUser)
router.get('/admin/users',allUsers)
router.get('/admin/user/:id',isAuthenticatedUser,getUserDetails)
router.delete("/admin/user/:id",
    isAuthenticatedUser,
    // authorizeRoles("admin"),
    deleteUser
);

module.exports = router;