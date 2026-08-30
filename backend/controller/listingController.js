import Listing from "../models/listing.js";

export const createListing = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const {
      title,
      description,
      location,
      roomType,
      furnished,
      availableRooms,
      price,
      paymentPeriod,
      amenities,
      images,
    } = req.body;

    const listing = await Listing.create({
      user: req.user._id,
      title,
      description,
      location,
      roomType,
      furnished,
      availableRooms,
      price,
      paymentPeriod,
      amenities,
      images,
    });

    const populatedListing = await Listing.findById(listing._id)
      .populate("user", "-password");

    return res.status(201).json({
      message: "Listing created successfully",
      data: populatedListing,
    });

  } catch (error) {
    console.error("create listing error:", error);

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        message: "Please fix the validation errors",
        errors,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const getAllListings = async (req, res) => {
  try {

    const listings =
      await Listing.find()
        .populate("user", "-password")
        .sort({
          createdAt: -1,
        });


    return res.status(200).json({

      count: listings.length,

      data: listings,

    });

  } catch (error) {

    console.error(
      "get listings error:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};


export const getMyListings = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }


    const listings =
      await Listing.find({
        user: req.user._id,
      })
        .populate("user", "-password")
        .sort({
          createdAt: -1,
        });


    return res.status(200).json({

      count: listings.length,

      data: listings,

    });

  } catch (error) {

    console.error(
      "get my listings error:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};

export const getListingById = async (req, res) => {
  try {

    const { id } = req.params;


    const listing =
      await Listing.findById(id)
        .populate("user", "-password");


    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }


    return res.status(200).json({

      data: listing,

    });

  } catch (error) {

    console.error(
      "get listing error:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};

export const updateListing = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }


    const { id } = req.params;


    const listing =
      await Listing.findById(id);


    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }


    // Make sure the listing belongs to
    // the currently logged-in user

    if (
      listing.user.toString() !==
      req.user._id.toString()
    ) {

      return res.status(403).json({
        message:
          "You are not allowed to update this listing",
      });

    }


    const updatedListing =
      await Listing.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("user", "-password");


    return res.status(200).json({

      message:
        "Listing updated successfully",

      data: updatedListing,

    });

  } catch (error) {

    console.error(
      "update listing error:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};



export const deleteListing = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }


    const { id } = req.params;


    const listing =
      await Listing.findById(id);


    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }


    // Only the owner can delete
    // their listing

    if (
      listing.user.toString() !==
      req.user._id.toString()
    ) {

      return res.status(403).json({
        message:
          "You are not allowed to delete this listing",
      });

    }


    await Listing.findByIdAndDelete(id);


    return res.status(200).json({

      message:
        "Listing deleted successfully",

    });

  } catch (error) {

    console.error(
      "delete listing error:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};