import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { mise_jour_produit, get_category } from "../../redux/thunk";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Edit_produit() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const list_category = useSelector((state) => state.list_category);

  // Récupérer le produit et la route d'origine depuis l'état de la navigation
  const [produit, setProduit] = useState(location.state.produit);
  const from = location.state.from;

  // Charger les catégories au montage du composant
  useEffect(() => {
    dispatch(get_category());
  }, [dispatch]);

  // Gérer les changements dans les champs du formulaire
  const getValue = (e) => {
    if (e.target.name === "image") {
      setProduit({ ...produit, [e.target.name]: e.target.files[0] });
    } else {
      setProduit({ ...produit, [e.target.name]: e.target.value });
    }
  };

  // Mettre à jour le produit
  const update_produit = async () => {
    try {
      // Dispatch l'action de mise à jour du produit
      await dispatch(mise_jour_produit(produit));
  
      // Afficher un toast de succès
      toast.success("Produit mis à jour avec succès !", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  
      // Attendre que le toast soit affiché pendant 3 secondes (durée du toast)
      await new Promise((resolve) => setTimeout(resolve, 3000));
  
      // Rediriger vers la page précédente après la mise à jour
      navigate("/index/produit", { state: produit.id_category });
    } catch (error) {
      // Afficher un toast d'erreur en cas de problème
      toast.error("Une erreur s'est produite lors de la mise à jour.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Modifier le Produit
      </h1>

      <form className="space-y-4">
        {/* Nom Produit */}
        <div>
          <label htmlFor="nom" className="block text-gray-700 font-medium mb-2">
            Nom Produit
          </label>
          <input
            type="text"
            name="nom"
            id="nom"
            value={produit.nom}
            onChange={getValue}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Image Produit */}
        <div>
          <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
            Image Produit
          </label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={getValue}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category Produit */}
        <div>
          <label htmlFor="id_category" className="block text-gray-700 font-medium mb-2">
            Catégorie Produit
          </label>
          <select
            name="id_category"
            id="id_category"
            value={produit.id_category}
            onChange={getValue}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">Choisir une catégorie</option>
            {list_category.length !== 0 &&
              list_category.map((i) => (
                <option key={i.id_category} value={i.id_category}>
                  {i.nom}
                </option>
              ))}
          </select>
        </div>

        {/* Prix Produit */}
        <div>
          <label htmlFor="prix_produit" className="block text-gray-700 font-medium mb-2">
            Prix Produit
          </label>
          <input
            type="number"
            name="prix_produit"
            id="prix_produit"
            value={produit.prix_produit}
            onChange={getValue}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Quantité Produit */}
        <div>
          <label htmlFor="quantite" className="block text-gray-700 font-medium mb-2">
            Quantité Produit
          </label>
          <input
            type="number"
            name="quantite"
            id="quantite"
            value={produit.quantite}
            onChange={getValue}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Bouton de mise à jour */}
        <div>
          <button
            type="button"
            onClick={update_produit}
            className="w-full bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500 transition duration-300"
          >
            Mettre à jour
          </button>
        </div>
      </form>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default Edit_produit;