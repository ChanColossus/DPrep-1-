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

exports.predictive = async (req, res, next) => {
    try {
      const areaId = req.params.areaId;
      const disasterId = req.params.disasterId;
      
      // Fetch disaster reports for the selected area and disaster
      const disasterReports = await Report.find({ area: areaId, disaster: disasterId });
      
      // Group reports by month
      const monthlyReports = {};
      disasterReports.forEach(report => {
        const monthYear = report.date.toISOString().substr(0, 7); // Extract month and year (e.g., "2022-03")
        if (!monthlyReports[monthYear]) {
          monthlyReports[monthYear] = [];
        }
        monthlyReports[monthYear].push(report);
      });
      
      // Calculate percentage chance for each month of the specified year
      const percentageChances = {};
      const currentYear = new Date().getFullYear(); // Get the current year
      for (let month = 1; month <= 12; month++) { // Iterate over each month of the year
        const monthYear = `${currentYear}-${month.toString().padStart(2, '0')}`; // Format month and year
        const reports = monthlyReports[monthYear] || []; // Get reports for the month, or an empty array if no reports
        const totalReports = reports.length;
        const totalAreaReports = await Report.find({ area: areaId }).countDocuments();
        const probability = totalReports / totalAreaReports;
        percentageChances[monthYear] = probability * 100;
      }
      
      res.status(200).json({
        success: true,
        monthlyReports: percentageChances
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  

  
  