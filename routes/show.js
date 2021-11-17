const express = require('express');
const router = express.Router();
const User = require('../model/user');
const File = require('../model/file');



// https://expressjs.com/en/guide/routing.html route parameters
router.route('/:uuid')

.get(async(req, res) => {
    try {
        console.log('------------------');
        console.log(req.params);
        // https://mongoosejs.com/docs/api.html#model_Model.findOne
        const f = await File.findOne({ uuid: req.params.uuid });
        console.log(f);
        if (!f) {
            return res.render('download', { someMsg: 'Link has been  expired' });
        }
        return res.render('download', {
            uuid: f.uuid,
            fileName: f.filename,
            fileSize: f.size,
            downloadUrl: `${process.env.APP_BASE_URL}/files/download/${f.uuid}`
        });
    } catch (err) {
        return res.json({ error: err.message });
    }
})

.post(function(req, res) {
    // store file
    upload(req, res, async(err) => {
        try {
            // chk if file uploaded or not
            if (!req.file) {
                return res.status(400).json({
                    err: 'all fields are required'
                });
            }
            if (err) { return res.status(500).send({ error: err.message }); }
            //
            console.log(req.file);
            const file = new File({
                filename: req.file.filename,
                uuid: uuid4(),
                path: req.file.path,
                size: req.file.size
            });
            const response = await file.save();
            return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
        } catch (err) {
            return res.json({ error: err.message });
        }
    });
});

router.route('/download/:uuid')

.get(async(req, res) => {
    try {
        console.log(req.params);
        // https://mongoosejs.com/docs/api.html#model_Model.findOne
        const f = await File.findOne({ uuid: req.params.uuid });
        console.log(f);
        if (!f) {
            return res.render('download', { someMsg: 'Link has been  expired' });
        }
        const filePath = `${__dirname}/../${f.path}`;
        console.log(filePath);
        res.download(filePath);
        // res.send("hello world");
    } catch (err) {
        return res.json({ error: err.message });
    }
});

module.exports = router;