import bcrypt from "bcrypt";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const hashPassword = (password) => {
  const saltRound = 10;

  const salt = bcrypt.genSaltSync(saltRound);
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

export const getCoordinatesFromLocation = async (location) => {
  const apiKey = process.env.YOUR_GOOGLE_MAPS_API_KEY; // Replace with your actual API key
  const url = `https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error("Invalid location");
    }
  } catch (error) {
    throw new Error("Failed to fetch coordinates");
  }
};



