
import { useState } from "react";


const papersData = [
  {
    id: 1,
    subject: "Java",
    year: "2025",
    title: "Java Programming — 2025",
    file: "/papers/java-Question-paper.jpeg",
    questions: [
      "Explain the four pillars of OOP.",
      "What is the difference between an abstract class and an interface?",
      "Explain exception handling in Java.",
      "What is method overriding?"
    ]
  },
  {
    id: 2,
    subject: "DBMS",
    year: "2024",
    title: "DBMS — 2024",
    file: "/papers/DBMS-question-paper.jpg",
    questions: [
      "Explain primary key and foreign key.",
      "What is database normalization?",
      "Explain ACID properties.",
      "What is the difference between SQL and NoSQL?"
    ]
  },
  {
    id: 3,
    subject: "Computer Networks",
    year: "2025",
    title: "Computer Networks — 2025",
   file: "/papers/computer-networks-2025.jpg",
    questions: [
      "Explain the seven layers of the OSI model.",
      "What is the difference between TCP and UDP?",
      "Explain symmetric and asymmetric encryption.",
      "What is a digital certificate?"
    ]
  },
  {
    id: 4,
    subject: "HTML",
    year: "2024",
    title: "HTML — 2024",
    file: "/papers/HTML-Question-paper.webp",
    questions: [
      "What is HTML and why is it used?",
      "Explain block-level and inline elements.",
      "What are HTML forms?",
      "What is the difference between id and class?"
    ]
  },
  {
    id: 5,
    subject: "JavaScript",
    year: "2024",
    title: "JavaScript — 2024",
    file: "/papers/javaScript-question-paper.webp",
    questions: [
      "Explain var, let, and const.",
      "What are arrow functions?",
      "What is the difference between == and ===?",
      "Explain map(), filter(), and reduce()."
    ]
  }
];


function Papers() {
  const [subject, setSubject] = useState("All");
  const [year, setYear] = useState("All");
  const [selectedPaper, setSelectedPaper] = useState(null);

  const filteredPapers = papersData.filter((paper) => {
    const subjectMatch =
      subject === "All" || paper.subject === subject;

    const yearMatch =
      year === "All" || paper.year === year;

    return subjectMatch && yearMatch;
  });

  return (
    <section className="page">
      <h1>Previous Year Papers</h1>
      <p>Find practice papers by subject and year.</p>

      <div className="paper-filters">
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
         
<option value="All">All Subjects</option>
<option value="Java">Java</option>
<option value="DBMS">DBMS</option>
<option value="Computer Networks">Computer Networks</option>
<option value="HTML">HTML</option>
<option value="JavaScript">JavaScript</option>

        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="All">All Years</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>
      </div>

      {!selectedPaper ? (
        <div className="card-container">
          {filteredPapers.map((paper) => (
            <div className="card" key={paper.id}>
              <span className="paper-icon">📄</span>
              <h3>{paper.subject}</h3>
              <p>Year: {paper.year}</p>

              <button
  onClick={() => window.open(paper.file, "_blank")}
>
  View Paper
</button>
            </div>
          ))}

          {filteredPapers.length === 0 && (
            <p>No papers found for these filters.</p>
          )}
        </div>
      ) : (
        <div className="card paper-view">
          <button onClick={() => setSelectedPaper(null)}>
            ← Back to Papers
          </button>

          <h2>{selectedPaper.title}</h2>
          <p>Practice questions</p>

          <ol>
            {selectedPaper.questions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}

export default Papers;
