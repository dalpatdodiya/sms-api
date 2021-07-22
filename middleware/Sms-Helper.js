//const AWS = require('aws-sdk')
const SNS = require("../aws-config");

module.exports.sendSMS = (msg, phoneNumber) => {
  return SNS.publish({
    Message: msg,
    PhoneNumber: phoneNumber,
  }).promise();
};

module.exports.InsertToSandbox = (number) => {
  var params = {
    /* required */ PhoneNumber: number /* required */,
  };
  return SNS.createSMSSandboxPhoneNumber(params).promise();
};
module.exports.sendOtp = (otp, number) => {
  var params = {
    OneTimePassword: otp /* required */,
    PhoneNumber: number /* required */,
  };
  return SNS.verifySMSSandboxPhoneNumber(params).promise();
};
module.exports.deleteFromSandbox = (number) => {
  var params = {
    PhoneNumber: number /* required */,
  };
  return SNS.deleteSMSSandboxPhoneNumber(params).promise();
};
