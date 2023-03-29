const express = require("express");
const ItemModel = require("../db/item.model");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let include_deleted = req.query.include_deleted;
    let items = await ItemModel.find(
      include_deleted
        ? {}
        : {
            deleted_at: { $exists: false },
          }
    );
    res.json(items);
  } catch (error) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let item = await ItemModel.findById(id);
    res.json(item);
  } catch (error) {
    res.status(404).send("data is not found");
  }
});

router.post("/", async (req, res) => {
  try {
    let item = new ItemModel(req.body);
    item.created_at = Date.now();
    await item.save();
    res.status(201).json({ item: item, message: "item added successfully" });
  } catch (error) {
    res.status(400).send("adding new item failed");
  }
});

router.post("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let item = await ItemModel.findById(id);
    if (!item) {
      res.status(404).send("data is not found");
    } else {
      item.name = req.body.name;
      await item.save();
      res
        .status(200)
        .json({ item: item, message: "item updated successfully" });
    }
  } catch (error) {
    res.status(400).send("updating item failed");
  }
});

router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let item = await ItemModel.findById(id);
    if (!item || item.deleted_at) {
      res.status(404).send("data is not found");
    } else {
      item.deleted_at = Date.now();
      await item.save();
      res
        .status(200)
        .json({ item: item, message: "item deleted successfully" });
    }
  } catch (error) {
    res.status(400).send("updating item failed");
  }
});

module.exports = router;
