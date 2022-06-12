const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require('dotenv').config()

const app = express();

app.use(bodyParser.urlencoded({extended: true}));    // it is used to post the requests made by users

app.use(express.static("public"));      // use express to make static css and image files to your signup.html file

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");     // directing home route
});

app.post("/", function(req, res){
  const firstName = req.body.fName;     // by using body-parser extracting dat from signup.html page
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {                        // declearing mailchimp.com API Parameters
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }
  const jsonData = JSON.stringify(data);

  const url = "https://us14.api.mailchimp.com/3.0/lists/3909848fb0";      // where you want to post
  const options = {                                                       // request options declearing method:post and auth: "name:api-key"
    method: "POST",
    auth: process.env.AUTH_API_KEY
  }
  const request = https.request(url, options, function(response){         // posting the data to this url
    response.on("data", function(data){
    console.log(JSON.parse(data));

  if (response.statusCode === 200){
    res.sendFile(__dirname + "/success.html");
  } else {
    res.sendFile(__dirname + "/failure.html");
  }
    })
  })

  request.write(jsonData);                                                // posting data
  request.end();                                                          // end of post
})

app.post("/failure", function(req, res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});