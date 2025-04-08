const mongoose=require("mongoose");
const Listing=require("../models/listings");
const listingData=require("./data");

const MONGO_URL="mongodb://127.0.0.1:27017/DatabaseNew";



async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("databse connected")
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled    67ece95d87f55aab4541d359
}

main().catch(err => console.log(err));

async function insertingData(){
    await Listing.deleteMany({});
    console.log("all data deleted");
    listingData.data=listingData.data.map((obj)=>({...obj,owner:"67ece95d87f55aab4541d359"}));
    await Listing.insertMany(listingData.data);
    console.log("data successfully inserted");
};

insertingData();