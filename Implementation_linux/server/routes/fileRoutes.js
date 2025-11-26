const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
    getAllContacts, 
    createContact,
    getContact,
    updateContact,
    deleteContact,
    addContactForm,
    editFile,
    saveFile,
    getLogFile,
    drawLayout
    //drawLayout_ver2
    // ,
    // adddir,
    // createDir
} = require('../controllers/fileController');

router.route('/')
    .get(getAllContacts);

router.route('/add')
    .get(addContactForm)
    .post(upload.single('uploadFile'), createContact);

// router.route('/add-directory')
//     .get(adddir)
//     .post(createDir);

router.route('/:id')
    .get(getContact)
    .put(updateContact)
    .delete(deleteContact);

router.route('/:id/edit')
    .get(editFile)
    .put(saveFile);

router.route('/:id/edit/logs')
    .get(getLogFile);

router.route('/:id/edit/draw')
    .post(drawLayout);
    // .post(drawLayout);
    

module.exports = router;
