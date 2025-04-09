if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

 

 
const express=require("express");
const methodOverride=require("method-override");
const path=require('path');
const mongoose = require('mongoose'); 
const ejsMate=require("ejs-mate");
const listingRouter = require("./router/listing.js");
const reviewRouter = require("./router/review.js");
const userRouter = require("./router/user.js");
const User = require('./models/user');
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
 
const app=express();
 
app.set("view engine","ejs");   
app.set("views",path.join(__dirname,"views"));

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"/public")));
app.engine('ejs', ejsMate);


const store=MongoStore.create({
  mongoUrl: process.env.ATLAS_URL,
  touchAfter: 24 * 3600, // time period in seconds
  crypto : {
    secret: process.env.SECRET_CODE
  }
});

store.on("error",(err)=>{
  console.log("Error in MONGO SESSION STORE",err);
});

const sessionoption={
  store,
  secret: process.env.SECRET_CODE,
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionoption));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

const MONGO_URL="mongodb://127.0.0.1:27017/DatabaseNew";


async function main() {
  await mongoose.connect(process.env.ATLAS_URL);
  console.log("databse connected")
// use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
};


main().catch(err => console.log(err));

app.use(flash());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});

app.get("/",(req,res)=>{
  res.redirect("/listings");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.use((err,req,res,next)=>{
  // console.log("------ERROR-------"); 
  // console.log("err.message : ",err.message );
  let { status=501,message="something went wrong" }=err;
  res.status(status).render("error.ejs",{ message }); 
  // console.log("final",err.message,"finais");
  // res.status(err.status).send( err.message);
});

app.get("/",(req,res)=>{
  res.send("hi i am the root"); 
}); 
 

app.use((req,res)=>{
  res.send("Page Not Found");
});

app.listen(8080,()=>{
    console.log("app is listening at port 8080");
}); 


// can you say why america is the greatest country the world.

// diversity and opportinity


// with a straight face you're gonna tell students that america is so star spurgled awesome that we're the
//  only ones in the world who have


