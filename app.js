const mongoose = require("mongoose");
const express = require("express");
require('dotenv').config();
const bodyParser = require("body-parser");
const {JSDOM} = require("jsdom");
const {window} = new JSDOM('');
const DOMPurify = require("dompurify")(window);
const ejs = require("ejs");
// var _ = require('lodash');
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');

const app = express();

// import routes
const noneauthRoute = require("./routes/noneauth");
app.use(noneauthRoute);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Configure express-session
app.set("trust", 1);
app.use(
  session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
  })
);

//app use passport and also initialize passport to use session with passport
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/CbtDB");

const userSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  password: String,
  googleId: String
});

//This will help hash and save our user to mongo
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("user", userSchema);

//passport local configuration
   passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

let googleUserInfo = null;
let profileImg = null;
let profileName = null;
passport.use(new GoogleStrategy({
  clientID: process.env.client_ID,
  clientSecret: process.env.client_Secret,
  callbackURL: "http://localhost:3000/auth/google/admin",

},
 
function(accessToken, refreshToken, profile, cb) {
  googleUserInfo = profile;
  profileImg = profile.photos[0].value;
  profileName = profile.displayName;
  User.findOrCreate({username: profile.emails[0].value},{googleId: profile.id}, function (err, user) {
    return cb(err, user);
  });
}
));


app.get('/auth/google', 
  passport.authenticate('google', {
    scope: ['profile','email']
  })
);

app.get("/auth/google/admin", 
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect admin.
    User.findOne({username:googleUserInfo.emails[0].value}).then((User)=>{
      // Update fullname for google login
      if(!User.fullName){
        familyName = googleUserInfo.name.familyName;
        givenName = googleUserInfo.name.givenName;
        if(familyName==undefined){familyName = givenName}
        if(givenName==undefined){givenName = familyName}
          User.fullName = `${familyName} ${givenName}`;
          User.save();
      }
      if(!User.googleId){
          User.googleId = googleUserInfo.id;
          User.save();
      }
    })
    res.redirect("/admin");
  });

  


app.get("/admin", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("admin-pannel",{profilePic:profileImg,adminName:profileName});
  } else {
    res.redirect("/login");
  }
});


// login or registration authorisation
app.post("/register", (req, res) => {
  const newUser = new User({
    username: DOMPurify.sanitize(req.body.username),
    fullName: DOMPurify.sanitize(req.body.name)
  }) 
  User.register(newUser,DOMPurify.sanitize(req.body.password),function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/becomeExaminer");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/login");
        });
      }
    }
  );
});

let question = [
  {
    qnt:"This is qnt1",
    opt1:"Question 1 opt1",
    opt2:"question 1 opt2",
    opt3:"question 1 opt3",
    ans:"ans for qnt1",
    id:1
  },
  {
    qnt:"This is qnt2",
    opt1:"question 2 opt1",
    opt2:"question 2 opt2",
    opt3:"question 2 opt3",
    ans:"ans for qnt2",
    id:2
  },
  {
    qnt:"This is qnt3",
    opt1:"question 3 opt1",
    opt2:"question 3 opt2",
    opt3:"question 3 opt3",
    ans:"ans for qnt3",
    id:3
  },
]

opt = ["opt1","opt2","opt3","ans"];
function shuffleArray(array){
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


let userId = null;
// authentication code
app.post("/verifyUser", (req, res, next) => {

   // Sanitize user input
   const sanitizedEmail = DOMPurify.sanitize(req.body.username);
   const sanitizedPassword = DOMPurify.sanitize(req.body.password);
   async function id(){
    userId = await User.find({username:sanitizedEmail});
  }
  id();
  passport.authenticate("local", (err, user, info) => {
    profileName = user.fullName;
    if (err) {
      console.error(err);
      return res.redirect("/login");
    }
    if (!user) {
      // Incorrect credentials, redirect back to the login route
      return res.redirect("/login");
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error(err);
        return res.redirect("/login");
      }
      // userId = req.user.id;

      return res.redirect("/admin");
    });
  })(req, res, next);
});

//Exmaination timmer 
let sec = 60;
let hr = 2;
let min = 1;
app.get("/timmer",(req,res)=>{
  res.send({h:hr,m:min,s:sec,stat:'true',id:userId[0].id,questions:shuffleArray(question),opt:shuffleArray(opt)});
})

app.get("/examination_page",(req, res)=>{
  if(req.isAuthenticated()){
    res.render("exam_page",{questions:question,userInfo:userId[0]});
  }else {
    res.redirect("/login");
  }
})



//submitted exam
app.post("/submitexam/:numQnt",(req, res)=>{
    for(let i = 0; i < req.params.numQnt; i++){
      for(let u=0;u<question.length;u++){
        if(question[u].id == req.body['qntId'+i]){
          if(req.body['same'+i] == question[u].ans){
            console.log("your answer was correct +5marks")
            // add mark here there after you calculate the % and grade
          }
        }
      }
    }
})


//add questions
app.get("/addQuestion", (req, res)=>{
  if(req.isAuthenticated()){
    res.render("addQuestions");
  }else{
    res.redirect("/login");
  }
})

app.listen(3000, () => {
  console.log("server running on port 3000");
});
