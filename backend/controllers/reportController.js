const Report = require("../models/report");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

exports.newReport = async (req, res, next) => {
    const { date, disaster, area, affectedPersons,casualties } = req.body;
    console.log(req.body)
    const reportData = {
        date,
        disaster,
        area,
        affectedPersons,
        casualties
    };

    const createdReport = await Report.create(reportData);
    return res.json(createdReport);
  };

  exports.getReport = async (req, res, next) => {
    try {
        const reports = await Report.find()
            .populate('disaster') // Populate the 'disaster' field with data from the Disaster collection
            .populate('area'); // Populate the 'area' field with data from the Area collection

        res.status(200).json({
            success: true,
            reports,
        });
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.updateReport = async (req, res, next) => {
  const { id } = req.params;
  const { affectedPersons, area, date,disaster, casualties } = req.body;
  console.log(id);
console.log(req.body)
  try {


      const updatedReport = await Report.findByIdAndUpdate(
          id,
          {
              $set: {
                  affectedPersons,
                  area,
                 date,
                 disaster,
                 casualties
          
              },
          },
          { new: true }
      );

      if (!updatedReport) {
          return res.status(404).json({ error: 'Report not found' });
      }

      return res.json(updatedReport);
  } catch (error) {
      console.error('Error updating area:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
  };
  exports.getSingleReport = async (req, res, next) => {
    const report = await Report.findById(req.params.id);
  
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Disaster not found",
      });
    }
    res.status(200).json({
      success: true,
      report
    });
  };
  exports.deleteReport = async (req, res, next) => {
    const { id } = req.params;
    
    try {
        const deletedReport = await Report.findByIdAndDelete(id);

        if (!deletedReport) {
            return res.status(404).json({ error: 'Report not found' });
        }

        return res.json({ success: true, message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting report:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};