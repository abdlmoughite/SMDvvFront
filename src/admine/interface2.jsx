import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_list_cmd, set_status_commande } from "../redux/thunk";
import axios from "axios";
import Select from "react-select";

function List_commande() {
  const [list_villes, setList_villes] = useState([]);
  const loading = useSelector((state) => state.loading);
  const list_commandes = useSelector((state) => state.list_commandes);
  const [list_cmd, setList_cmd] = useState([]);
  const [list_status, setList_status] = useState([]);
  const dispatch = useDispatch();

  const [date_commande, setDate_commande] = useState("");
  const [ville, setVille] = useState("");
  const [status_cmd, setStatus_cmd] = useState("");
  const [global_find, setGlobal_find] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = list_cmd.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(list_cmd.length / entriesPerPage);

  useEffect(() => {
    dispatch(get_list_cmd());
    axios.get("http://127.0.0.1:8000/api/statuses").then((res) => {
      setList_status(res.data);
    });

    axios.get("http://127.0.0.1:8000/api/villes").then((res) => {
      if (res.status === 200) {
        const villes = res.data.map((i) => ({
          value: i.NAME,
          label: i.NAME,
          id: i.id,
          REF: i.REF,
          NAME: i.NAME,
          DELIVERED: i.DELIVERED,
          RETURNED: i.RETURNED,
          REFUSED: i.REFUSED,
        }));
        setList_villes((prevVilles) => [
          ...prevVilles,
          ...villes.filter((ville) => !prevVilles.some((v) => v.value === ville.value)),
        ]);
      }
    });
  }, []);

  useEffect(() => {
    setList_cmd([...list_commandes].sort((a, b) => b.id_commande - a.id_commande));
  }, [list_commandes]);

  const up_dtae_status = (idc, new_status) => {
    const status = list_status.filter((i) => i.nom === new_status);
    dispatch(set_status_commande(idc, status));
    setList_cmd(
      list_cmd.map((i) => (i.id_commande === idc ? { ...i, status: new_status } : i))
    );
  };

  const filter_date = (val) => {
    setDate_commande(val);
    setGlobal_find("");
    setList_cmd(
      list_commandes.filter((i) => {
        if (ville && status_cmd) {
          return val
            ? i.ville === ville && i.date_commande === val && i.status === status_cmd
            : i.ville === ville && i.status === status_cmd;
        }
        if (status_cmd && !ville) {
          return val ? i.date_commande === val && i.status === status_cmd : i.status === status_cmd;
        }
        if (!status_cmd && ville) {
          return val ? i.ville === ville && i.date_commande === val : i.ville === ville;
        }
        return val ? i.date_commande === val : true;
      })
    );
  };

  const filter_ville = (val) => {
    setVille(val);
    setGlobal_find("");
    setList_cmd(
      list_commandes.filter((i) => {
        if (status_cmd && date_commande) {
          return val
            ? i.ville === val && i.date_commande === date_commande && i.status === status_cmd
            : i.date_commande === date_commande && i.status === status_cmd;
        }
        if (date_commande && !status_cmd) {
          return val ? i.ville === val && i.date_commande === date_commande : i.date_commande === date_commande;
        }
        if (!date_commande && status_cmd) {
          return val ? i.ville === val && i.status === status_cmd : i.status === status_cmd;
        }
        return val ? i.ville === val : true;
      })
    );
  };

  const filter_status = (val) => {
    setStatus_cmd(val);
    setGlobal_find("");
    setList_cmd(
      list_commandes.filter((i) => {
        if (ville && date_commande) {
          return i.ville === ville && i.date_commande === date_commande && i.status === val;
        }
        if (date_commande && !ville) {
          return i.status === val && i.date_commande === date_commande;
        }
        if (!date_commande && ville) {
          return i.ville === ville && i.status === val;
        }
        return i.status === val;
      })
    );
  };

  const filter_global = (val) => {
    setGlobal_find(val);
    setDate_commande("");
    setVille("");
    setList_cmd(
      val
        ? list_commandes.filter(
            (i) =>
              i.nom === val ||
              i.id_commande.toString() === val ||
              i.nom_c === val ||
              i.numero === val
          )
        : list_commandes
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "refuser":
        return "bg-red-600 text-white";
      case "en cours":
        return "bg-blue-600 text-white";
      case "livrer":
        return "bg-green-600 text-white";
      case "annuler":
        return "bg-red-700 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#2d3748",
      borderColor: "#4a5568", // Matches border-gray-600
      color: "#e2e8f0",
      borderRadius: "0.5rem", // Matches rounded-lg
      "&:hover": {
        borderColor: "#718096", // Matches border-gray-500
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#e2e8f0",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#2d3748",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#4a5568" : "#2d3748",
      color: "#e2e8f0",
      "&:hover": {
        backgroundColor: "#4a5568",
      },
    }),
  };
  const [status , setstatus] = useState({
    livre : 100,
    pas_rep : 2 ,
    annuler : 1 , 
    refuser : 0
  })
  useEffect(() => {
    const livre = list_cmd.filter(i => i.status === "livrer").length;
    const pas_rep = list_cmd.filter(i => i.status === "pas rep").length;
    const annuler = list_cmd.filter(i => i.status === "annuler").length;
    const refuser = list_cmd.filter(i => i.status === "refuser").length;

    setstatus({
      livre,
      pas_rep,
      annuler,
      refuser
    });
  }, [list_cmd]);
  


  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center py-8 px-4">
      <div className="w-full flex justify-center bg-black max-w-7xl mb-8 rounded-lg">
        <div className="bg-green-500 m-3 h-24 w-24 flex items-center justify-center text-white font-bold rounded-lg">
          Livre : <br /> {status.livre}
        </div>  
        <div className="bg-red-500 m-3 h-24 w-24 flex items-center justify-center text-white font-bold rounded-lg">
          annuler : <br /> {status.annuler}
        </div>
        <div className="bg-blue-500 m-3 h-24 w-24 flex items-center justify-center text-white font-bold rounded-lg">
          pas rep : <br />{status.pas_rep}
        </div>
        <div className="bg-red-800 m-3 h-24 w-24 flex items-center justify-center text-white font-bold rounded-lg">
          refuser : <br />{status.refuser}
        </div>
      </div>
      <div className="w-full max-w-7xl bg-gray-900 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">
          Liste des Commandes
        </h1>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="date"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => filter_date(e.target.value)}
                value={date_commande}
              />
              <select
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" className="bg-gray-700 text-gray-200">
                  Tous les Statuts
                </option>
                {list_status?.map((s) => (
                  <option key={s.nom} value={s.nom} className="bg-gray-700 text-gray-200">
                    {s.nom}
                  </option>
                ))}
              </select>

              <Select
                options={list_villes}
                placeholder="Choisir une ville"
                onChange={(selectedOption) => filter_ville(selectedOption?.value || "")}
                className="w-full text-sm"
                styles={customSelectStyles}
              />

              <input
                type="text"
                placeholder="Rechercher globalement"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => filter_global(e.target.value)}
                value={global_find}
              />
            </div>

            {/* Table Container */}
            <div className="bg-gray-900 border border-gray-600 rounded-lg overflow-hidden">
              {/* Table Info */}
              <div className="px-4 py-2 bg-gray-800 border-b border-gray-600 flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  {list_cmd.length} entrées
                </span>
                <span className="text-sm text-gray-400">
                  Affichage des commandes du plus récent au plus ancien
                </span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-600">
                  <thead className="bg-gray-800">
                    <tr>
                      {[
                        "ID Commande",
                        "Numéro Client",
                        "Nom Client",
                        "Ville",
                        "Nom Produit",
                        "Statut",
                        "Prix",
                        "Date Commande",
                        "profit"
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  {/* {console.log(currentEntries)} */}
                  <tbody className=" bg-gray-900 divide-y divide-gray-600">
                    {currentEntries.length > 0 ? (
                      currentEntries.map((i) => (
                        <tr key={i.id_commande} className="hover:bg-gray-800">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-200">
                            {i.id_commande}
                          </td>
                          {/* {console.log(i)} */}
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {i.numero}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {i.nom_c}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {i.ville_commande}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {i.nom}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div
                              className={`px-2 py-1 text-xs rounded-md ${getStatusColor(
                                i.status
                              )}`}
                            >
                              <select
                                onChange={(e) =>
                                  up_dtae_status(i.id_commande, e.target.value)
                                }
                                className="bg-transparent w-full focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                              >
                                <option value={i.status} className="bg-gray-800 text-white">
                                  {i.status}
                                </option>
                                {list_status.map((s) => (
                                  <option
                                    key={s.nom}
                                    value={s.nom}
                                    className="bg-gray-800 text-white"
                                  >
                                    {s.nom}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {i.prix}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {i.date_commande}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {i.status == "livrer" ? i.prix - i.prix_livraison - i.prix_produit - i.cost : -i.cost - ( i.status == "refuser" ?  10 : 0 ) }
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="px-4 py-6 text-center text-sm text-gray-400"
                        >
                          Aucune commande trouvée
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-3 border-t border-gray-600 flex flex-col sm:flex-row items-center justify-between bg-gray-800">
                <div className="text-sm text-gray-400 mb-2 sm:mb-0">
                  Affichage de {indexOfFirstEntry + 1} à{" "}
                  {Math.min(indexOfLastEntry, list_cmd.length)} sur {list_cmd.length} entrées
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-600 rounded text-sm text-gray-200 disabled:opacity-50 hover:bg-gray-700"
                  >
                    Précédent
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = idx + 1;
                    } else if (currentPage <= 3) {
                      pageNum = idx + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + idx;
                    } else {
                      pageNum = currentPage - 2 + idx;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 border border-gray-600 text-sm rounded ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white border-blue-600"
                            : "text-gray-200 hover:bg-gray-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="px-2 text-sm text-gray-400">...</span>
                  )}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-3 py-1 border border-gray-600 rounded text-sm text-gray-200 hover:bg-gray-700"
                    >
                      {totalPages}
                    </button>
                  )}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-600 rounded text-sm text-gray-200 disabled:opacity-50 hover:bg-gray-700"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default List_commande;