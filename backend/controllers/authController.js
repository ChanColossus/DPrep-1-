const User = require("../models/user");

const sendToken = require("../utils/jwtToken");
const cloudinary = require("cloudinary");
const sendEmail = require("../utils/sendEmail");

exports.registerUser = async (req, res, next) => {
  console.log(req.body.avatar)

  const result = await cloudinary.v2.uploader.upload(req.file.path, {
    folder: 'avatars',
    width: 150,
    crop: "scale"
  }, (err, res) => {
    console.log(err, res);
  });
  const { name, email, password, role, contact,work,age,gender } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    contact,
    age,
    work,
    gender,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url
    },

    role,
  })

  // const token = user.getJwtToken();
  if (!user) {
    return res.status(500).json({
      success: false,
      message: 'user not created'
    })
  }
  sendToken(user, 200, res)

}

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter email & password' })
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return res.status(401).json({ message: 'Invalid Email or Password' })
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return res.status(401).json({ message: 'Invalid Email or Password' })
  }
  sendToken(user, 200, res)
}

exports.logout = async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  })

  res.status(200).json({
    success: true,
    message: 'Logged out'
  })
}

// exports.forgotPassword = async (req, res, next) => {
//   const user = await User.findOne({ email: req.body.email });
//   console.log(req.body.email);
//   if (!user) {
//     return res.status(404).json({ error: "User not found with this email" });

//   }

//   const resetToken = user.getResetPasswordToken();
//   await user.save({ validateBeforeSave: false });


//   const resetUrl = `${req.protocol}://localhost:3000/password/reset/${resetToken}`;
//   const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;
//   try {
//     await sendEmail({
//       email: user.email,
//       subject: "Myrmidons Password Recovery",
//       message,
//     });

//     res.status(200).json({
//       success: true,
//       message: `Email sent to: ${user.email}`,
//     });
//   } catch (error) {
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     await user.save({ validateBeforeSave: false });
//     return res.status(500).json({ error: error.message });

//   }
// };

// exports.resetPassword = async (req, res, next) => {
//   // Hash URL token
//   const resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");
//   const user = await User.findOne({
//     resetPasswordToken,
//     resetPasswordExpire: { $gt: Date.now() },
//   });

//   if (!user) {
//     return res
//       .status(400)
//       .json({ message: "Password reset token is invalid or has been expired" });

//   }

//   if (req.body.password !== req.body.confirmPassword) {
//     return res.status(400).json({ message: "Password does not match" });

//   }


//   user.password = req.body.password;
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpire = undefined;
//   await user.save();
//   sendToken(user, 200, res);
// };

exports.getUserProfile = async (req, res, next) => {
  // console.log(req.header('authorization'))
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
};

// exports.updatePassword = async (req, res, next) => {
//   const user = await User.findById(req.user.id).select("password");
//   // Check previous user password
//   const isMatched = await user.comparePassword(req.body.oldPassword);
//   if (!isMatched) {
//     return res.status(400).json({ message: "Old password is incorrect" });
//   }
//   user.password = req.body.password;
//   await user.save();
//   sendToken(user, 200, res);
// };

exports.updateProfile = async (req, res, next) => {
  const userId = req.params.id;
console.log(req.body)
  try {
    let userDataToUpdate = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      contact: req.body.contact,
      age: req.body.age,
      gender: req.body.gender,
      work: req.body.work,
      role: req.body.role,
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });
      userDataToUpdate.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      userDataToUpdate,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.allUsers = async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
};

exports.getUserDetails = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res
      .status(400)
      .json({ message: `User does not found with id: ${req.params.id}` });
    // return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
  }

  res.status(200).json({
    success: true,
    user,
  });
};
exports.deleteUser = async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "User deleted",
  });
};
exports.updateUserRoleToEmployee = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's role to "employee"
    user.role = "employee";
    await user.save();

    res.status(200).json({ success: true, message: "User role updated to employee" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.updateUserRoleToAdmin = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's role to "employee"
    user.role = "admin";
    await user.save();

    res.status(200).json({ success: true, message: "User role updated to admin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.updateUserRoleToUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's role to "employee"
    user.role = "user";
    await user.save();

    res.status(200).json({ success: true, message: "User role updated to admin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};