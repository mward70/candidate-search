import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Candidate } from "../interfaces/Candidate.interface";

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSavedCandidates = () => {
      try {
        const saved = localStorage.getItem("savedCandidates");
        if (saved) {
          setSavedCandidates(JSON.parse(saved)); // ✅ Ensure it loads correctly
        }
      } catch (error) {
        console.error("Error loading saved candidates:", error);
      }
    };

    loadSavedCandidates();

    window.addEventListener("storage", loadSavedCandidates); // ✅ Update on storage changes

    return () => {
      window.removeEventListener("storage", loadSavedCandidates);
    };
  }, []);

  if (savedCandidates.length === 0) {
    return (
      <div>
        <h2>No candidates have been accepted.</h2>
        <button onClick={() => navigate("/", {replace: true})}>Back to Search</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Potential Candidates</h1>
      {savedCandidates.map((candidate) => (
        <div key={candidate.username}>
          <h2>
            {candidate.name} (@{candidate.username})
          </h2>
          <img src={candidate.avatar} alt={`${candidate.name}'s avatar`} width={100} />
          <p>Location: {candidate.location}</p>
          <p>Email: {candidate.email}</p>
          <p>Company: {candidate.company}</p>
          <a href={candidate.html_url} target="_blank" rel="noopener noreferrer">
            GitHub Profile
          </a>
        </div>
      ))}
    </div>
  );
};

export default SavedCandidates;
