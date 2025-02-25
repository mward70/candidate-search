import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Candidate } from "../interfaces/Candidate.interface";
import { searchGithub } from "../api/API";

const CandidateSearch = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [noMoreCandidates, setNoMoreCandidates] = useState(false);

  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem("savedCandidates");
    return saved ? JSON.parse(saved) : [];
  });

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("savedCandidates", JSON.stringify(savedCandidates));
  }, [savedCandidates]);

  const mapUserData = (userData: any): Candidate => ({
    name: userData.name || userData.login,
    username: userData.login,
    location: userData.location || "Unknown",
    avatar: userData.avatar_url,
    email: userData.email || "Not Available",
    html_url: userData.html_url,
    company: userData.company || "Unknown",
  });

  // Fetch GitHub users
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      const users = await searchGithub();

      if (users.length > 0) {
        const detailedCandidates = await Promise.all(
          users.map(async (user: any) => {
            const response = await fetch(`https://api.github.com/users/${user.login}`, {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
              },
            });
            return mapUserData(await response.json());
          })
        );

        if (isMounted.current) {
          setCandidates(detailedCandidates);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const saveCandidate = () => {
    if (currentIndex < candidates.length) {
      if (!savedCandidates.some((c) => c.username === candidates[currentIndex].username)) {
        setSavedCandidates((prev) => [...prev, candidates[currentIndex]]);
      }
      nextCandidate();
    }
  };

  const nextCandidate = () => {
    if (currentIndex < candidates.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      setNoMoreCandidates(true);
      setTimeout(() => {
        navigate("/saved-candidates");
      }, 500);
    }
  };

  if (loading) return <h2>Loading candidates...</h2>;

  if (noMoreCandidates || candidates.length === 0) return <h2>No more candidates available</h2>;

  const candidate = candidates[currentIndex];

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
