const express = require("express");
const bodyParser = require("body-parser");
const sanitizeRequest = require('express-sanitize-middleware');
const adminservice = require("../routes/admin-service");
const school = require("../routes/school");
const roles = require("../routes/roles");
const user = require("../routes/user");
const trustRoute = require("../routes/trustRoutes");
const examination = require("../routes/examinationRoutes");
const location = require("../routes/location");
const academicYear = require("../routes/academicYear");
const s3CDN = require('../routes/s3-cdn');
const subject = require("../routes/subject");
const section = require("../routes/section");
const master = require("../routes/master");
const { STATUS } = require('edu-micro-common');
const exam = require("../routes/examRoutes");
const fee = require("../routes/feeRoutes");
const feemaster = require("../routes/feeMasterRoutes")
const feeDiscount = require("../routes/feeDiscountRoutes")
const contactForm = require("../routes/contactForm")
const template = require("../routes/template")
const noticeRoute = require("../routes/noticeRoute");
const assignMarks = require("../routes/assignMarks");


module.exports = function (app, server) {
    app.use(express.json());
    //Enabling CORS
    app.use(function (err, req, res, next) {
        if (err) {
            return res.sendStatus(400); // Bad request
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        res.header("Server", "");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization "
        );
        next();
    });
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use([
        sanitizeRequest({
            body: true,
            header: true,
            params: true,
            query: true
        })
    ])
    let removeCSVInjection = function (req, res, next) {
        //CSV Injection
        if (req.body) {
            const riskyChars = ["=", "+", "-", "@", "|"];
            for (let key in req.body) {
                if (req.body && req.body[key] && typeof req.body[key] == 'string') {
                    if (riskyChars.indexOf(req.body[key].charAt(0)) >= 0) {
                        req.body[key] = req.body[key].slice(1)
                    }
                    req.body[key] = req.body[key].replace(/>|<|=/g, '');
                }
            }
        }
        next()
    }

    //console.log("ok--")
    app.use(removeCSVInjection)

    app.get('/api/v1/admin/health', async (req, res) => {
        try {
            return res.status(STATUS.OK).send("Admin Service is Healthy");
        } catch (error) {
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
        }
    });

    app.use("/api/v1/admin/adminService", adminservice);
    app.use("/api/v1/admin/school", school);
    app.use("/api/v1/admin/role", roles);
    app.use("/api/v1/admin/user", user);
    app.use("/api/v1/admin/location", location);
    app.use("/api/v1/admin/cdn", s3CDN);
    app.use("/api/v1/admin/academic_year", academicYear);
    app.use("/api/v1/admin/trust", trustRoute);
    app.use("/api/v1/admin/subject", subject)
    app.use("/api/v1/admin/examination", examination)
    
    app.use("/api/v1/admin/subject", subject);
    app.use("/api/v1/admin/section", section);
    app.use("/api/v1/admin/exam",exam);
    app.use("/api/v1/admin/master", master);
    app.use("/api/v1/admin/feetype", fee);
    app.use("/api/v1/admin/feemaster", feemaster)
    app.use("/api/v1/admin/feeDiscount", feeDiscount)
    app.use("/api/v1/admin/contactform",contactForm)
    app.use("/api/v1/admin/template",template)
    app.use("/api/v1/admin/noticeBoard",noticeRoute)
    app.use("/api/v1/admin/assignMarks",assignMarks)
};

