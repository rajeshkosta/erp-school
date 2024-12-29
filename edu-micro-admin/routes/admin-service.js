//IMPORTS
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
// const {initKafkaProducer, initKafkaConsumer} = require("edu-micro-common");
const {minioUtil} = require("edu-micro-common")

router.use(bodyParser.json({ limit: "5mb" }));
router.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

//ADMIN-SERVICE IS UP 
router.get('/', async (req, res) => {
    res.send("Admin service is up and running!!");
});

router.get('/listBucket', async (req, res) => {
    try {

        const bucktList = await minioUtil.listBucket()
        console.log("bucktList", bucktList);
        res.send(bucktList)

    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
});

router.get('/makeBucket/:bucketName', async (req, res) => {
    try {

        const bucketName = req.params.bucketName;
        const data = await minioUtil.makeBucket(bucketName);
        res.send(`${bucketName} Bucket Created Successfully`)

    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
});


module.exports = router;