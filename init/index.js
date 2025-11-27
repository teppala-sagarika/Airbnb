require("dotenv").config({ path: '../.env' });
const mongoose = require("mongoose");
const axios = require("axios");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const CLOUD_NAME = process.env.CLOUD_NAME;
const GEOAPIFY_API_KEY = process.env.MAP_TOKEN; // Same one you're using in frontend
const MONGO_URL = process.env.ATLASDB_URL; // Use Atlas DB!

main().then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

const getCoordinates = async(address) => {
    try {
        const res = await axios.get(
            `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&format=json&apiKey=${GEOAPIFY_API_KEY}`
        );

        if (res.data.results && res.data.results.length > 0) {
            const { lon, lat } = res.data.results[0];
            return [lon, lat]; // [longitude, latitude]
        }
        return null;
    } catch (error) {
        console.error("Geocoding Error:", error.message);
        return null;
    }
};

const initDB = async() => {
    await Listing.deleteMany({});
    console.log("Old data removed");

    for (let obj of initData.data) {
        const address = `${obj.location}, ${obj.country}`;
        const coordinates = await getCoordinates(address);

        obj.image = {
            filename: "listingimage",
            url: `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/${obj.image.url}`,
        };

        obj.owner = "68fcd633f6244acbb734cfe3";

        obj.geometry = coordinates ? { type: "Point", coordinates } // Real coordinates from Geoapify
            :
            { type: "Point", coordinates: [0, 0] }; // Default - avoid errors

        const listing = new Listing(obj);
        await listing.save();
        console.log("Saved:", listing.title);
    }

    console.log("✨ ALL DONE — Data seeded successfully!");
};

initDB();