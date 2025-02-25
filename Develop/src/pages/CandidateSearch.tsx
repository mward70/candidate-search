import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Candidate } from "../interfaces/Candidate.interface";
import { searchGithub } from "../api/API";

const CandidateSearch = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Added loading state

  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem("savedCandidates");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("savedCandidates", JSON.stringify(savedCandidates));
  }, [savedCandidates]);

  // Fetch GitHub users
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      const users = await searchGithub();

      if (users.length > 0) {
        // Fetch detailed user data for each candidate
        const detailedCandidates = await Promise.all(
          users.map(async (user: any) => {
            const response = await fetch(`https://api.github.com/users/${user.login}`, {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
              },
            });
            const userData = await response.json();

            return {
              name: userData.name || userData.login,
              username: userData.login,
              location: userData.location || "Unknown",
              avatar: userData.avatar_url,
              email: userData.email || "Not Available",
              html_url: userData.html_url,
              company: userData.company || "Unknown",
            };
          })
        );

        setCandidates(detailedCandidates);
      }
      setLoading(false);
    };

    fetchCandidates();
  }, []);

  const saveCandidate = () => {
    if (currentIndex < candidates.length) {
      const updatedSavedCandidates = [...savedCandidates, candidates[currentIndex]];
      
      setSavedCandidates(updatedSavedCandidates);
      localStorage.setItem("savedCandidates", JSON.stringify(updatedSavedCandidates)); // ✅ Ensure it is stored
      window.dispatchEvent(new Event("storage"));
      nextCandidate();
    }
  };

  const [noMoreCandidates, setNoMoreCandidates] = useState(false);

  const nextCandidate = () => {
    if (currentIndex < candidates.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setNoMoreCandidates(true);
      setTimeout(() => {
        window.location.href = "/saved-candidates"; 
      }, 500);
    }
  };

  if (loading) {
    return <h2>Loading candidates...</h2>;
  }

  if (candidates.length === 0) {
    return <h2>No more candidates available</h2>;
  }

  const candidate = candidates.length > 0 ? candidates[currentIndex] : null;

  if (loading) {
    return <h2>Loading candidates...</h2>;
  }
  
  if (!candidate) {
    return <h2>No more candidates available</h2>;
  }
  
  return (
    <div>
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
      <br />
      <button onClick={saveCandidate}>+</button>
      <button onClick={nextCandidate}>-</button>
    </div>
  );
};

export default CandidateSearch;
