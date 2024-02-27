const Disaster = require("../models/disaster");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

exports.newDisaster = async (req, res, next) => {
  console.log(req.files);
  let images = [];

  if (req.files && req.files.length > 0) {
    images = req.files.map(file => file.path);
  }

  let imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    let imageDataUri = images[i];

    try {
      const result = await cloudinary.v2.uploader.upload(imageDataUri, {
        folder: "disaster",
       
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    } catch (error) {
      console.log("Error uploading image:", error);
    }
  }
  req.body.images = imagesLinks;

  const disaster = await Disaster.create(req.body);
  if (!disaster)
    return res.status(400).json({
      success: false,
      message: "Disaster not created",
    });

  res.status(201).json({
    success: true,
    disaster,
  });
};
exports.getDisaster = async (req, res, next) => {
  const resPerPage = 4;
  const disasterCount = await Disaster.countDocuments();
  const apiFeatures = new APIFeatures(Disaster.find(), req.query)
    .search()
    .filter();

  // apiFeatures.pagination(resPerPage);
  const disasters = await apiFeatures.query;
  // let filteredDisasterCount = disasters.length;
  res.status(200).json({
    success: true,
    // filteredDisasterCount,
    // disasterCount,
    disasters,
    // resPerPage,
  });
};

exports.updateDisaster = async (req, res, next) => {
  try {
    let disaster = await Disaster.findById(req.params.id);

    if (!disaster) {
      return res.status(404).json({
        success: false,
        message: "Disaster not found",
      });
    }

    // Check if images are present in the request body
    if (req.body.images !== undefined) {
      // Delete old images from cloudinary
      for (let i = 0; i < disaster.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          disaster.images[i].public_id
        );
      }

      let imagesLinks = [];
      // Upload new images to cloudinary
      for (let i = 0; i < req.body.images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(
          req.body.images[i],
          {
            folder: "disaster",
          }
        );
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      req.body.images = imagesLinks;
    } else {
      // If images are not present, retain the existing images
      req.body.images = disaster.images;
    }

    console.log(req.params.id);
    disaster = await Disaster.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindandModify: false,
    });

    return res.status(200).json({
      success: true,
      disaster,
    });
  } catch (error) {
    console.error("Error updating disaster:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteDisaster = async (req, res, next) => {
  const disaster = await Disaster.findByIdAndDelete(req.params.id);
  if (!disaster) {
    return res.status(404).json({
      success: false,
      message: "Disaster not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Disaster deleted",
  });
};
exports.getSingleDisaster = async (req, res, next) => {
  const disaster = await Disaster.findById(req.params.id);

  if (!disaster) {
    return res.status(404).json({
      success: false,
      message: "Disaster not found",
    });
  }
  res.status(200).json({
    success: true,
    disaster
  });
};