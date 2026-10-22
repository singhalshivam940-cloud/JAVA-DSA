
import { useEffect, useState } from "react";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
const [editForm, setEditForm] = useState({
  subject: "",
  title: "",
  content: ""
});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchNotes() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/notes"
      );

      if (!response.ok) {
        throw new Error("Notes fetch failed");
      }

      const data = await response.json();
      setNotes(data);
    } catch (error) {
      setMessage("Notes load nahi hue. Backend check karo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!subject.trim() || !title.trim()) {
      setMessage("Subject aur title fill karna zaroori hai.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/notes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            subject,
            title,
            content
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Note save nahi hua.");
      }

      setNotes((previousNotes) => [...previousNotes, data]);
      setSubject("");
      setTitle("");
      setContent("");
      setMessage("Note successfully save ho gaya!");
    } catch (error) {
      setMessage(error.message || "Backend se connection nahi hua.");
    } finally {
      setSaving(false);
    }
  }
  
  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Kya tum is note ko delete karna chahte ho?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setNotes((previousNotes) =>
        previousNotes.filter((note) => note._id !== id)
      );

      setMessage("Note successfully delete ho gaya!");
    } catch (error) {
      setMessage(error.message || "Note delete nahi hua.");
    }
  }
  
function startEdit(note) {
  setEditingId(note._id);

  setEditForm({
    subject: note.subject,
    title: note.title,
    content: note.content || ""
  });

  setMessage("");
}

function handleEditChange(e) {
  const { name, value } = e.target;

  setEditForm((previous) => ({
    ...previous,
    [name]: value
  }));
}

async function handleUpdate(e) {
  e.preventDefault();

  try {
    const response = await fetch(
      `http://localhost:5000/api/notes/${editingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editForm)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Update failed");
    }

    setNotes((previousNotes) =>
      previousNotes.map((note) =>
        note._id === editingId ? data : note
      )
    );

    setEditingId(null);
    setMessage("Note successfully update ho gaya!");
  } catch (error) {
    setMessage(error.message || "Note update nahi hua.");
  }
}

  return (
    <section className="page">
      <h1>Study Notes</h1>
      <p>Add new notes and save them in MongoDB.</p>

      <form onSubmit={handleSubmit} className="note-form">
        <input
          type="text"
          placeholder="Subject (e.g. Java)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          type="text"
          placeholder="Note title (e.g. OOP Concepts)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Write your notes here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="5"
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add Note"}
        </button>
      </form>

      {message && <p>{message}</p>}
        
{editingId && (
  <form onSubmit={handleUpdate} className="note-form">
    <h2>Edit Note</h2>

    <input
      name="subject"
      value={editForm.subject}
      onChange={handleEditChange}
      placeholder="Subject"
      required
    />

    <input
      name="title"
      value={editForm.title}
      onChange={handleEditChange}
      placeholder="Title"
      required
    />

    <textarea
      name="content"
      value={editForm.content}
      onCh ange={handleEditChange}
      placeholder="Content"
      rows="5"
    />

    <button type="submit">Save Changes</button>

    <button
      type="button"
      className="cancel-btn"
      onClick={() => setEditingId(null)}
    >
      Cancel
    </button>
  </form>
)}

      <h2>All Notes</h2>


{/* Search input */}
<input
  type="text"
  className="search-input"
  placeholder="Search by subject or title..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

{/* Subject dropdown */}
<select
  className="subject-filter"
  value={selectedSubject}
  onChange={(e) => setSelectedSubject(e.target.value)}
>
  <option value="All">All Subjects</option>

  {[...new Set(notes.map((note) => note.subject))].map(
    (subject) => (
      <option key={subject} value={subject}>
        {subject}
      </option>
    )
  )}
</select>


      {loading ? (
        <p>Loading notes...</p>
      ) : notes.length === 0 ? (
        <p>No notes available yet.</p>
      ) : (
       <div className="notes-grid">
  {notes
    .filter((note) =>
      `${note.title} ${note.subject}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .map((note) => (
<div className="note-card" key={note._id}>
  <h3>{note.title}</h3>

  <p>
    <strong>Subject:</strong> {note.subject}
  </p>

  <p>{note.content}</p>
            
<button
  type="button"
  className="edit-btn"
  onClick={() => startEdit(note)}
>
  Edit Note
</button>

  <button
    className="delete-btn"
    onClick={() => handleDelete(note._id)}
  >
    Delete Note
  </button>
</div>

          ))}
        </div>
      )}
    </section>
  );
}

export default Notes;
