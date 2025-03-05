import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { createObjectCsvWriter } from "csv-writer"; 

const rwandanCities = [
  "Kigali", "Butare", "Gitarama", "Ruhengeri", "Gisenyi", "Byumba", "Cyangugu",
  "Kibuye", "Rwamagana", "Kibungo", "Gatsibo", "Nyagatare", "Kayonza", "Ngoma",
  "Bugesera", "Nyanza", "Huye", "Nyarugenge", "Gasabo", "Kicukiro", "Musanze",
  "Burera", "Gicumbi", "Rulindo", "Nyabihu", "Rubavu", "Rutsiro", "Karongi",
  "Ngororero", "Nyamasheke", "Rusizi", "Nyamagabe", "Ruhango", "Muhanga", "Kamonyi",
];

// Generate a random latitude within Rwanda's bounds
const generateLatitude = () => parseFloat((Math.random() * (-1.05 - -2.84) + -2.84).toFixed(6));

// Generate a random longitude within Rwanda's bounds
const generateLongitude = () => parseFloat((Math.random() * (30.9 - 28.86) + 28.86).toFixed(6));

// Generate a random drive object
const generateDrive = () => {
  const city = rwandanCities[Math.floor(Math.random() * rwandanCities.length)];
  return {
    name: faker.company.name() + " Hospital",
    location: `${faker.location.streetAddress()}, ${city}, Rwanda`,
    latitude: generateLatitude(),
    longitude: generateLongitude(),
    availableDonations: Math.floor(Math.random() * 100),
  };
};

// Generate an array of 1000 drives
const drives = Array.from({ length: 1000 }, generateDrive);

async function saveToCSV() {
  try {
    const csvWriter = createObjectCsvWriter({
      path: "drives.csv", // The path of the CSV file to be created
      header: [
        { id: "name", title: "Name" },
        { id: "location", title: "Location" },
        { id: "latitude", title: "Latitude" },
        { id: "longitude", title: "Longitude" },
        { id: "availableDonations", title: "AvailableDonations" },
      ],
    });

    // Write the drives array to the CSV file
    await csvWriter.writeRecords(drives);
    console.log("CSV file has been written successfully!");
  } catch (err) {
    console.error("Error saving data to CSV:", err);
  }
}

// Run the function to save data to CSV
saveToCSV();



