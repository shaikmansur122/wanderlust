const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGOO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGOO_URL);
  console.log("Connected");
}

main().catch(err => console.log(err));

const initDB = async () => {
  await Listing.deleteMany({});

  const ownerId = new mongoose.Types.ObjectId("6975b290701d63fe83204205");

  const dataWithOwner = initData.data.map(obj => ({
    ...obj,
    owner: ownerId,
  }));

  await Listing.insertMany(dataWithOwner);

  console.log("Data was initialized");
};

initDB();
