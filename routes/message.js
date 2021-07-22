const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const smsHelper = require("../middleware/Sms-Helper");
const emailHelper = require("../middleware/Email-Helper");

router.post("/register", (req, res) => {
  const msg = new Message({
    name: req.body.name,
    email: req.body.email,
    mobileno: req.body.number,
  });
  msg
    .save()
    .then((data) => {
      // if(data){
      //     return res.status(403).json({ message: "User Exists . . . . "})
      // }
      console.log(" Save Data :", data);
      const verifyNo = smsHelper.InsertToSandbox(req.body.number);
      return verifyNo;
      // verifyNo.then( data => {
      //     console.log(data);
      //     const getOtp = smsHelper.sendOtp(req.body.number);
      //     return getOtp;
    })
    .then((verifyno) => {
      if (verifyno) {
        //msg.save();
        res.status(200).json({ message: "User Registered", result: msg.mobileno });
      }
      //msg.save()
    })
    .catch((err) => {
      console.log("Register Error : ", err);
    });
});

router.post("/verifyOtp", (req, res) => {
  const getOtp = smsHelper.sendOtp(req.body.otp, req.body.number);
  getOtp
    .then((data) => {
      console.log(data);
      Message.findOne({ where: { mobileno: req.body.number } })
        .then((result) => {
          if (!result) {
            return res.status(404).json({ message: " Invalid OTP" });
          }
          console.log("result : ", result);
          return result.update(
            { verify: true },
            { where: { mobileno: req.body.number } }
          );
        })
        .then(() => {
          res.status(200).json({ Message: "OTP Verified ", data: data });
        })
        .catch((err) => {
          console.log("Try Again: ", err);
        });
    })
    .catch((err) => {
      console.log("Register Error : ", err);
    });
});

router.post("/sendOtp", (req, res) => {
  Message.findOne({ where: { mobileno: req.body.number } })
    .then((result) => {
      if (!result) {
        return res.status(404).json({ Message: " User Not found" });
      }
      console.log(result);
      const tokenOTP = {
        otp: Math.floor(10000 + Math.random() * 999999),
        phoneNo: req.body.number,
        time: new Date()
      };
      const message = ` Your OTP is ${tokenOTP.otp} valid for 5 mins - Team Vaistra Technology.`;
      const getOtp = smsHelper.sendSMS(message, tokenOTP.phoneNo);
      result.update(
        { otp: tokenOTP.otp, otpGenAt: tokenOTP.time },
        { where: { mobileno: req.body.number } }
      );
      return { getOtp, result };
    })
    .then((data) => {
      console.log("get OTP :", data.getOtp);
      data.getOtp.then((success) => {}).catch();
      res
        .status(200)
        .json({ Message: " OTP Sent !!", result: data.result.mobileno });
    })
    .catch((err) => {
      console.log("Try Again: ", err);
    });
});

router.post("/validateOtp", (req, res) => {
  Message.findOne({ where: { mobileno: req.body.number } })
    .then((result) => {
      const currentDate = new Date();
      //console.log("Current Date : ",currentDate)
      const time = Math.abs(
        (currentDate.getTime() - result.otpGenAt.getTime()) / 60000
      );
      if (!result || result.otp !== +req.body.otp) {
        return res.status(404).json({ Message: "Try Again  . . . " });
      }
      if (time > 5) {
        result.update({ otp: null, otpGenAt: null}, { where: { mobileno: req.body.number } })
        return res.status(303).json({ Message: "Please Insert new OTP your OTP Expired . . . " });
      }
      result.update({ otp: null }, { where: { mobileno: req.body.number } });
      return res.status(200).json({
        message: "OPT Validate Successfully ",
        Result: result.mobileno,
      });
    })
    .catch((err) => {
      console.log("Try Again: ", err);
    });
});

router.post("/sendEmail", async (req, res) => {
  Message.findOne({ where: { mobileno: req.body.number } })
    .then((result) => {
     return info = emailHelper.sendEmail(result.email);
    })
    .then((info) => {
      res.status(200).json({ Message: " Email Sent Successfully"});
    })
    .catch((err) => {
      console.log("Try Again: ", err);
    });
});

router.get("/emailBroadcast", (req, res) => {
  Message.findAll({ attributes: ["email"] })
    .then((result) => {
      const emailList = result.map((e) => e.email);
      return emailHelper.sendEmail(emailList);
    })
    .then((success) => {
      return res
        .status(200)
        .json({ Message: " Email Sent Successfully !!", List: success });
    })
    .catch((err) => {
      console.log("Try Again: ", err);
    });
});

module.exports = router;
