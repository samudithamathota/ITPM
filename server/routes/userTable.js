const express = require("express");
const router = express.Router();
const {
  userTableGetAll,
  userTableUpdate,
  userTableAdd,
  userTableGetOne,
  userTableDelete,
} = require("../routes/userTable");
router.post("/add", userTableAdd);
router.get("/getAll", userTableGetAll);
router.get("/get/id", userTableGetOne);
router.put("/update/id", userTableUpdate);
router.delete("/delete/id", userTableDelete);
module.exports = router;
