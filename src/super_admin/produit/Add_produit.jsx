import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ajouter_produit, get_category } from "../../redux/thunk";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Add_produit() {
  const value = localStorage.getItem("user");
  const dispatch = useDispatch();
  const list_category = useSelector((state) => state.list_category);

  useEffect(() => {
    dispatch(get_category());
  }, [dispatch]);

  const [produit, setProduit] = useState({
    nom: "",
    image: "",
    category: "",
    quantite: 0,
    prix: 0,
  });

  const [errors, setErrors] = useState({});

  const getValue = (e) => {
    if (e.target.name === "image") {
      setProduit({ ...produit, [e.target.name]: e.target.files[0] });
    } else {
      setProduit({ ...produit, [e.target.name]: e.target.value });
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!produit.nom) tempErrors.nom = "Le nom du produit est requis.";
    if (!produit.image) tempErrors.image = "L'image du produit est requise.";
    if (!produit.category) tempErrors.category = "La catégorie est requise.";
    if (produit.prix <= 0) tempErrors.prix = "Le prix doit être supérieur à 0.";
    if (produit.quantite < 0)
      tempErrors.quantite = "La quantité ne peut pas être négative.";
    return tempErrors;
  };

  const add_produit = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Veuillez corriger les erreurs dans le formulaire.", {
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
      dispatch(ajouter_produit(produit));
      toast.success("Produit ajouté avec succès!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark", // Match the dark theme
      });
      setProduit({
        nom: "",
        image: "",
        category: "",
        quantite: 0,
        prix: 0,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center py-8 px-4">
      <div className="p-6 max-w-lg w-full mx-auto bg-gray-900 rounded-lg shadow-lg border border-gray-600">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Ajouter un Produit
        </h1>
        <form className="space-y-6">
          {/* Nom Produit */}
          <div>
            <label htmlFor="nom" className="block text-gray-300 font-medium mb-2">
              Nom Produit
            </label>
            <input
              type="text"
              value={produit.nom}
              name="nom"
              id="nom"
              onChange={getValue}
              className={`w-full px-4 py-2 bg-gray-700 border ${
                errors.nom ? "border-red-500" : "border-gray-600"
              } rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
            />
            {errors.nom && (
              <p className="text-red-500 text-sm mt-1">{errors.nom}</p>
            )}
          </div>

          {/* Image Produit */}
          <div>
            <label htmlFor="image" className="block text-gray-300 font-medium mb-2">
              Image Produit
            </label>
            <input
              type="file"
              name="image"
              id="image"
              onChange={getValue}
              className={`w-full px-4 py-2 bg-gray-700 border ${
                errors.image ? "border-red-500" : "border-gray-600"
              } rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none file:bg-gray-600 file:text-gray-200 file:border-0 file:rounded file:px-3 file:py-1 file:mr-4 hover:file:bg-gray-500 transition-colors duration-200`}
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </div>

          {/* Category Produit */}
          <div>
            <label htmlFor="category" className="block text-gray-300 font-medium mb-2">
              Cat  Catégorie Produit
            </label>
            <select
              name="category"
              id="category"
              value={produit.category}
              onChange={getValue}
              className={`w-full px-4 py-2 bg-gray-700 border ${
                errors.category ? "border-red-500" : "border-gray-600"
              } rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
            >
              <option value="" className="bg-gray-700 text-gray-200">
                Choisir une catégorie
              </option>
              {list_category.length !== 0 ? (
                list_category.map((i) => (
                  <option key={i.id_category} value={i.id_category} className="bg-gray-700 text-gray-200">
                    {i.nom}
                  </option>
                ))
              ) : (
                <option value="" className="bg-gray-700 text-gray-200">
                  Aucune catégorie disponible
                </option>
              )}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Prix Produit */}
          <div>
            <label htmlFor="prix" className="block text-gray-300 font-medium mb-2">
              Prix Produit
            </label>
            <input
              type="number"
              value={produit.prix}
              name="prix"
              id="prix"
              onChange={getValue}
              className={`w-full px-4 py-2 bg-gray-700 border ${
                errors.prix ? "border-red-500" : "border-gray-600"
              } rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
            />
            {errors.prix && (
              <p className="text-red-500 text-sm mt-1">{errors.prix}</p>
            )}
          </div>

          {/* Quantité Produit */}
          <div>
            <label htmlFor="quantite" className="block text-gray-300 font-medium mb-2">
              Quantité Produit
            </label>
            <input
              type="number"
              value={produit.quantite}
              name="quantite"
              id="quantite"
              onChange={getValue}
              className={`w-full px-4 py-2 bg-gray-700 border ${
                errors.quantite ? "border-red-500" : "border-gray-600"
              } rounded-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none`}
            />
            {errors.quantite && (
              <p className="text-red-500 text-sm mt-1">{errors.quantite}</p>
            )}
          </div>

          {/* Add Button */}
          <div>
            <button
              type="button"
              onClick={add_produit}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Ajouter
            </button>
          </div>
        </form>

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </div>
  );
}

export default Add_produit;