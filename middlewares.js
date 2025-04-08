const Listing=require("./models/listings");


module.exports.isLoggedIn=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Login First!");
    req.session.returnTo=req.originalUrl; 
    res.redirect("/login");
};

module.exports.isOwner=async (req,res,next)=>{
    let listing = await Listing.findById(req.params.id);
    if(listing.owner._id.equals(req.user._id)){
        return next();
    }
    req.flash("error","Yo are not owner of listing");
    req.session.returnTo=req.originalUrl; 
    res.redirect(`/listings/${ req.params.id }`);
};

module.exports.asyncWrap=(fn)=>{
    return function(req,res,next){
      fn(req,res,next).catch((err) => next(err)); 
    }
};