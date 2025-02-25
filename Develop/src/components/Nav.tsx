import { Link } from 'react-router-dom';

const Nav = () => {
  // TODO: Add necessary code to display the navigation bar and link between the pages
  return (
    <div style={{display: "flex", gap: "10px"}}>
    <nav>
      <button><Link to="/">Potential Candidates</Link></button> 
      <button><Link to="SavedCandidates">Saved Candidates</Link></button>
    </nav>
    </div>
  )
};

export default Nav;
