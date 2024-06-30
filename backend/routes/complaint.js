require("dotenv").config();
const express = require("express");
const Complaint = require("../models/Complaint");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const User = require("../models/User");

// Complaint routes (complaintRoutes.js)
router.post("/addcomplaints", fetchuser, async (req, res) => {
  try {
    const { title, desc, dept, imgPath, latitude, longitude } = req.body;

    // If there are errors, return bad requests and also errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const complaint = new Complaint({
      title,
      desc,
      dept,
      imgPath,
      latitude,
      longitude,
      user: req.user.id,
    });

    const savedComplaint = await complaint.save();
    res.json(savedComplaint);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Unexpected error occurred");
  }
});

// GET complaints filtered by department (for admin)
router.get("/complaints", fetchuser, async (req, res) => {
  try {
    let complaints;
    const user = await User.findById(req.user.id);
    if (user.isAdmin) {
      complaints = await Complaint.find({ dept: user.dept });
    } else {
      complaints = await Complaint.find({});
    }
    res.json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/reviewcomplaint/:id", async (req, res) => {
  try {
    const { review } = req.body;

    // Check if review field is already populated
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).send("Complaint not found");

    if (complaint.review) {
      return res.status(400).json({ msg: "Review already added" });
    }

    const newComplaint = {
      review,
      status: "Reviewed",
    };

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: newComplaint },
      { new: true }
    );

    res.json({ complaint: updatedComplaint });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Unexpected error occurred");
  }
});

router.put("/upvote/:id", fetchuser, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    // Check if user has already upvoted
    if (complaint.upvotes.includes(req.user.id)) {
      return res
        .status(400)
        .json({ msg: "You have already upvoted this complaint" });
    }

    // Add user's ID to upvotes array
    complaint.upvotes.push(req.user.id);
    await complaint.save();

    res.json({ msg: "Upvoted successfully" });
  } catch (error) {
    console.error("Error upvoting complaint:", error);
    res.status(500).send("Unexpected error occurred");
  }
});

module.exports = router;
