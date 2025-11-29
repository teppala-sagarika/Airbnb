const mongoose = require("mongoose");
const Listing = require("../models/listing");
const { detectCategory } = require("../utilities/categoryDetect");
require("dotenv").config();

const dbUrl = process.env.ATLASDB_URL;

async function run() {
    await mongoose.connect(dbUrl);
    console.log("Connected to DB");

    const listings = await Listing.find();

    for (const l of listings) {
        const category = detectCategory(l);
        // update only if missing or different
        if (!l.category || l.category !== category) {
            await Listing.updateOne({ _id: l._id }, { $set: { category } });
            console.log(`Updated: ${l.title} -> ${category}`);
        } else {
            console.log(`Skipped (already set): ${l.title}`);
        }
    }

    console.log("Done");
    mongoose.connection.close();
}

run().catch(err => {
    console.error(err);
    mongoose.connection.close();
});