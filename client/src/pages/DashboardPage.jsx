import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getUrls,
  deleteUrl,
  clearSuccess,
  clearError,
} from "../features/url/urlSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { urls, totalPages, currentPage, loading, error, success } =
    useSelector((state) => state.url);
  const [search, setSearch] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    dispatch(getUrls({ page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        dispatch(clearSuccess());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handlePageChange = (page) => {
    dispatch(getUrls({ page, search }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getUrls({ page: 1, search }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this URL?")) {
      dispatch(deleteUrl(id));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Your Shortened URLs</h1>
        <Link
          to="/create"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded inline-block"
        >
          Create New URL
        </Link>
      </div>

      {showSuccessMessage && (
        <Message variant="success" onClose={() => setShowSuccessMessage(false)}>
          URL deleted successfully!
        </Message>
      )}

      {error && (
        <Message variant="error" onClose={() => dispatch(clearError())}>
          {error}
        </Message>
      )}

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="Search URLs..."
            className="border border-gray-300 rounded-l px-4 py-2 w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <Loader />
      ) : urls.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Original URL</th>
                  <th className="py-2 px-4 border-b text-left">Short URL</th>
                  <th className="py-2 px-4 border-b text-left">Clicks</th>
                  <th className="py-2 px-4 border-b text-left">Created Date</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((url) => (
                  <tr key={url._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b truncate max-w-xs">
                      {url.originalUrl}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <a
                        href={`https://url-shortener-1q0k.onrender.com/${url.shortCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        /{url.shortCode}
                      </a>
                    </td>
                    <td className="py-2 px-4 border-b">{url.clicks}</td>
                    <td className="py-2 px-4 border-b">
                      {new Date(url.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {url.expiresAt && new Date(url.expiresAt) < new Date() ? (
                        <span className="text-red-500">Expired</span>
                      ) : (
                        <span className="text-green-500">Active</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex space-x-2">
                        <Link
                          to={`/analytics/${url._id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Analytics
                        </Link>
                        <button
                          onClick={() => handleDelete(url._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav>
                <ul className="flex space-x-2">
                  {[...Array(totalPages).keys()].map((page) => (
                    <li key={page + 1}>
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        className={`px-3 py-1 rounded ${
                          currentPage === page + 1
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {page + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            You haven't created any short URLs yet.
          </p>
          <Link
            to="/create"
            className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Create Your First URL
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
