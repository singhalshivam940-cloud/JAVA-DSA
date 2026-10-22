
import { useEffect, useState } from "react";

function Revision() {
  const [topics, setTopics] = useState([]);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  async function fetchTopics() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/revisions"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch revision topics");
      }

      const data = await response.json();
      setTopics(data);
    } catch (error) {
      setMessage("Backend connect nahi hua. Server check karo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTopics();
  }, []);

  const subjects = [
  "All",
  ...new Set(topics.map((topic) => topic.subject))
];

const filteredTopics =
  selectedSubject === "All"
    ? topics
    : topics.filter(
        (topic) => topic.subject === selectedSubject
      );
  const completedCount = topics.filter(
    (topic) => topic.completed
  ).length;

  const progress = topics.length
    ? Math.round((completedCount / topics.length) * 100)
    : 0;

  async function addTopic(e) {
    e.preventDefault();
    setMessage("");

    if (!subject.trim() || !title.trim()) {
      setMessage("Subject aur topic dono fill karo.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/revisions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            subject: subject.trim(),
            topic: title.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Topic add nahi hua");
      }

      setTopics((previous) => [...previous, data]);
      setSubject("");
      setTitle("");
      setMessage("Topic successfully added!");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function toggleTopic(topic) {
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/revisions/${topic._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            completed: !topic.completed
          })
        }
      );

      const updatedTopic = await response.json();

      if (!response.ok) {
        throw new Error(
          updatedTopic.message || "Status update nahi hua"
        );
      }

      setTopics((previous) =>
        previous.map((item) =>
          item._id === updatedTopic._id
            ? updatedTopic
            : item
        )
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  
async function deleteTopic(id) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/revisions/${id}`,
      {
        method: "DELETE"
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Topic delete nahi hua");
    }

    setTopics((previous) =>
      previous.filter((topic) => topic._id !== id)
    );

    setMessage("Topic successfully deleted!");
  } catch (error) {
    setMessage(error.message);
  }
}

  async function resetProgress() {
    const pendingTopics = topics.filter(
      (topic) => topic.completed
    );

    try {
      const results = await Promise.all(
        pendingTopics.map((topic) =>
          fetch(
            `http://localhost:5000/api/revisions/${topic._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                completed: false
              })
            }
          ).then(async (response) => {
            const data = await response.json();

            if (!response.ok) {
              throw new Error(
                data.message || "Progress reset nahi hua"
              );
            }

            return data;
          })
        )
      );

      setTopics((previous) =>
        previous.map((topic) => {
          const updated = results.find(
            (item) => item._id === topic._id
          );

          return updated || topic;
        })
      );

      setMessage("Revision progress reset ho gaya!");
    } catch (error) {
      setMessage(error.message);
      fetchTopics();
    }
  }

  return (
    <section className="page">
      <h1>Smart Revision</h1>
      <p>
        Track your preparation and revise every important topic.
      </p>

      <form className="note-form" onSubmit={addTopic}>
        <h2>Add Revision Topic</h2>

        <input
          type="text"
          placeholder="Enter subject (e.g. Java)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Enter topic (e.g. OOP Concepts)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <button type="submit">Add Topic</button>
      </form>

      {message && <p>{message}</p>}

      <div className="progress-card">
        <h2>Your Revision Progress</h2>

        <h1>{progress}%</h1>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p>
          {completedCount} of {topics.length} topics completed
        </p>
      </div>

      <h2 className="revision-heading">Your Topics</h2>

      
<div className="subject-filter">
  <label htmlFor="subjectFilter">Filter by subject: </label>

  <select
    id="subjectFilter"
    value={selectedSubject}
    onChange={(e) => setSelectedSubject(e.target.value)}
  >
    {subjects.map((subject) => (
      <option key={subject} value={subject}>
        {subject}
      </option>
    ))}
  </select>
</div>


      {loading ? (
        <p>Loading topics...</p>
      ) : topics.length === 0 ? (
        <p>No revision topics yet. Add your first topic above!</p>
      ) : (
        <div className="revision-list">
          {filteredTopics.map((topic) => (
            <label className="revision-item" key={topic._id}>
              <input
                type="checkbox"
                checked={topic.completed}
                onChange={() => toggleTopic(topic)}
              />

              <div>
                <strong>{topic.topic}</strong>
                <p>{topic.subject}</p>
              </div>

              <span>
                {topic.completed ? "Completed" : "Pending"}
              </span>
              
<button
  type="button"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteTopic(topic._id);
  }}
>
  Delete
</button>

            </label>
          ))}
        </div>
      )}

      <button
        className="reset-btn"
        onClick={resetProgress}
        disabled={loading || completedCount === 0}
      >
        Reset Progress
      </button>
    </section>
  );
}

export default Revision;
