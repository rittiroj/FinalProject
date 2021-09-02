const express = require('express');
const { check } = require('express-validator');

const partyControllers = require('../controllers/partys-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/', partyControllers.getPartys);

router.get('/:pid', partyControllers.getPartyById);

router.get('/user/:uid', partyControllers.getPartysByUserId);

router.use(checkAuth);

router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  partyControllers.createParty
);

router.patch(
  '/:pid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  partyControllers.updateParty
);

router.patch('/join/:pid', partyControllers.joinParty);

router.delete('/:pid', partyControllers.deleteParty);

module.exports = router;
