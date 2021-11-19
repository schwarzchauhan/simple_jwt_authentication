const express = require('express');
const router = express.Router();
const User = require('../model/user');
// http://expressjs.com/en/resources/middleware/multer.html
const multer = require('multer');
const File = require('../model/file');
const { v4: uuid4 } = require('uuid'); // https://github.com/uuidjs/uuid#quickstart

// https://github.com/expressjs/multer/issues/591
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(__dirname);
        cb(null, `./public/uploads`)
    },
    filename: (req, file, cb) => {
        console.log(file);
        const ext = file.mimetype.split("/")[1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
    }
});
let upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // file size in bytes, 10 MB
}).single('myFile'); // 'myFile' should be name attribut in our upload  forrm

router.route('/')

.get((req, res) => {
    res.render('fileupload');
})

.post(function(req, res) {
    console.log('----------- /api/file POST');
    // store file
    upload(req, res, async(err) => {
        try {
            if (err) { return res.status(500).send({ error: err.message }); }

            // chk if file uploaded or not
            if (!req.file) {
                return res.status(400).json({
                    error: 'all fields are required'
                });
            }

            //
            console.log(req.file);
            // https://stackoverflow.com/questions/53082599/multer-path-of-the-file-isnt-right
            const file = new File({
                filename: req.file.filename,
                uuid: uuid4(),
                path: `${req.file.destination}/${req.file.filename}`,
                size: req.file.size
            });
            const response = await file.save();
            // return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
            return res.render('fileupload', { downloadUrl: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
        } catch (err) {
            return res.json({ error: err.message });
        }
    });
});

router.route('/mail')

.post(async(req, res) => {
    try {
        return res.status(200).json(req.body);
    } catch (err) {
        return console.log(err.message);
    }
})

module.exports = router;