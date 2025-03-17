import Donation from "../db/schemas/donationSchema.js";

export const scheduleDonation = async (req, res) => {
  try {
    const id = req.user._id;
    const phone = req.user.phoneNumber || req.body.phoneNumber;

    const requestedDate = new Date(req.body.dateTime);
    const date = requestedDate.toISOString().split("T")[0];
    const time = requestedDate.toTimeString().split(" ")[0];

    const existingDonation = await Donation.findOne({
      userId: id,
      driveId: req.body.driveId,
      date,
    });

    if (existingDonation) {
      return res.status(400).json({
        message: "You have already scheduled a Donation at this location on the same day.",
      });
    }

    const newDonation = new Donation({
      date,
      time,
      age: req.body.age,
      driveId: req.body.driveId,
      phone,
      userId: id,
    });

    await newDonation.save();
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
    const { donationId } = req.params;
    const id = req.user._id;
    const phone = req.user.phoneNumber || req.body.phoneNumber;

    const requestedDate = new Date(req.body.dateTime);
    const date = requestedDate.toISOString().split("T")[0];
    const time = requestedDate.toTimeString().split(" ")[0];

    const existingDonation = await Donation.findOne({
      userId: id,
      driveId: req.body.driveId,
      date,
    });

    if (existingDonation) {
      return res.status(400).json({
        message: "You already have a scheduled Donation at this location on the same day.",
      });
    }

    const donationToUpdate = await Donation.findById(donationId);
    if (!donationToUpdate || donationToUpdate.userId.toString() !== id) {
      return res.status(404).json({ message: "Donation not found or you are not authorized to reschedule" });
    }

    donationToUpdate.date = date;
    donationToUpdate.time = time;
    donationToUpdate.driveId = req.body.driveId;
    donationToUpdate.phone = phone;

    await donationToUpdate.save();
    res.status(200).json({ message: "Donation rescheduled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error rescheduling Donation");
  }
};

export const cancelDonation = async (req, res) => {
  try {
    const { donationId } = req.params;
    const id = req.user._id;

    const donationToDelete = await Donation.findById(donationId);
    if (!donationToDelete || donationToDelete.userId.toString() !== id) {
      return res.status(404).json({ message: "Donation not found or you are not authorized to cancel" });
    }

    await Donation.deleteOne({ _id: donationId });
    res.status(200).json({ message: "Donation canceled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error canceling Donation");
  }
};
