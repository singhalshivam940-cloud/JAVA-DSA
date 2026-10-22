
const express = require("express");
const Note = require("./models/Note");
const Revision = require("./models/Revision");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Smart Study Platform Backend is running!");
});


app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/revisions", async (req, res) => {
  try {
    const revisions = await Revision.find();
    res.json(revisions);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

app.put("/api/revisions/:id", async (req, res) => {
  try {
    const updatedRevision = await Revision.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true, runValidators: true }
    );

    if (!updatedRevision) {
      return res.status(404).json({
        message: "Revision topic not found"
      });
    }

    res.json(updatedRevision);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});


app.delete("/api/revisions/:id", async (req, res) => {
  try {
    const deletedRevision =
      await Revision.findByIdAndDelete(req.params.id);

    if (!deletedRevision) {
      return res.status(404).json({
        message: "Revision topic not found"
      });
    }

    res.json({
      message: "Revision topic deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid revision ID"
    });
  }
});




app.post("/api/revisions", async (req, res) => {
  try {
    const newRevision = new Revision({
      subject: req.body.subject,
      topic: req.body.topic
    });



    const savedRevision = await newRevision.save();

    res.status(201).json(savedRevision);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});


app.post("/api/notes", async (req, res) => {
  try {
    const newNote = new Note({
      subject: req.body.subject,
      title: req.body.title,
      content: req.body.content
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(
      req.params.id
    );

    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    res.json({
      message: "Note deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid note ID"
    });
  }
});


app.put("/api/notes/:id", async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        subject: req.body.subject,
        title: req.body.title,
        content: req.body.content
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    res.json(updatedNote);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});


const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });