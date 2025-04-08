const mongoose=require("mongoose");
const Review=require("./Review");
const User = require("./user");
const Schema=mongoose.Schema;

const listingSchema=new  Schema({
    title: {
        type: String,
        required: true,
    } ,
    description: String ,
    image: {
        url:{
            type:String ,
            default:"https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmF0dXJhbHxlbnwwfHwwfHx8MA%3D%3D",
             
        },
        filename:{
            type:String,
            default:"default.jpg"
        } 
    } ,
    price: Number ,
    location: String ,
    country: String ,
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type :Schema.Types.ObjectId, 
        ref:"User"
    }
});

listingSchema.post('findOneAndDelete',(data)=>{
    console.log("DATS",data);
})

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;
