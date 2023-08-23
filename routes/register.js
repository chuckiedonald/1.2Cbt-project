const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
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


  module.exports = router;