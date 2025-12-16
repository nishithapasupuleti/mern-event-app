const express = require("express");
const Event = require("../models/Event");

const router = express.Router();

// Create event
router.post("/create", async (req, res) => {
  try {
    const { title, description, date, capacity, createdBy } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      capacity,
      createdBy,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// RSVP to event
router.post("/rsvp/:eventId", async (req, res) => {
  try {
    const { userId } = req.body;
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.attendees.length >= event.capacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    if (event.attendees.includes(userId)) {
      return res.status(400).json({ message: "Already registered" });
    }

    event.attendees.push(userId);
    await event.save();

    res.json({ message: "RSVP successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
