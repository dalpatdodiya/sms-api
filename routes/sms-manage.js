const express = require("express");
const AWS = require("aws-sdk");

const router = express.Router();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

AWS.config.apiVersions = {
  sns: "2010-03-31",
};

//Add Phone Number to SandBox
router.post("/addPhoneNumber", (req, res) => {
  
  var inparams = {
    PhoneNumber: req.body.number,
    //LanguageCode: 'en-US | en-GB | es-419 | es-ES | de-DE | fr-CA | fr-FR | it-IT | ja-JP | pt-BR | kr-KR | zh-CN | zh-TW',
  }
  
  const insertSandbox = new AWS.SNS().createSMSSandboxPhoneNumber(inparams).promise();

  insertSandbox.then(function(data) {
         console.log("Inserted Phone Number to SandBox: ", data.ResponseMetadata.RequestId);
         //res.redirect('/verityOtp', {number: req.body.number})
      })
      .catch( function(err) {
        console.log("error",err);
      })
});

//Verify Phone Number to SandBox
router.post("/verifyOtp", (req, res) => {
  var params = {
    OneTimePassword: req.body.otp, /* required */
    PhoneNumber: req.body.number /* required */
  };
  const verifyPhoneOtp = new AWS.SNS().verifySMSSandboxPhoneNumber(params)
    .promise();
  verifyPhoneOtp.then( data => {
    console.log(data);  
    res.status(200).json({ verified: data});
  }).catch( err => {
    console.log(err, err.stack);
  });
});

// Create AWS SNS Topic and List Topics createTopic/listTopics/deleteTopic/getTopicAttributes/setTopicAttributes
router.get("/createTopic", (req, res) => {

  //List Topics
  var listTopicPromise = new AWS.SNS().listTopics({}).promise();
  listTopicPromise
    .then(function (data) {
      console.log("Topic list ", data.Topics);
      res.status(200).json({ TopicArnList: data.Topics.Name });
    })
    .catch(function (err) {
      console.error(err, err.stack);
    });

  //Create Topic in SNS
  // var createTopicPromise  =  new AWS.SNS({apiVersion: '2010-03-31'}).createTopic({Name: "Dalpat-App"}).promise();
  // createTopicPromise.then(
  // function(data) {
  //   //topicArn = data.TopicArn;
  //   console.log("Topic ARN is " + data.TopicArn);
  // }).catch(
  //   function(err) {
  //   console.error(err, err.stack);
  // });
});


//Publish Message to Topic
router.post("/publish", (req, res) => {
  var params = {
    Message: req.body.message /* required */,
    TopicArn: process.env.AWS_Dalpat_App_TPA,
    Subject: "Welcome Message",
    // MessageStructure: 'string',
    // MessageAttributes: {
    //     'AWS.SNS.SMS.SMSType': {
    //         'DataType': 'String',
    //         'StringValue': "Transactional"
    //     }
    // }
  };
  var publishTextPromise = new AWS.SNS().publish(params).promise();
  publishTextPromise.then(function (data) {
      console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
      console.log("MessageID is " + data.MessageId);
      res.status(200).json({ data: data });
    })
    .catch(function (err) {
      console.error(err, err.stack);
    });
});

//Subscribe Topin to get msg createTopic/listTopics/deleteTopic/getTopicAttributes/setTopicAttributes
router.post("/subscribe", (req, res) => {
  //console.log("Topic Arn :"+topicArn)
  var params = {
    Protocol: "SMS" /* required */,
    TopicArn: "arn:aws:sns:ap-south-1:845085236904:Dalpat-App" /* required */,
    Endpoint: req.body.number,
  };
 
  var subscribePromise = new AWS.SNS().subscribe(params).promise();
  // Handle promise's fulfilled/rejected states
  subscribePromise
    .then(function (data) {
      console.log("Subscription ARN is " + data.SubscriptionArn);
      res.status(200).json({ Data: data });
    })
    .catch(function (err) {
      console.error(err, err.stack);
    });

 
});

router.post('/send_otp', async function (req, res) {
  try{
      const tokenOTP = {
          otp: Math.floor(10000 + Math.random() * 99999),
          phoneNo: req.body.number
      }
      const message = ` Your OTP is ${tokenOTP.otp} valid for 5 mins - Team Vaistra Technology.`
      await smsAPI.sendSMS(message, tokenOTP.phoneNo);
      res.send("OTP Sent");
  } catch(err) {
      console.log(err);
  }
});

module.exports = router;
