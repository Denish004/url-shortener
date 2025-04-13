import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getAnalytics, clearError } from "../features/url/urlSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { QRCodeCanvas } from "qrcode.react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const AnalyticsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, error, currentUrl, analytics } = useSelector(
    (state) => state.url
  );

  // Use ref for QR code to enable downloading
  const qrCodeRef = useRef();

  useEffect(() => {
    if (id) {
      dispatch(getAnalytics(id));
    }
  }, [dispatch, id]);

  // Function to handle QR code download
  const downloadQRCode = () => {
    if (qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector("canvas");
      if (canvas) {
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = `qrcode-${currentUrl.shortCode}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="text-blue-500 hover:text-blue-700">
            &larr; Back to Dashboard
          </Link>
        </div>
        <Message variant="error" onClose={() => dispatch(clearError())}>
          {error}
        </Message>
      </div>
    );
  }

  if (!currentUrl || !analytics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="text-blue-500 hover:text-blue-700">
            &larr; Back to Dashboard
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">No analytics data found.</p>
        </div>
      </div>
    );
  }

  const shortUrl = `http://localhost:5000/${currentUrl.shortCode}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="text-blue-500 hover:text-blue-700">
          &larr; Back to Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Analytics for Short URL</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">URL Details</h2>
            <p className="mb-2">
              <span className="font-semibold">Original URL:</span>{" "}
              <a
                href={currentUrl.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 break-all"
              >
                {currentUrl.originalUrl}
              </a>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Short URL:</span>{" "}
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                {shortUrl}
              </a>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Created:</span>{" "}
              {new Date(currentUrl.createdAt).toLocaleString()}
            </p>
            {currentUrl.expiresAt && (
              <p className="mb-2">
                <span className="font-semibold">Expires:</span>{" "}
                {new Date(currentUrl.expiresAt).toLocaleString()}
              </p>
            )}
            <p className="mb-4">
              <span className="font-semibold">Total Clicks:</span>{" "}
              <span className="text-blue-500 font-bold">
                {analytics.totalClicks}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold mb-4">QR Code</h2>
            <div ref={qrCodeRef} className="bg-white p-4 rounded-lg shadow-sm">
              <QRCodeCanvas
                value={shortUrl}
                size={160}
                fgColor="#000"
                bgColor="#fff"
                level="L"
                includeMargin={false}
                id="qrcode"
              />
            </div>
            <button
              onClick={downloadQRCode}
              className="mt-4 text-blue-500 hover:text-blue-700"
            >
              Download QR Code
            </button>
          </div>
        </div>
      </div>

      {analytics.clicksData && analytics.clicksData.length > 0 ? (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-lg font-semibold mb-4">Clicks Over Time</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analytics.clicksData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Devices</h2>
              {analytics.deviceData && analytics.deviceData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.deviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {analytics.deviceData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-500 text-center">
                  No device data available.
                </p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Browsers</h2>
              {analytics.browserData && analytics.browserData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.browserData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-500 text-center">
                  No browser data available.
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center">No click data available.</p>
      )}
    </div>
  );
};

export default AnalyticsPage;
