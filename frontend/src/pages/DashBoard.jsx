import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

function Dashboard() {
  // State for documents, current page, and total pages
  const [docs, setDocs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // For loading indicators
  
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

        if (!res.ok) throw new Error("Failed to fetch documents");

        const data = await res.json();
        
        // Update all our states from the API response
        setDocs(data.documents);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);

      } catch (err) {
        console.error("Dashboard fetch error:", err);
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

  return (
    <div>
      <h1>Your Documents</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        docs.map((doc) => (
          <div key={doc._id}>
            <h3>{doc.title}</h3>
            <p>Last updated: {new Date(doc.updatedAt).toLocaleDateString()}</p>
          </div>
        ))
      )}
      
      {/* Pagination Controls */}
      <div style={{ marginTop: '2rem' }}>
        <button onClick={handlePrevPage} disabled={currentPage <= 1}>
          Previous
        </button>
        <span style={{ margin: '0 1rem' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Dashboard;