const express=require("express");
const router=express.Router({ mergeParams:true });
const Listing=require("../models/listings.js");
const Review=require("../models/Review.js");
const ExpressError=require("../ExpressError.js");
const { reviewSchema }=require("../schema.js");
const { isOwner,asyncWrap, isLoggedIn }=require("../middlewares.js")

  
const validateReviews=(req,res,next)=>{
    console.log("iamhere");
    const {error,value}=reviewSchema.validate(req.body);
    // console.log("error: ",error);
    // console.log("value: ",value);
    if(error){
      throw new ExpressError(401,error);
    }
    else{
      next();
    }
};


// Review Route
//post review route
router.post("/",isLoggedIn,validateReviews,asyncWrap(async (req,res)=>{
    // console.log("id",req.params.id);
  let id=req.params.id;
  let listing=await Listing.findById(id);
  // console.log(listing);
  let review=new Review(req.body.review);
  review.author=req.user._id;
  console.log(review);
  listing.reviews.push(review);
  await listing.save();
  await review.save();
  req.flash("success","Review is successfuly added");
  res.redirect(`/listings/${id}`)
}));

// edit review route  
router.get("/:id",(req,res)=>{
  console.log(req.params.id);
});

// delete review route
router.delete("/:reviewId",isLoggedIn,isOwner,asyncWrap(async (req,res)=>{
  console.log("delete")
  let { id ,reviewId }=req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, {$pull: { reviews: reviewId }});
  req.flash("success","Review is successfuly deleted");
  res.redirect(`/listings/${id}`)
}));




module.exports=router;