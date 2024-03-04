const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for Disaster Report
const DisasterReportSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    disaster: {
        type: Schema.Types.ObjectId,
        ref: 'Disaster',
        required: true
    },
    area: {
        type: Schema.Types.ObjectId,
        ref: 'Area',
        required: true
    },
    affectedPersons: {
        type: Number,
        required: true
    },
    casualties: {
        type: Number,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false // Default value is false, indicating the report is not deleted
    }
    
});

// Create model for Disaster Report
const DisasterReport = mongoose.model('DisasterReport', DisasterReportSchema);

module.exports = DisasterReport;