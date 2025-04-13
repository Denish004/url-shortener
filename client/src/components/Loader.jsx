import React from "react";

const Loader = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className={`loading-spinner ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default Loader;
