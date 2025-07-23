import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { add_depences, get_produit } from "../redux/thunk";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Ajouter_depence() {
  const dispatch = useDispatch();
  const list_produit = useSelector((state) => state.list_produit);

  const [forProduit, setForProduit] = useState(false); // Gère la checkbox
  const [typ_input, setTyp_input] = useState("");
  const [depence, setDepence] = useState({
    nom: "",
    description: "",
    montant: "",
    date_depence: format(new Date(), "yyyy-MM-dd"),
    produit: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(get_produit());
  }, [dispatch]);

  const getValue = (e) => {
    const { name, type, value, files } = e.target;
    if (type === "file") {
      setDepence({ ...depence, [name]: files[0] });
    } else {
      setDepence({ ...depence, [name]: value });
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    let tempErrors = {};
    if (!depence.nom) tempErrors.nom = "Le nom est requis";
    if (!depence.montant) tempErrors.montant = "Le montant est requis";
    if (!depence.description) tempErrors.description = "La description est requise";
    if (typ_input === "file" && !depence.description)
      tempErrors.description = "Veuillez sélectionner un fichier";
    if (forProduit && !depence.produit)
      tempErrors.produit = "Veuillez choisir un produit";

    return tempErrors;
  };

  const Ajouter = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      dispatch(add_depences(depence));
      toast.success("Dépense ajoutée avec succès!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark", // Match the dark theme
      });
      setDepence({
        nom: "",
        description: "",
        montant: "",
        date_depence: format(new Date(), "yyyy-MM-dd"),
        produit: null,
      });
      setForProduit(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center py-8 px-4">
      <div className="max-w-lg w-full mx-auto p-6 bg-gray-900 shadow-lg rounded-lg border border-gray-600">
        <h1 className="text-2xl font-bold text-white mb-6">Ajouter une dépense</h1>

        <form>
          {/* Nom */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Nom</label>
            <input
              type="text"
              name="nom"
              value={depence.nom}
              className={`mt-1 p-2 block w-full bg-gray-700 border ${
                errors.nom ? "border-red-500" : "border-gray-600"
              } rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
              onChange={getValue}
            />
            {errors.nom && (
              <p className="text-red-500 text-sm mt-1">{errors.nom}</p>
            )}
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Date</label>
            <input
              type="date"
              name="date_depence"
              value={depence.date_depence}
              className={`mt-1 p-2 block w-full bg-gray-700 border ${
                errors.date_depence ? "border-red-500" : "border-gray-600"
              } rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
              onChange={getValue}
            />
            {errors.date_depence && (
              <p className="text-red-500 text-sm mt-1">{errors.date_depence}</p>
            )}
          </div>

          {/* Montant */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">
              Montant
            </label>
            <input
              type="text"
              name="montant"
              value={depence.montant}
              className={`mt-1 p-2 block w-full bg-gray-700 border ${
                errors.montant ? "border-red-500" : "border-gray-600"
              } rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
              onChange={getValue}
            />
            {errors.montant && (
              <p className="text-red-500 text-sm mt-1">{errors.montant}</p>
            )}
          </div>

          {/* Checkbox pour lier à un produit */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="forProduit"
              checked={forProduit}
              onChange={() => setForProduit(!forProduit)}
              className="w-4 h-4 text-blue-500 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
            />
            <label
              htmlFor="forProduit"
              className="ml-2 text-sm text-gray-300"
            >
              Cette dépense est liée à un produit
            </label>
          </div>

          {/* Sélection du produit si la checkbox est cochée */}
          {forProduit && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Produit
              </label>
              <select
                name="produit"
                onChange={getValue}
                className={`mt-1 p-2 block w-full bg-gray-700 border ${
                  errors.produit ? "border-red-500" : "border-gray-600"
                } rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
              >
                <option value="" className="bg-gray-700">
                  Sélectionner un produit
                </option>
                {list_produit.map((p) => (
                  <option
                    key={p.id}
                    value={p.id_produit}
                    className="bg-gray-700"
                  >
                    {p.nom}
                  </option>
                ))}
              </select>
              {errors.produit && (
                <p className="text-red-500 text-sm mt-1">{errors.produit}</p>
              )}
            </div>
          )}

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  value="text"
                  id="radio1"
                  name="radio"
                  className="w-4 h-4 text-blue-500 border-gray-600 focus:ring-blue-500 bg-gray-700"
                  onChange={(e) => setTyp_input(e.target.value)} // Changed from onClick to onChange
                />
                <label
                  htmlFor="radio1"
                  className="ml-2 text-sm font-medium text-gray-300"
                >
                  Texte
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  value="file"
                  id="radio2"
                  name="radio"
                  className="w-4 h-4 text-blue-500 border-gray-600 focus:ring-blue-500 bg-gray-700"
                  onChange={(e) => setTyp_input(e.target.value)} // Changed from onClick to onChange
                />
                <label
                  htmlFor="radio2"
                  className="ml-2 text-sm font-medium text-gray-300"
                >
                  Fichier
                </label>
              </div>
            </div>

            {typ_input === "text" && (
              <textarea
                name="description"
                value={depence.description}
                className={`mt-3 p-2 block w-full bg-gray-700 border ${
                  errors.description ? "border-red-500" : "border-gray-600"
                } rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
                onChange={getValue}
              ></textarea>
            )}

            {typ_input === "file" && (
              <input
                type="file"
                name="description"
                className={`mt-3 block w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-gray-200 hover:file:bg-gray-500 transition-colors duration-200 ${
                  errors.description ? "border-red-500" : ""
                }`}
                onChange={getValue}
              />
            )}
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Bouton Ajouter */}
          <button
            type="button"
            onClick={Ajouter}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Ajouter
          </button>
        </form>

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </div>
  );
}

export default Ajouter_depence;