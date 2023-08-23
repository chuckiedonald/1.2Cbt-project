const express = require("express");
const router = express.Router();

// home
router.get("/", (req, res) => {
  res.render("index");
});

// login
router.get("/login", (req, res) => {
  profileImg = null;
  profileName = "Admin name";
  res.render("login");
});

// student login
router.get("/examlogin", (req, res) => {
    res.render("examlogin");
  });

// Admin registration
router.get("/becomeExaminer", (req, res) => {
    res.render("register");
});




// authentication code
router.get("/autCode", (req, res) => {
  res.render("register", { da: "okay" });
});


module.exports = router;