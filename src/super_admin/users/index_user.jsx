import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_users, affecter_permition } from "../../redux/thunk";

function Afficher_users() {
  const dispatch = useDispatch();
  const list_users = useSelector((state) => state.list_users);
  const loading = useSelector((state) => state.loading);

  useEffect(() => {
    dispatch(get_users());
  }, []);

  const set_permition = (event, id_user, obj_permition) => {
    const new_obj = { ...obj_permition }; // Create a new object to avoid mutating the original
    Object.entries(obj_permition).forEach(([key, value]) => {
      if (key === event.target.name) {
        new_obj[event.target.name] = event.target.checked;
      }
    });
    dispatch(affecter_permition(id_user, new_obj));
  };


  return (
    <div className="min-h-screen bg-gray-800 p-6">
      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <svg
              className="animate-spin h-10 w-10 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-xl font-medium text-gray-200">Chargement...</span>
          </div>
        </div>
      )}

      {/* Title */}
      <h1 className="text-2xl font-bold text-white mb-6">Liste des utilisateurs</h1>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <div className="bg-gray-900 border border-gray-600 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-600">
            {/* Table Header */}
            <thead className="bg-gray-800">
              <tr className="text-gray-300 uppercase text-sm">
                <th className="py-4 px-6 text-left font-medium">ID</th>
                <th className="py-4 px-6 text-left font-medium">Nom</th>
                <th className="py-4 px-6 text-left font-medium">Email</th>
                <th className="py-4 px-6 text-left font-medium">Rôle</th>
                <th className="py-4 px-6 text-left font-medium">Permissions</th>
                <th className="py-4 px-6 text-center font-medium">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-gray-900 divide-y divide-gray-600">
              {list_users.length !== 0 ? (
                list_users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-800 transition duration-300"
                  >
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-200">
                      {user.id}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-200">
                      {user.name}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-200">
                      {user.email}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-200">
                      {user.role.nom_role}
                    </td>

                    {/* Permissions */}
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-3">
                        {user.permition ? (
                          Object.entries(user.permition).map(([key, value]) => (
                            <label
                              key={key}
                              className="flex items-center gap-2 text-gray-300"
                            >
                              <input
                                type="checkbox"
                                name={key}
                                className="form-checkbox h-4 w-4 text-blue-500 focus:ring-blue-500"
                                checked={value}
                                onChange={(e) =>
                                  set_permition(e, user.id, user.permition)
                                } // Changed from onClick to onChange
                              />
                              <span>{key}</span>
                            </label>
                          ))
                        ) : (
                          <span className="text-gray-400">Aucune permission</span>
                        )}
                      </div>
                    </td>

                    {/* Delete Button */}
                    <td className="py-4 px-6 text-center">
                      <button className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500">
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="py-4 px-6 text-center text-gray-400 font-medium"
                  >
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Afficher_users;