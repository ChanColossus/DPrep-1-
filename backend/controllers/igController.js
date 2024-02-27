const Ig = require('../models/ig');
const Disaster = require("../models/disaster");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

exports.newIg = async (req, res, next) => {
    const { gname, disasterNames } = req.body;
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
        let gimages = [];

        if (!req.files) {
            gimages.push(req.file);
        } else {
            gimages = req.files;
        }

        let gimagesLinks = [];

        for (let i = 0; i < gimages.length; i++) {
            let gimageDataUri = gimages[i].path;

            try {
                const result = await cloudinary.v2.uploader.upload(gimageDataUri, {
                    folder: 'infographics',
                    
                });

                gimagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            } catch (error) {
                console.log('Error uploading image:', error);
                // Handle the error as needed (return an error response or use default image)
            }
        }

        // Create the Area with the associated disasters and uploaded images
        const igData = {
            gname,
            disasterProne: disasters.map((disaster) => ({
                name: disaster.name,
            })),
            gimages: gimagesLinks,
        };

        const createdIg = await Ig.create(igData);
        return res.json(createdIg);
    } catch (error) {
        console.error('Error creating area:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getSingleIg = async (req, res, next) => {
    const ig = await Ig.findById(req.params.id);
  
    if (!ig) {
      return res.status(404).json({
        success: false,
        message: "Infographic not found",
      });
    }
    res.status(200).json({
      success: true,
      ig
    });
  };
  exports.getIg = async (req, res, next) => {
    // const resPerPage = 4;
    // const areaCount = await Area.countDocuments();
    const apiFeatures = new APIFeatures(Ig.find(), req.query)
        .search()
        .filter();

    // apiFeatures.pagination(resPerPage);
    const ig = await apiFeatures.query;
    // let filteredAreaCount = ig.length;
    res.status(200).json({
        success: true,
        // filteredAreaCount,
        // areaCount,
        ig,
        // resPerPage,
    });
};
exports.deleteIg = async (req, res, next) => {
    const ig = await Ig.findByIdAndDelete(req.params.id);
    if (!ig) {
        return res.status(404).json({
            success: false,
            message: "Infographic not found",
        });
    }
    res.status(200).json({
        success: true,
        message: "Infographic deleted",
    });
};
exports.updateIg = async (req, res, next) => {
    const { id } = req.params;
    const { gname, disasterNames } = req.body;
    let gimages = req.body.gimages; // Ensure to parse the incoming images correctly
    console.log(req.files);
    console.log(id);

    try {
        let ig = await Ig.findById(id);
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
        if (req.body.gimages !== undefined && req.body.gimages.length > 0) {
            let imagesLinks = [];
            // Upload new images to cloudinary
            for (let i = 0; i < req.body.gimages.length; i++) {
                const result = await cloudinary.v2.uploader.upload(
                    req.body.gimages[i],
                    {
                        folder: "infographics",
                    }
                );
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }

            gimages = imagesLinks;
        } else {
            // If images are not present in the request body, retain the existing images
            gimages = ig.gimages;
        }

        // Update the Area with the associated disasters and uploaded images
        const updatedIg = await Ig.findByIdAndUpdate(
            id,
            {
                $set: {
                    gname,
                    disasterProne: disasters.map((disaster) => ({
                        name: disaster.name,
                    })),
                    gimages: gimages,
                },
            },
            { new: true }
        );

        if (!updatedIg) {
            return res.status(404).json({ error: 'Ig not found' });
        }

        return res.json(updatedIg);
    } catch (error) {
        console.error('Error updating Ig:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};