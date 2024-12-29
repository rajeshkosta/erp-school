const express = require("express");
const bodyParser = require("body-parser");
const sanitizeRequest = require('express-sanitize-middleware');
const parent = require("../routes/parent");
const student = require("../routes/studentRoutes");
const studentAdmission = require("../routes/studentAdmission");
const feeconfig = require("../routes/feesconfig");
const transaction = require("../routes/transaction");

module.exports = function (app) {
    app.use(express.json());
    app.use(function (err,req, res, next) {
        if (err) {
            console.error("-- INSIDE PARSER ERROR --");
            console.error(err);
            return res.sendStatus(400); 
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        res.header("Server", "");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
        );
        next();
    });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use([
        sanitizeRequest({
            body: true,
            header: true,
            params: true,
            query: true
        })
    ])
    let removeCSVInjection = function (req, res, next) {
        
        if (req.body) {
            const riskyChars = ["=", "+", "-", "@", "|"];
            for (key in req.body) {
                if (req.body && req.body[key] && typeof req.body[key] == 'string') {
                    if (riskyChars.indexOf(req.body[key].charAt(0)) >= 0) {
                        req.body[key] = req.body[key].slice(1)
                    }
                    req.body[key]= req.body[key].replace(/{|}|,|>|<|=/g, '');
                }
            }
        }
        next()
    }

    app.use(removeCSVInjection);
    app.use("/api/v1/registration/parent", parent) 
    app.use("/api/v1/registration/student", student)
    app.use("/api/v1/registration/admission",studentAdmission)
    app.use("/api/v1/registration/feeconfig",feeconfig)
    app.use("/api/v1/registration/transaction",transaction)

};
