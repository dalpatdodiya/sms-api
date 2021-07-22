const nodemailer = require('nodemailer');
const path = require('path');
//const img = require('fs').readFileSync("D:/Sms-Api/images/flawer.jpg");
require('dotenv').config();

module.exports.sendEmail = (email) => {

    const imageUrl = (path.join(__dirname,'../images/flawer.jpg')).split('\\').join('/');
    //const newImageUrl = imageUrl.split('\\').join('/').toString();
    console.log(imageUrl)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL.toString(),
            pass: process.env.PASS.toString(),
        }
    });
    
    const mailOptions = {
        from: process.env.EMAIL.toString(),
        to: email,
        subject: 'Sending Email using Node.js',
        html: '<h1> Vaistra Technology Welcome You </h1> <p><b> Hello , </b></p>',
        text: 'This mail from Node api to test Email Services !',
        
        attachments: [
            {
                filename: 'flower.jpg',
                //contents: img,
                path: imageUrl
                //path: 'D:/Sms-Api/images/flower.jpg'
                //cid: 'uniq-mailtrap.png'
            }
                // String attachment
            // {
            //     filename: 'notes.txt',
            //     content: 'Some notes about this e-mail',
            //     contentType: 'text/plain' // optional, would be detected from the filename
            // },

            // // Binary Buffer attachment
            // {
            //     filename: 'image.png',
            //     content: Buffer.from(
            //         'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
            //             '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
            //             'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
            //         'base64'
            //     ),

            //     cid: 'note@example.com' // should be as unique as possible
            // },

            // // File Stream attachment
            // {
            //     filename: 'nyan cat ✔.gif',
            //     path: __dirname + '/assets/nyan.gif',
            //     cid: 'nyan@example.com' // should be as unique as possible
            // }
         ]

    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log(error);
        } else {
            console.log('Email Sent : ', info.response)
            return info.response;
        }
    });
}


