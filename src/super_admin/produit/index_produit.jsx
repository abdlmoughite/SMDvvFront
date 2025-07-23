import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { get_produit, supprimer_produit } from "../../redux/thunk";
import Swal from "sweetalert2"; // Import SweetAlert2
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Afficher_produit(props) {
  const route = props.route;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const list_produit = useSelector((state) => state.list_produit);
  const loading = useSelector((state) => state.loading);

  useEffect(() => {
    dispatch(get_produit());
  }, [dispatch]);

  const edit = (obj) => {
    navigate("/edit/produit", { state: { produit: obj, from: route } });
  };

  const Delete = (idp) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous ne pourrez pas annuler cette action !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6", // Matches bg-blue-500
      cancelButtonColor: "#ef4444", // Matches bg-red-500
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
      background: "#1f2937", // Matches bg-gray-800
      color: "#e5e7eb", // Matches text-gray-200
      customClass: {
        title: "text-white",
        confirmButton: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700",
        cancelButton: "bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(supprimer_produit(idp))
          .then(() => {
            toast.success("Produit supprimé avec succès !", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark", // Match the dark theme
            });
          })
          .catch(() => {
            toast.error("Une erreur s'est produite lors de la suppression.", {
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
    });
  };

  return (
    <div className="min-h-screen bg-gray-800 p-4">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <>
          {list_produit.length !== 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list_produit.map((i) => (
                <div
                  key={i.id_produit}
                  className="border border-gray-600 bg-gray-900 p-4 rounded-lg shadow-lg flex flex-col items-center"
                >
                  <div className="info text-center mb-4">
                    <p className="text-xl font-semibold text-white">{i.nom}</p>
                    <p className="text-gray-400">Prix: {i.prix_produit}dh</p>
                    <p className="text-gray-400">Quantité: {i.quantite}</p>
                  </div>

                  {/* Image with circular shape */}
                  <img
                    className="w-32 h-32 object-cover mb-4 rounded-full border border-gray-600"
                    src={`/public/image/${i.image}`}
                    alt={i.image}
                  />

                  <div className="flex space-x-4">
                    <button
                      onClick={() => edit(i)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => Delete(i.id_produit)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full mt-4">
              <p className="text-gray-400">Aucun produit pour le moment</p>
            </div>
          )}
        </>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default Afficher_produit;