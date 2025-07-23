import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_depences } from "../redux/thunk";

function Afficher_depence() {
  const dispatch = useDispatch();
  const list_depence = useSelector((state) => state.list_depence);
  const loading = useSelector((state) => state.loading);
  let [table, settable] = useState([]); // Note: This state variable isn't used in the current code

  useEffect(() => {
    dispatch(get_depences());
  }, [dispatch]);

  console.log(list_depence);

  return (
    <div className="min-h-screen bg-gray-800 p-4">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="bg-gray-900 rounded-lg border border-gray-600 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-600">
              <thead className="bg-gray-800">
                <tr>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-300 uppercase">
                    Nom
                  </th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-300 uppercase">
                    Description
                  </th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-300 uppercase">
                    Date de Dépense
                  </th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-300 uppercase">
                    Ajouté par
                  </th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-300 uppercase">
                    Sélection
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-600">
                {list_depence.length !== 0 ? (
                  list_depence.map((i) => (
                    <tr key={i.id} className="hover:bg-gray-800">
                      <td className="py-2 px-4 whitespace-nowrap text-gray-200">
                        {i.nom}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap text-gray-200">
                        {i.description}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap text-gray-200">
                        {i.date_depence}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap text-gray-200">
                        {i.name}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          name="hh"
                          className="form-checkbox h-4 w-4 text-blue-500 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-4 text-center text-gray-400"
                    >
                      Aucune dépense trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Afficher_depence;