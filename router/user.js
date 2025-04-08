const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport=require("passport");
// User.createStrategy();

const asyncWrap=(fn)=>{
    return function(req,res,next){
        fn(req,res,next).catch((err) => next(err))
    }
};

// signup Route
router.get("/signup",(req,res)=>{
    // console.log(req.isAuthenticated());
    res.render("user/signUpfrom.ejs");  
});

// post route
router.post("/signup",asyncWrap(async (req,res,next)=>{
    try{
        // console.log("req.body",req.body);
        let { username,email,password }=req.body;
        const newUser= new User({ username,email });  
        let registeredUser= await User.register(newUser,password);
         req.login(registeredUser,(err)=>{    //session create karta hai, taki user ko baar baar login na karna pade.
            if(err){
                return next(err);
            }
            res.redirect("/listings");
        });
        
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
})); 

router.get("/login",(req,res)=>{
    // console.log(req.isAuthenticated());
    res.render("user/login.ejs");  
});

router.post("/login",
    passport.authenticate('local', { 
    failureRedirect: '/login',
    failureFlash: true,
    }),
function(req, res) {
    // console.log("loginPOST",req.session.returnTo);
    // let redirect=req.session.returnTo || '/listings';
    // delete req.session.returnTo;
    req.flash("success","Welcome back to Wanderlust");
    res.redirect("/listings");
  }
);

router.get("/logout",(req,res,next)=>{
    console.log("log");  
    req.logOut((err)=>{
        if(err){ return next(err) };
        res.redirect("/listings"); 
    })
});

module.exports = router;