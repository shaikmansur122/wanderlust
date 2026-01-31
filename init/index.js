require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);
  console.log("✅ Connected to DB");
}

const initDB = async () => {
  await Listing.deleteMany({});

  const ownerId = new mongoose.Types.ObjectId("6975b290701d63fe83204205");

  const dataWithOwner = initData.data.map(obj => ({
    ...obj,
    owner: ownerId,
  }));

  await Listing.insertMany(dataWithOwner);
  console.log("✅ Data was initialized");
};

main()
  .then(() => initDB())
  .catch(err => console.log(err));
