const express=require("express");
const router=express.Router();
const Listing=require("../models/listings.js");
const Review=require("../models/Review.js");
const { listingSchema }=require("../schema.js");
const ExpressError=require("../ExpressError.js");
const { isLoggedIn,isOwner }=require("../middlewares.js");
const multer  = require('multer');
const { storage }=require("../cloudConfig.js");
const upload = multer({ storage }) 




function asyncWrap(fn){
    return function(req,res,next){
      fn(req,res,next).catch((err) => next(err)); 
    }
};

const validateListing=(req,res,next)=>{
  const { error,value }=listingSchema.validate(req.body);
  // console.log("error: ",error.message);
  // console.log("value: ");
  if(error){
    throw new ExpressError( 401,error );
  }else{
    next();
  }
};


// HOME route
router.get("/",asyncWrap(async (req,res)=>{
  // console.log(req.isAuthenticated());
  // console.log(req.user);
  const allListings=await Listing.find({});
  res.render("listing/index.ejs",{ allListings });  
}));

//New route   
router.get("/new",isLoggedIn,(req,res)=>{
  console.log("hiii");
  res.render("listing/new.ejs");
});  

// individual route  
router.get("/:id",isLoggedIn,asyncWrap(async (req,res,next)=>{
  const listing=await Listing.findById(req.params.id).populate({
    path:"reviews",
    populate: {
      path:"author"
    },
  }).populate("owner");
  if(!listing) { 
    req.flash("error","Listing not found");
    res.redirect("/listings");
  }else{
    res.render("listing/show.ejs",{ listing });
  }
}));

// post route
router.post("/",isLoggedIn,upload.single('listing[image]'),validateListing,asyncWrap(async (req,res)=>{
  // console.log(req.body);
  // res.send(req.body);
  // console.log(req.file);
  const newListing= new Listing( req.body.listing );  
  let { filename,path }=req.file;
  newListing.owner=req.user._id;
  newListing.image={ filename,url:path }; 
  await newListing.save();
  req.flash("success","Listing successfuly added!");  
  res.redirect("/listings");
}));

// edit route
router.get("/:id/edit",isLoggedIn,isLoggedIn,asyncWrap(async (req,res)=>{
  const listing=await Listing.findById(req.params.id);
  if(!listing) { 
    req.flash("error","Listing not found");
    res.redirect("/listings");
  }else{
    res.render("listing/edit.ejs",{ listing });
  }
}));

//update route 
router.put("/:id",isLoggedIn,isOwner,asyncWrap(async (req,res)=>{
    const id=req.params.id;
    await Listing.findByIdAndUpdate(id,{...req.body}); 
    req.flash("success","Listing successfuly Updated!");
    return res.redirect(`/listings/${id}`);
}));

// delete route
router.delete("/:id",isLoggedIn,isOwner,asyncWrap(async (req,res)=>{
  let listing=await Listing.findById(req.params.id);
  console.log(listing.owner._id);
  console.log(req.user._id);
  if(listing.owner._id.equals(req.user._id)){
    await Review.deleteMany({_id: {$in: listing.reviews}});
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success","Listing successfuly deleted!");
    return res.redirect(`/listings`); 
  }
  await Review.deleteMany({_id: {$in: listing.reviews}});
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success","Listing successfuly deleted!");
  res.redirect(`/listings`); 
}));

module.exports=router;