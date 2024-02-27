const Area = require('../models/area');
const Disaster = require("../models/disaster");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

exports.newArea = async (req, res, next) => {
    const { bname, bdescription, disasterNames } = req.body;
    console.log(req.files)
    console.log(req.body)
    console.log(disasterNames)
    try {
        // Fetch disasters based on the provided disasterNames
        let disasters;

        // Check if disasterNames is an array
        if (Array.isArray(disasterNames)) {
            console.log('Disaster Names Array:', disasterNames);

            // Fetch disasters based on the provided disasterNames
            disasters = await Disaster.find({ name: { $in: disasterNames } });

            console.log('Disasters Found:', disasters);

            // Check if all provided disasterNames correspond to valid disasters
            if (disasters.length !== disasterNames.length) {
                console.log('Invalid disasterNames:', disasterNames.filter(name => !disasters.some(disaster => disaster.name === name)));
                return res.status(400).json({ error: 'Invalid disasterName provided' });
            }
        } else {
            // If disasterNames is not an array, handle it as a single disaster name
            console.log('Single Disaster Name:', disasterNames);

            const singleDisaster = await Disaster.findOne({ name: disasterNames });

            // Check if the single disaster name is valid
            if (!singleDisaster) {
                console.log('Invalid disasterName:', disasterNames);
                return res.status(400).json({ error: 'Invalid disasterName provided' });
            }

            disasters = [singleDisaster];
        }
        // Image upload logic
        let bimages = [];

        if (!req.files) {
            bimages.push(req.file);
        } else {
            bimages = req.files;
        }

        let bimagesLinks = [];

        for (let i = 0; i < bimages.length; i++) {
            let bimageDataUri = bimages[i].path;

            try {
                const result = await cloudinary.v2.uploader.upload(bimageDataUri, {
                    folder: 'area',
                    width: 150,
                    crop: 'scale',
                });

                bimagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            } catch (error) {
                console.log('Error uploading image:', error);
                // Handle the error as needed (return an error response or use default image)
            }
        }

        // Create the Area with the associated disasters and uploaded images
        const areaData = {
            bname,
            bdescription,
            disasterProne: disasters.map((disaster) => ({
                name: disaster.name,
            })),
            bimages: bimagesLinks,
        };

        const createdArea = await Area.create(areaData);
        return res.json(createdArea);
    } catch (error) {
        console.error('Error creating area:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getArea = async (req, res, next) => {
    const resPerPage = 4;
    const areaCount = await Area.countDocuments();
    const apiFeatures = new APIFeatures(Area.find(), req.query)
        .search()
        .filter();

    apiFeatures.pagination(resPerPage);
    const area = await apiFeatures.query;
    let filteredAreaCount = area.length;
    res.status(200).json({
        success: true,
        filteredAreaCount,
        areaCount,
        area,
        resPerPage,
    });
};
exports.updateArea = async (req, res, next) => {
    const { areaId } = req.params;
    const { bname, bdescription, disasterNames } = req.body;
    let bimages = req.body.bimages; // Ensure to parse the incoming images correctly
    console.log(req.files);
    console.log(areaId);

    try {
        let area = await Area.findById(areaId);
        // Check if disasterNames is an array
        let disasters;
        if (Array.isArray(disasterNames)) {
            // Fetch disasters based on the provided disasterNames
            disasters = await Disaster.find({ name: { $in: disasterNames } });

            // Check if all provided disasterNames correspond to valid disasters
            if (disasters.length !== disasterNames.length) {
                return res.status(400).json({ error: 'Invalid disasterName provided' });
            }
        } else {
            // If disasterNames is not an array, handle it as a single disaster name
            const singleDisaster = await Disaster.findOne({ name: disasterNames });

            // Check if the single disaster name is valid
            if (!singleDisaster) {
                return res.status(400).json({ error: 'Invalid disasterName provided' });
            }

            disasters = [singleDisaster];
        }

        // Image upload logic (similar to createArea)
        // Check if images are present in the request body
        if (req.body.bimages !== undefined && req.body.bimages.length > 0) {
            let imagesLinks = [];
            // Upload new images to cloudinary
            for (let i = 0; i < req.body.bimages.length; i++) {
                const result = await cloudinary.v2.uploader.upload(
                    req.body.bimages[i],
                    {
                        folder: "area",
                    }
                );
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }

            bimages = imagesLinks;
        } else {
            // If images are not present in the request body, retain the existing images
            bimages = area.bimages;
        }

        // Update the Area with the associated disasters and uploaded images
        const updatedArea = await Area.findByIdAndUpdate(
            areaId,
            {
                $set: {
                    bname,
                    bdescription,
                    disasterProne: disasters.map((disaster) => ({
                        name: disaster.name,
                    })),
                    bimages: bimages,
                },
            },
            { new: true }
        );

        if (!updatedArea) {
            return res.status(404).json({ error: 'Area not found' });
        }

        return res.json(updatedArea);
    } catch (error) {
        console.error('Error updating area:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteArea = async (req, res, next) => {
    const area = await Area.findByIdAndDelete(req.params.areaId);
    if (!area) {
        return res.status(404).json({
            success: false,
            message: "Area not found",
        });
    }
    res.status(200).json({
        success: true,
        message: "Area deleted",
    });
};
exports.getSingleArea = async (req, res, next) => {
    const area = await Area.findById(req.params.id);
  
    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Area not found",
      });
    }
    res.status(200).json({
      success: true,
      area
    });
  };