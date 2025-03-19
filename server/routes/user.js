const express = require("express");
const router = express.Router();
const {
  userAdd,
  userGetAll,
  userGetOne,
  userUpdate,
  userDelete,
} = require("../controllers/user");
router.post("/add", userAdd);
router.get("/getAll", userGetAll);
router.get("/get/id", userGetOne);
router.put("/update/id", userUpdate);
router.delete("/delete/id", userDelete);
module.exports = router;
