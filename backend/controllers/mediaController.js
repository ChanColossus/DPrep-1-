const Media = require('../models/media');
const Disaster = require("../models/disaster");
const cloudinary = require("cloudinary");
const APIFeatures = require("../utils/apiFeatures");
exports.newMedia = async (req, res, next) => {
    const { mname, disasterNames } = req.body;
    try {
        // Fetch disasters based on the provided disasterNames
        let disasters;

        if (Array.isArray(disasterNames)) {
            disasters = await Disaster.find({ name: { $in: disasterNames } });

            if (disasters.length !== disasterNames.length) {
                return res.status(400).json({ error: 'Invalid disasterName provided' });
            }
        } else {
            const singleDisaster = await Disaster.findOne({ name: disasterNames });

            if (!singleDisaster) {
                return res.status(400).json({ error: 'Invalid disasterName provided' });
            }

            disasters = [singleDisaster];
        }

        // Handle single file upload
        const mvideo = req.file;

        if (!mvideo) {
            return res.status(400).json({ error: 'No video file uploaded' });
        }

        try {
            const result = await cloudinary.uploader.upload(mvideo.path, {
                folder: 'media',
                resource_type: 'video'
            });

            // Ensure that the expected properties are present in the result
            if (result && result.public_id && result.secure_url) {
                // Create the Media document with Cloudinary upload result
                const mediaData = {
                    mname,
                    disasterProne: disasters.map((disaster) => ({
                        name: disaster.name,
                    })),
                    mvideo: {
                        public_id: result.public_id,
                        url: result.secure_url,
                    },
                };

                const createdMedia = await Media.create(mediaData);
                return res.json(createdMedia);
            } else {
                // If the expected properties are not present, handle the error
                console.log('Error uploading video: Invalid response from Cloudinary');
                return res.status(500).json({ error: 'Error uploading video to Cloudinary' });
            }
        } catch (error) {
            console.log('Error uploading video:', error);
            return res.status(500).json({ error: 'Error uploading video to Cloudinary' });
        }
    } catch (error) {
        console.error('Error creating media:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getSingleMedia = async (req, res, next) => {
    const media = await Media.findById(req.params.id);
  
    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }
    res.status(200).json({
      success: true,
      media
    });
  };
  exports.getMedia = async (req, res, next) => {
    // const resPerPage = 4;
    // const areaCount = await Area.countDocuments();
    const apiFeatures = new APIFeatures(Media.find(), req.query)
        .search()
        .filter();

    // apiFeatures.pagination(resPerPage);
    const media = await apiFeatures.query;
    // let filteredAreaCount = ig.length;
    res.status(200).json({
        success: true,
        // filteredAreaCount,
        // areaCount,
        media,
        // resPerPage,
    });
};

exports.deleteMedia = async (req, res, next) => {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) {
        return res.status(404).json({
            success: false,
            message: "Media not found",
        });
    }
    res.status(200).json({
        success: true,
        message: "Media deleted",
    });
};

exports.updateMedia = async (req, res, next) => {
    const { id } = req.params;
    const { mname, disasterNames } = req.body;
    let mvideo = req.body.mvideo; // Ensure to parse the incoming images correctly
    console.log(req.files);
    console.log(id);

    try {
        let media = await Media.findById(id);
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
        if (req.body.mvideo !== undefined && req.body.mvideo.length > 0) {
            let videoLinks = [];
            // Upload new images to cloudinary
            for (let i = 0; i < req.body.mvideo.length; i++) {
                const result = await cloudinary.v2.uploader.upload(
                    req.body.mvideo[i],
                    {
                        folder: "media",
                        resource_type: 'video'
                    }
                );
                videoLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }

            mvideo = videoLinks;
        } else {
            // If images are not present in the request body, retain the existing images
            mvideo = media.mvideo;
        }

        // Update the Area with the associated disasters and uploaded images
        const updatedIg = await Media.findByIdAndUpdate(
            id,
            {
                $set: {
                    mname,
                    disasterProne: disasters.map((disaster) => ({
                        name: disaster.name,
                    })),
                    mvideo: mvideo,
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
