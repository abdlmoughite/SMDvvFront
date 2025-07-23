import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { get_category, supprimer_category } from "../../redux/thunk";
import axios from "axios";

function Afficher_category() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [test, setTest] = useState("");

  useEffect(() => {
    dispatch(get_category());
  }, [dispatch]);

  const list_category = useSelector((state) => state.list_category);
  const loading = useSelector((state) => state.loading);

  const produit_caregory = (idc) => {
    navigate("/index/category/produit", { state: idc });
  };

  const delete_category = (idc) => {
    dispatch(supprimer_category(idc));
  };

  return (
    <div className="min-h-screen bg-gray-800 p-4">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <div className="mt-8">
          {list_category && list_category.length > 0 ? (
            <div className="bg-gray-900 rounded-lg border border-gray-600 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-600">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      ID Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Nom Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Nombre produit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-600">
                  {list_category.map((t) => (
                    <tr key={t.id_category} className="hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                        {t.id_category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                        {t.nom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                        {t.nombre_produit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => produit_caregory(t.id_category)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          View
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => delete_category(t.id_category)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full mt-4">
              <p className="text-gray-400">Aucune catégorie pour le moment</p>
            </div>
          )}
        </div>
      )}

      <div>
        {test !== "" && (
          <div className="mt-4 text-gray-200">
            <p>{test[0].nom}</p>
            <p>{test[0].caracteristiques.couleur}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Afficher_category;