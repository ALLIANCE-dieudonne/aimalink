import Donation from "../db/schemas/donationSchema.js";
import haversine from "haversine-distance"; // Install using:
import Drives from "../db/schemas/drivesSchema.js";

export const scheduleDonation = async (req, res) => {
  try {
    const id = req.user._id;
    const location = req.body.driveLocation
      ? req.body.driveLocation
      : req.user.location;
    const phone = req.user.phoneNumber || req.body.phoneNumber;

    // Extract the date part from dateTime
    const requestedDate = new Date(req.body.dateTime);
    const startOfDay = new Date(requestedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(requestedDate.setHours(23, 59, 59, 999));

    // Check if a donation already exists for the same user on the same date and location
    const existingDonation = await Donation.findOne({
      userId: id,
      driveLocation: location,
      dateTime: { $gte: startOfDay, $lte: endOfDay }, // Ensures it's within the same day
    });

    if (existingDonation) {
      return res.status(400).json({
        message:
          "You have already scheduled a donation at this location on the same day.",
      });
    }

    const donation = new Donation({
      dateTime: req.body.dateTime,
      age: req.body.age,
      driveLocation: location,
      phone,
      userId: id,
    });

    await donation.save();
    res.status(201).json({ message: "Donation scheduled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error scheduling donation");
  }
};

export const getAllSchedules = async (req, res) => {
  try {
    const id = req.user._id;
    const schedules = await Donation.find({ userId: id });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).send("Error fetching schedules");
  }
};

export const getAllDrives = async (req, res) => {
  try {
    const userLocation = req.user.location;

    console.log(userLocation);

    if (!userLocation) {
      return res.status(400).json({ message: "User location is required" });
    }

    // Fetch all drive locations from DB
    const drives = await Drives.find();

    // Calculate distance for each drive
    const drivesWithDistance = drives.map((drive) => {
      if (!drive.Location || !drive.Latitude || !drive.Longitude) {
        return { ...drive._doc, distance: null }; // If location is missing, set distance as null
      }

      const driveCoords = { lat: drive.Latitude, lng: drive.Longitude };
      const distance = haversine(userLocation, driveCoords); // Distance in meters

      return { ...drive._doc, distance: distance / 1000 }; // Convert meters to kilometers
    });

    // Sort drives by distance (nearest first)
    drivesWithDistance.sort(
      (a, b) => (a.distance || Infinity) - (b.distance || Infinity)
    );

    res.status(200).json(drivesWithDistance);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching drives");
  }
};

export const searchDrive = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const results = await Drives.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { Location: { $regex: keyword, $options: "i" } },
      ],
    }).limit(10); // Limit results for performance

    res.status(200).json(results);
  } catch (error) {
    res.status(500).send("Error searching drive" + error);
  }
};
