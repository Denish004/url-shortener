import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  createShortUrl,
  clearError,
  clearSuccess,
  clearCurrentUrl,
} from "../features/url/urlSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { QRCodeCanvas } from "qrcode.react";

const CreateUrlPage = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const dispatch = useDispatch();
  const { loading, error, success, currentUrl } = useSelector(
    (state) => state.url
  );

  useEffect(() => {
    // Clear any previous state when component mounts
    return () => {
      dispatch(clearCurrentUrl());
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlData = { originalUrl };

    if (customAlias.trim()) {
      urlData.customAlias = customAlias.trim();
    }

    if (expiresAt) {
      urlData.expiresAt = expiresAt;
    }

    dispatch(createShortUrl(urlData));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="text-blue-500 hover:text-blue-700">
          &larr; Back to Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Create Short URL</h1>

      {error && (
        <Message variant="error" onClose={() => dispatch(clearError())}>
          {error}
        </Message>
      )}

      {success && currentUrl && (
        <div className="mb-6 bg-green-100 border border-green-200 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2 text-green-800">
            URL Created Successfully!
          </h2>
          <div className="mb-4">
            <p className="mb-1">
              <span className="font-semibold">Original URL:</span>{" "}
              {currentUrl.originalUrl}
            </p>
            <p className="mb-1">
              <span className="font-semibold">Short URL:</span>{" "}
              <a
                href={`https://url-shortener-1q0k.onrender.com/${currentUrl.shortCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                https://url-shortener-1q0k.onrender.com/{currentUrl.shortCode}
              </a>
            </p>
            {currentUrl.expiresAt && (
              <p className="mb-1">
                <span className="font-semibold">Expires at:</span>{" "}
                {new Date(currentUrl.expiresAt).toLocaleString()}
              </p>
            )}
          </div>

          {/* QR Code */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">QR Code:</h3>
            <div className="bg-white p-4 inline-block rounded-lg">
              <QRCodeCanvas
                value={`http://localhost:5000/${currentUrl.shortCode}`}
                size={160}
                fgColor="#000"
                bgColor="#fff"
                level="L"
                includeMargin={false}
              />
            </div>
            <div className="mt-2">
              <a
                href={`http://localhost:5000/${currentUrl.shortCode}`}
                className="text-blue-500 hover:text-blue-700"
                download="qr-code.png"
              >
                Download QR Code
              </a>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => {
                setOriginalUrl("");
                setCustomAlias("");
                setExpiresAt("");
                dispatch(clearCurrentUrl());
                dispatch(clearSuccess());
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-3"
            >
              Create Another
            </button>
            <Link
              to="/"
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}

      {!success && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label htmlFor="originalUrl" className="block text-gray-700 mb-2">
              Original URL*
            </label>
            <input
              type="url"
              id="originalUrl"
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="customAlias" className="block text-gray-700 mb-2">
              Custom Alias (Optional)
            </label>
            <input
              type="text"
              id="customAlias"
              placeholder="my-custom-url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
            />
            <small className="text-gray-500">
              Leave empty to generate a random code
            </small>
          </div>

          <div className="mb-6">
            <label htmlFor="expiresAt" className="block text-gray-700 mb-2">
              Expiration Date (Optional)
            </label>
            <input
              type="datetime-local"
              id="expiresAt"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? <Loader size="sm" /> : "Create Short URL"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateUrlPage;
