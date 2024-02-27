
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30, 'Your name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Your password must be longer than 6 characters'],
        select: false
    },
    contact: {
        type: Number,
        required: [true, 'Please enter contact number'],
        maxLength: [11, 'Contact number cannot exceed 11 characters'],
        default: 0.0
    },
    age: {
        type: Number,
        required: [true, 'Please enter age'],
        maxLength: [3, 'Age cannot exceed 3 characters'],
        default: 0.0
    },
    gender: {
        type: String,
        required: [true, 'Please select gender'],
        enum: {
            values: [
                'Male',
                'Female',
                'Rather not say'
            ],
            message: 'Please select correct gender'
        }
    },
    work: {
        type: String,
        required: [true, 'Please select work'],
        enum: {
            values: [
                'Student',
                'Teacher',
                'Others'
            ],
            message: 'Please input your work'
        }
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next(); // Return early if password is not modified
    }
    try {
        this.password = await bcrypt.hash(this.password, 10);
        console.log('Password hashed successfully',this.password);
        next(); // Call next to proceed with saving the document
    } catch (error) {
        console.error('Error hashing password:', error);
        next(error); // Pass the error to the next middleware or route handler
    }
});

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}
userSchema.methods.comparePassword = async function (enteredPassword) {
    try {
        console.log("Entered Password:", enteredPassword);
        console.log("Stored Hashed Password:", this.password);
        const isMatch = await bcrypt.compare(enteredPassword, this.password);
        console.log("Password Match:", isMatch);
        return isMatch;
    } catch (error) {
        console.error("Error comparing passwords:", error);
        return false; // Return false in case of any error
    }
};

  

userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    // Set token expire time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

    return resetToken

}

module.exports = mongoose.model('User', userSchema);




































































