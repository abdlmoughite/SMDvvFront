import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ajouter_category } from "../../redux/thunk";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Ajouter_category() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading);

  const [new_category, setNew_category] = useState({
    nom: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const tempErrors = {};
    if (!new_category.nom) tempErrors.nom = "Le nom de la catégorie est requis.";
    return tempErrors;
  };

  const ajt_category = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Veuillez remplir le nom de la catégorie.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark", // Match the dark theme
      });
    } else {
      setErrors({});
      dispatch(ajouter_category(new_category))
        .then(() => {
          toast.success("Catégorie ajoutée avec succès!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark", // Match the dark theme
          });
          setNew_category({
            nom: "",
          });
        })
        .catch(() => {
          toast.error("Une erreur s'est produite lors de l'ajout de la catégorie.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark", // Match the dark theme
          });
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center py-8 px-4">
      <div className="p-6 max-w-lg w-full mx-auto bg-gray-900 rounded-lg shadow-lg border border-gray-600">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Ajouter une Catégorie
        </h1>

        {loading ? (
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <form className="space-y-6">
            {/* Nom CatEUROgorie */}
            <div>
              <label htmlFor="nom" className="block text-gray-300 font-medium mb-2">
                Nom Catégorie
              </label>
              <input
                type="text"
                name="nom"
                id="nom"
                value={new_category.nom}
                onChange={(e) => setNew_category({ nom: e.target.value })}
                className={`w-full px-4 py-2 bg-gray-700 border ${
                  errors.nom ? "border-red-500" : "border-gray-600"
                } rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
              />
              {errors.nom && (
                <p className="text-red-500 text-sm mt-1">{errors.nom}</p>
              )}
            </div>

            {/* Add Button */}
            <div>
              <button
                type="button"
                onClick={ajt_category}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Ajouter
              </button>
            </div>
          </form>
        )}

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </div>
  );
}

export default Ajouter_category;