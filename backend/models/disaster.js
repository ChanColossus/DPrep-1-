const mongoose = require('mongoose')

const disasterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter disaster name'],
        trim: true,
        unique: true,
        maxLength: [100, 'Disaster name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please enter disaster description']
    },
   
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Disaster', disasterSchema);