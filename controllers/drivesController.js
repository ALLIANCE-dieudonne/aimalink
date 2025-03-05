import Drives from "../db/schemas/drivesSchema.js";
import haversine from "haversine-distance"; // Install using:

export const getAllDrives = async (req, res) => {
    try {
      const userLocation = req.user.location;
  
  
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
      const userLocation = req.user.location; // Assuming user's location is passed in the request
  
      if (!keyword) {
        return res.status(400).json({ message: "Keyword is required" });
      }
  
      if (!userLocation) {
        return res.status(400).json({ message: "User location is required" });
      }
  
      // Fetch matching drives from the database
      const drives = await Drives.find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { Location: { $regex: keyword, $options: "i" } },
        ],
      });
  
      // Map through drives to calculate the distance for each
      const drivesWithDistance = drives.map((drive) => {
        if (!drive.Latitude || !drive.Longitude) {
          return { ...drive._doc, distance: null }; // If location is missing, set distance as null
        }
  
        const driveCoords = { lat: drive.Latitude, lng: drive.Longitude };
        const distance = haversine(userLocation, driveCoords); // Calculate distance in meters
  
        return { ...drive._doc, distance: distance / 1000 }; // Convert to kilometers
      });
  
      // Sort the drives by distance (nearest first)
      drivesWithDistance.sort(
        (a, b) => (a.distance || Infinity) - (b.distance || Infinity)
      );
  
      res.status(200).json(drivesWithDistance); // Return drives with distances
    } catch (error) {
      res.status(500).send("Error searching drive: " + error);
    }
  };