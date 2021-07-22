const express = require('express');
//const AWS = require('aws-sdk');
const cors = require('cors');
const path = require('path');
//require('dotenv').config();
const sequelize = require('./config/db.config');

const sms = require("./routes/sms-manage");
const user = require("./routes/message");


const app = express();
const port = process.env.PORT || 3030;


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({message: " Welcome to SMS Sender App "});
})
app.use("/images", express.static(path.join(__dirname, "images")));

app.use('/sms',sms);
app.use(user);


sequelize.sync({
    //force: true
})
    .then(() => {
        console.log("Connection has benn Established Successfully");
        app.listen(port, () => {
            console.log(`Server is running in port ${port}`)
        });
    })
    .catch( err => {
        console.log(" Connection Error: ", err);
    })


