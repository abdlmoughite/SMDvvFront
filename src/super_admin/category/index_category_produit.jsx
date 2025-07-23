import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate,useLocation } from "react-router-dom";
import { get_produit_category,supprimer_produit } from "../../redux/thunk";


function Afficher_category_produit(props) {
    const route=props.route
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location=useLocation()
    const id_category=location.state
    const list_produit = useSelector((state) => state.list_produit);
    const loading = useSelector((state) => state.loading);
    useEffect(() => {
      alert(1)
      dispatch(get_produit_category(id_category));
    }, []);
    const edit = (obj) => {
      navigate("/edit/produit", { state: {produit:obj,
        from:route
      } });
    };
  
    const Delete = (idp) => {
      dispatch(supprimer_produit(idp))
    };
  
    return (
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-gray-900"></div>
          </div>
        ) : (
          <>
            {list_produit.length !== 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {list_produit.map((i) => (
                  <div
                    key={i.id_produit}
                    className="border-4 border-double border-green-500 bg-green-100 p-4 rounded-lg shadow-lg flex flex-col items-center"
                  >
                    <div className="info text-center mb-4">
                      <p className="text-xl font-semibold">{i.nom}</p>
                      <p className="text-gray-700">Prix: {i.prix_produit}dh</p>
                      <p className="text-gray-700">Quantité: {i.quantite}</p>
                    </div>
    
                    {/* Image with circular shape */}
                    <img
                      className="w-32 h-32 object-cover mb-4 "
                      src={`http://127.0.0.1:8000/image/${i.image}`}
                      alt={i.nom}
                    />
    
                    <div className="flex space-x-4">
                      <button
                        onClick={() => edit(i)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => Delete(i.id_produit)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full mt-4">
                <p className="text-gray-500">Aucun produit pour le moment</p>
              </div>
            )}
          </>
        )}
      </div>
    );
    
    
}
export default Afficher_category_produit;
