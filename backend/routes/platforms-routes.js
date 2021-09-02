const express = require("express");
const { check } = require("express-validator");

const platformControllers = require("../controllers/platforms-controllers");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/:pfid", platformControllers.getPlatformById);

router.get("/user/:uid", platformControllers.getPlatformsByUserId);

router.use(checkAuth);

router.post(
  "/",
  [check("name").not().isEmpty()],
  platformControllers.createPlatform
);

router.patch(
  "/:pfid",
  [check("name").not().isEmpty(), check("description").isLength({ min: 5 })],
  platformControllers.updatePlatform
);

router.delete("/:pfid", platformControllers.deletePlatform);

module.exports = router;
