import Donation from "../db/schemas/donationSchema.js";

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

    // Check if a Donation already exists for the same user on the same date and location
    const existingDonation = await Donation.findOne({
      userId: id,
      driveLocation: location,
      dateTime: { $gte: startOfDay, $lte: endOfDay }, // Ensures it's within the same day
    });

    if (existingDonation) {
      return res.status(400).json({
        message:
          "You have already scheduled a Donation at this location on the same day.",
      });
    }

    const Donation = new Donation({
      dateTime: req.body.dateTime,
      age: req.body.age,
      driveLocation: location,
      phone,
      userId: id,
    });

    await Donation.save();
    res.status(201).json({ message: "Donation scheduled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error scheduling Donation");
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

export const rescheduleDonation = async (req, res) => {
  try {
    const { donationId } = req.params; // Get the donationId from request params
    const id = req.user._id;

    // Extract new date and location from the request body
    const location = req.body.driveLocation ? req.body.driveLocation : req.user.location;
    const phone = req.user.phoneNumber || req.body.phoneNumber;

    const requestedDate = new Date(req.body.dateTime);
    const startOfDay = new Date(requestedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(requestedDate.setHours(23, 59, 59, 999));

    // Check if the new rescheduled date and location already have an existing donation
    const existingDonation = await Donation.findOne({
      userId: id,
      driveLocation: location,
      dateTime: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingDonation) {
      return res.status(400).json({
        message: "You already have a scheduled Donation at this location on the same day.",
      });
    }

    // Find the donation to be rescheduled
    const donationToUpdate = await Donation.findById(donationId);
    if (!donationToUpdate || donationToUpdate.userId.toString() !== id) {
      return res.status(404).json({ message: "Donation not found or you are not authorized to reschedule" });
    }

    // Update the donation's date, location, and phone
    donationToUpdate.dateTime = req.body.dateTime;
    donationToUpdate.driveLocation = location;
    donationToUpdate.phone = phone;

    // Save the updated donation
    await donationToUpdate.save();

    res.status(200).json({ message: "Donation rescheduled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error rescheduling Donation");
  }
};

export const cancelDonation = async (req, res) => {
  try {
    const { donationId } = req.params; // Get the donationId from request params
    const id = req.user._id;

    // Find and delete the donation
    const donationToDelete = await Donation.findById(donationId);

    if (!donationToDelete || donationToDelete.userId.toString() !== id) {
      return res
        .status(404)
        .json({
          message: "Donation not found or you are not authorized to cancel",
        });
    }

    // Delete the donation
    await donationToDelete.remove();

    res.status(200).json({ message: "Donation canceled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error canceling Donation");
  }
};
