import React from "react";
import PropTypes from "prop-types";

const Permission = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-800 text-center p-5">
      <h1 className="text-2xl font-bold mb-4">Accès Refusé</h1>
      <p className="text-lg">{message || "Vous n'avez pas accès à cette partie de l'application."}</p>
    </div>
  );
};

Permission.propTypes = {
  message: PropTypes.string,
};

export default Permission;
