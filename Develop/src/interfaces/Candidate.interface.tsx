// TODO: Create an interface for the Candidate objects returned by the API
export interface Candidate {
    name: string;
    username: string;
    location: string;
    avatar: string;
    email: string | null; // Some users may not have a public email
    html_url: string;
    company: string | null; // Some users may not have a company listed
  }
  
export default Candidate