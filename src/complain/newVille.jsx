import { useState, useEffect } from "react";
import axios from "axios";

function NewVille() {
  const [list_villes, setList_villes] = useState([]);

  // Chargement initial des données depuis l'API
  useEffect(() => {
    axios.get("https://api.ozonexpress.ma/cities").then((res) => {
      if (res.status === 200) {
        setList_villes(Object.values(res.data.CITIES || {})); // Convertir l'objet CITIES en tableau
      }
    }).catch((err) => {
      console.error("Erreur lors du chargement des villes:", err);
    });
  }, []);

  // Fonction pour afficher les villes et envoyer les données au serveur local
  const afficher = () => {
    list_villes.forEach((ville) => {
      // Créer le nouvel objet
      const newObj = {
        id: ville["ID"],
        REF: ville["REF"],
        NAME: ville["NAME"],
        DELIVERED: ville["DELIVERED-PRICE"],
        RETURNED: ville["RETURNED-PRICE"],
        REFUSED: ville["REFUSED-PRICE"],
      };

      // Envoyer l'objet au backend
      axios
        .post("http://localhost:3004/ville", newObj)
        .then((res) => {
          if (res.status === 201) {
          }
        })
        .catch((err) => {
          console.error(`Erreur lors de l'ajout de la ville ${newObj.NAME}:`, err);
        });
    });
  };

  return (
    <div className="p-4">
  <button
    onClick={afficher}
    className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
  >
    Ajouter les villes
  </button>
  <div className="overflow-x-auto">
    <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg">
      <thead className="bg-gray-100">
        <tr>
          <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
          <th className="border border-gray-300 px-4 py-2 text-left">REF</th>
          <th className="border border-gray-300 px-4 py-2 text-left">NAME</th>
          <th className="border border-gray-300 px-4 py-2 text-left">
            DELIVERED-PRICE
          </th>
          <th className="border border-gray-300 px-4 py-2 text-left">
            RETURNED-PRICE
          </th>
          <th className="border border-gray-300 px-4 py-2 text-left">
            REFUSED-PRICE
          </th>
        </tr>
      </thead>
      <tbody>
        {list_villes.length > 0 ? (
          list_villes.map((ville, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100`}
            >
              <td className="border border-gray-300 px-4 py-2">
                {ville.ID || ""}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {ville.REF || ""}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {ville.NAME || ""}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {ville["DELIVERED-PRICE"] || ""}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {ville["RETURNED-PRICE"] || ""}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {ville["REFUSED-PRICE"] || ""}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="6"
              className="text-center text-gray-500 px-4 py-2 border border-gray-300"
            >
              Aucune ville disponible
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

  );
}

export default NewVille;
