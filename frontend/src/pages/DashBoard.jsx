import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

function Dashboard() {
  // State for documents, current page, and total pages
  const [docs, setDocs] = useState([]);
  const [error, setError]  = useState(null);
  
  const [newDocTitle, setNewDocTitle] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(true); // For loading indicators
  const [isCreating, setIsCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { API, token } = useAuth();
  const navigate = useNavigate();

  // useEffect will re-run whenever currentPage changes
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    const fetchDocs = async () => {
      setIsLoading(true);

      try {
        // Append the current page as a query parameter
        const res = await fetch(`${API}/api/docs?page=${currentPage}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch documents. The server might be down.");

        const data = await res.json();
        
        // Update all our states from the API response
        setDocs(data.documents);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);

      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocs();
  }, [currentPage, token, API]); // Dependency array includes currentPage

  // Handlers to change the page
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleCreateDoc = async(e)=>
  {
    e.preventDefault();
    setError("");

    if(!newDocTitle.trim())
    {
      setError("Document title cannot be empty.");
      return;
    }

    setIsCreating(true);
    try{
      const res  = await fetch(`${API}/api/docs/create`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({title: newDocTitle}),
      });

      const data = await res.json();

      if(!res.ok)
      {
        throw new Error(data.message||"Failed to create document");
      }

      setSuccessMessage(data.message);
      setNewDocTitle("");

      setTimeout(()=>{ //we are doing this to show the success message after a short delay to let the user see the success message
        setSuccessMessage("");
        navigate(`/editor/${data.docId}`);
      }, 1500);
    }
    catch(err)
    {
      setError(err.message);
    }
    finally{
      setIsCreating(false);
    }
  }

  const renderContent=()=>{
    if(isLoading) return <p>Loading documents....</p>
    if(error) return <p>{error}</p>
    if(docs.length===0)
      return <p>You haven't created any documents yet. Create one to get started!</p>
    
    return docs.map((doc) => (
          <div key={doc._id}>
            <h3>{doc.title}</h3>
            <p>Last updated: {new Date(doc.updatedAt).toLocaleDateString()}</p>
            <button onClick={() => navigate(`/editor/${doc._id}`)}>Open</button>
          </div>
        ));
  }

  return (
    <div >
        <h1>Your Documents</h1>

      <form onSubmit={handleCreateDoc} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
        <input
          type="text"
          value={newDocTitle}
          onChange={(e) => setNewDocTitle(e.target.value)}
          placeholder="Enter new document title..."
        />
        <button type="submit" disabled={isCreating}>
          {isCreating ? "Creating..." : "+ Create Document"}
        </button>
        {successMessage && <p>{successMessage}</p>}
      </form>

      {renderContent()}
      
      {!isLoading && !error && totalPages > 1 && (
        <div>
          <button onClick={handlePrevPage} disabled={currentPage <= 1}>Previous</button>
          <span style={{ margin: '0 1rem' }}>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage >= totalPages}>Next</button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;