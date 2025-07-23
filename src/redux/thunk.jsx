import { compareAsc, format } from "date-fns";
import axios from "axios";

import {
  loading,
  seleteCommande,
  setCommande,
  produit_list,
  claire_commandes,

  set_produit_qnt,
  delete_category,
  get_commande_a_ajouter,
  ajouter_commande_claster,
  add_commande,
  get_commande,
  set_status,
  category_list,
  delete_produit,
  add_category,
  login_user,
  message_error,
  get_role,
  get_user,
  get_depence,
  get_cmd_calcul,
  set_users,
  falseloading,
  edit,
  add_coust_jour,
  get_coust
  
} from "./actions.jsx";
import { compose } from "redux";
const local="http://127.0.0.1:8000"
//////////////////////loading //////////////////////////
export const update_commande = (commande) => async (dispatch) => {
  dispatch(loading());
  console.log("commande", commande.id_commande);
  try {
    const res = await axios.put(
      local+"/api/commandes/" + commande.id,
      commande
    );
    if(res.status==200){
      dispatch(setCommande(res.data));
    }

  } catch (error) {
    console.log(error);
  }
};

export const delete_commande = (id) => async (dispatch) => {
  dispatch(loading());
  try {

    const res = await axios.delete(local+"/api/commandes/" + id);
    if (res.status == 200) {

      dispatch(seleteCommande(id));
    }
  } catch (error) {
    console.log(error);
  }
};
//////////////////interface 1 ///////////////////////////
export const get_produit = () => async (dispatch) => {
  /// afficher la list des produit
  dispatch(loading());
  try {
    const res = await axios.get(local+"/api/produit",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-user")}`,
        },
      });
    dispatch(produit_list(res.data));
  } catch (error) {
    console.log(error);
  }
};

export const add_commandes = (commande) => async (dispatch) => {
  dispatch(loading());
  console.log("3azi" , commande);
  try {
    const res = await axios.post(local+"/api/commandes", commande);
    dispatch(add_commande(res.data));
    dispatch(falseloading());
  } catch (error) {
    console.log(error);
        dispatch(falseloading());
  }
    dispatch(falseloading());
};

export const get_commandes = () => async (dispatch) => {
  dispatch(loading());
  try {
    const res = await axios.get(local+"/api/commandes");
    dispatch(get_commande_a_ajouter(res.data));
  } catch (error) {
    console.log(error);
  }
};

export const set_qnt_produit = (objQnt) => async (dispatch) => {
  dispatch(loading);
  try {


    const res = await axios.put(local+"/api/produit/qnt/"+objQnt.id_produit,
    objQnt,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-user")}`,
        },
      });

    if (res.status == 200) {

      dispatch(set_produit_qnt(res.data));
    }
  } catch (error) {
    console.log(error);
  }
};

export const engr_commande = (commandes) => async (dispatch) => {
  dispatch(loading());
  try {
    const count_ligne = commandes.length;
    for (let i = 0; i < count_ligne; i++) {
      console.log("commande", commandes[i]);
      const client = {
        numero_client: commandes[i].numero_client,
        nom_client: commandes[i].nom_client,
        ville: commandes[i].ville,
        adresse_client: commandes[i].adresse_client,
      };
      try {
        const res_client = await axios.post(local + "/api/client", client, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-user")}`,
          },
        });
        if (res_client.status === 201 || res_client.status === 200) {
          const commande = {
            id_commande: commandes[i].id_commande,
            ville: commandes[i].ville,
            quntite: commandes[i].quntite,
            prix_livraison: commandes[i].prix_livraison,
            prix: commandes[i].prix,
            commentaire: commandes[i].commantaire,
            ville_commande: commandes[i].ville,
            numero: res_client.data.numero,
            id_produit: commandes[i].produit_id,
            date_commande: commandes[i].date_commande,
            id_user: localStorage.getItem("id-user"),
            status: "Miss",
          };
          console.log("commande", commande);
          try {
            const res_commande = await axios.post(local + "/api/commande", commande, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token-user")}`,
              },
            });

            if (res_commande.status === 201 ) {
              await axios.get(local + "/api/SupCommandes/" + commandes[i].id);
              dispatch(claire_commandes(commandes[i].id_commande));
            } else {
              console.error(`Erreur lors de l'ajout de la commande ${commandes[i].id_commande}`);
            }
          } catch (error) {
            console.error("Erreur lors de la création de la commande : ", error);
            dispatch(falseloading());
          }
        } else {
          console.error(`Erreur lors de la création du client ${commandes[i].id_commande}`);
          dispatch(falseloading());
        }
      } catch (error) {
        console.error("Erreur lors de la création du client : ", error);
        dispatch(falseloading());
      }
    }

    // const res_client=await axios.post(local+"/api/client")
  } catch (error) {
    console.error("Erreur dans l'enregistrement des commandes", error);
    dispatch(falseloading());
  }
};


///////////////interface 2///////////////////////////////////////////////////
export const get_list_cmd = () => async (dispatch) => {
  dispatch(loading());
  try {
    const res = await axios.get(local+"/api/commande", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token-user")}`,
      },
    });
    if (res.status == 200) {

      console.log(res);
      dispatch(get_commande(res.data));
    }
  } catch (error) {
    console.log(error);
    dispatch(falseloading());
  }
};

export const set_status_commande = (id_c, new_status) => async (dispatch) => {
  dispatch(loading());

  try {
    if (new_status[0].nom == "livrer") {
      const new_statuss = {
        ...new_status[0],
        date_livraison: format(new Date(), "yyyy-MM-dd"),
      };
      console.log(new_status);
      const res = await axios.put(
        local+"/api/commande/status/" + id_c,
        new_statuss,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-user")}`,
          },
        }
      );
      console.log(res.data);
      dispatch(set_status(res.data));
    } else {
      const res = await axios.put(
        local+"/api/commande/status/" + id_c,
        new_status[0],
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-user")}`,
          },
        }
      );
      console.log(res.data);
      dispatch(set_status(res.data));
    }
  } catch (error) {
    console.log(error);
  }
};

////// admoine part
export const ajouter_produit = (produit) => async (dispatch) => {
  dispatch(loading());
  try {
    const formData = new FormData();
    formData.append("nom", produit.nom);
    formData.append("image", produit.image);
    formData.append("quantite", produit.quantite);
    formData.append("category", produit.category);
    formData.append("prix", produit.prix);
    //console.log(formData.prix)
    const pro = await axios.post(local+"/api/produit", formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-user")}`,
        },
      });
    console.log(pro.data);
  } catch (error) {
    console.log(error);
  }
};

export const get_category = () => async (dispatch) => {
  /// afficher la list des produit
  dispatch(loading());
  try {
    const res = await axios.get(local+"/api/category",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-user")}`,
        },
      });
    dispatch(category_list(res.data));
  } catch (error) {
    console.log(error);
  }
};

export const mise_jour_produit = (produit) => async (dispatch) => {
  dispatch(loading());
  try {
    const formData = new FormData();
    formData.append("nom", produit.nom);
    formData.append("image", produit.image);
    formData.append("quantite", produit.quantite);
    formData.append("id_category", produit.id_category);
    formData.append("prix_produit", produit.prix_produit);
    //console.log(formData.prix)
    const pro = await axios.post(
      local+"/api/produitt/" + produit.id_produit,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-user")}`,
        },
      }
    );
    console.log(pro.data);
  } catch (error) {
    console.log(error);
  }
};

export const supprimer_produit = (idp) => async (dispatch) => {
  dispatch(loading());
  try {
    const res = await axios.delete(local+"/api/produit/" + idp,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-user")}`,
        },
      });
    dispatch(delete_produit(idp));
  } catch (error) {
    console.log(error);
  }
};

export const get_produit_category = (idc) => async (dispatch) => {

  dispatch(loading());
  try {
    const res = await axios.get(
      local+"/api/category/produit/" + idc,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-user")}`,
        },
      }
    );
    dispatch(produit_list(res.data));
  } catch (error) {
    console.log(error);
  }
};

export const supprimer_category = (idc) => async (dispatch) => {
  dispatch(loading());
  try {
    const res = await axios.delete(local+"/api/category/" + idc,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-user")}`,
        },
      });
    dispatch(delete_category(res.data.id_category));
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};

export const ajouter_category = (obj) => async (dispatch) => {
  dispatch(loading());
  try {
    const res = await axios.post(local+"/api/category", obj,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-user")}`,
        },
      });
    console.log(res.data);
    dispatch(add_category(res.data));
  } catch (error) {
    console.log(error);
  }
};

////////////////////////////////////////////////////////////////////////////login part
export const login = (user) => async (dispatch) => {
  dispatch(loading());
  try {
    const res = await axios.post(local+"/api/login", user,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-user")}`,
        },
      });
    console.log("datalofin: "+res.data);
    if (res.data.success == true) {
      dispatch(
        login_user(
          res.data.id_role,
          res.data.token,
          res.data.message,
          res.data.user
        )
      );
      localStorage.setItem("response", JSON.stringify(res.data));
      localStorage.setItem("token-user", res.data.token);
      localStorage.setItem("id_role-user", res.data.id_role);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } else {
      dispatch(login_user(null, null, res.data.message));
    }
  } catch (error) {
    console.log(error);
  }
};

export const logout = () => async (dispatch) => {
  dispatch(loading());
  try {

    const res = await axios.post(
      local+"/api/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-user")}`,
        },
      }
    );
    if (res.status == 200) {
      console.log(res.data);
      await localStorage.clear();
      await dispatch(login_user(null, null, "",null));
      
    }
  } catch (error) {
    console.log(error);

  }
};
////////////////////////////////////////////////////////////////////////////////
//gestion de user(super admin)/////////////////////////////////////////////////
export const ajouter_users = (user) => async (dispatch) => {
  dispatch(loading());
  try {
    const res = await axios.post(local+"/api/register", user,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-user")}`,
        },
      });
    if (res.status === 201) {
      dispatch(message_error({ x: "" }));
      console.log(res.data);
    }
  } catch (error) {
    if (error.response.status === 422) {
      console.log("ww:", error.response.data.errors);
      dispatch(message_error(error.response.data.errors));
    } else {
      console.log(error);
    }
  }
};

export const get_roles = () => async (dispatch) => {
  dispatch(loading());
  try {
    const res = await axios.get(local+"/api/role",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-user")}`,
        },
      });

    if (res.status == 201) {
      console.log(res.data);
      dispatch(get_role(res.data));
    }
  } catch (error) {
    console.log(error);
  }
};

export const get_users = () => async (dispatch) => {
  dispatch(loading());

  try {
    const res = await axios.get(local+"/api/user",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-user")}`,
        },
      });

    if (res.status == 200) {
      console.log(res.data);
      dispatch(get_user(res.data));
    }
  } catch (error) {
    console.log(error);
  }
};

///////fuul control ////////////////////////////////////////////////////////
export const get_depences = () => async (dispatch) => {
  dispatch(loading());
  try {
    const res = await axios.get(local+"/api/depence", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token-user")}`,
      },
    });
    if (res.status == 200) {
      dispatch(get_depence(res.data));
    }
  } catch (error) {
    console.log(error);
  }
};

export const add_depences = (depence) => async (dispatch) => {

  dispatch(loading());
  try {
    const formData = new FormData();
    formData.append("nom", depence.nom);
    formData.append("description", depence.description);
    formData.append("date_depence", depence.date_depence);
    formData.append("montant", depence.montant);
    formData.append("produit", depence.produit);
    const res = await axios.post(
      local+"/api/depence",
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-user")}`,
        },
      }
    );

    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};

//////////////////////calcul

export const get_cmd_calculs = () => async (dispatch) => {
  dispatch(loading());

  try {
    const res = await axios.get(local+"/api/calcul", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token-user")}`,
      },
    });
    if (res.status == 200) {
      dispatch(get_cmd_calcul(res.data));
    }
  } catch (error) {
    console.log(error);
  }
};

export const affecter_permition = (id_user, new_obj) => async (dispatch) => {
  dispatch(loading());
  try {
    const res = await axios.post(
      local+"/api/permition/" + id_user,
      new_obj,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-user")}`,
        },
      }
    );

    if (res.status == 200) {
      dispatch(set_users(res.data));
    }
  } catch (error) {
    console.log(error);
  }
};


export const ajouter_coust_groub = (data) => async (dispatch) => {
  dispatch(loading());
  
  try {
    const res = await axios.post(local+"/api/coust",  data,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token-user")}`,
      },
    } );
    if (res.status == 200 || res.status == 201) {
      console.log(res.data);
      dispatch(get_coust(res.data));
    }
  } catch (error) {
    console.log(error);
  }
};


export const get_coust_groub = () => async (dispatch) => {
  dispatch(loading());
  try {
    const res = await axios.get(local+"/api/Groupe_commande", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token-user")}`,
      },
    });
    const res2 = await axios.get(local+"/api/commande", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token-user")}`,
      },
    }); 
    if (res2.status == 200 || res2.status == 201) {
      console.log(res2);
      dispatch(get_commande(res2.data));
    }
    if (res.status == 200 || res.status == 201) {
      console.log(res.data);
      dispatch(get_coust(res.data));
    }
  } catch (error) {
    console.log(error);
  }
};


export const edit_coust_groub = (newData) => async (dispatch) => {
  dispatch(loading());
  try {
    const res = await axios.post(local+"/api/newCoust", newData ,  {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token-user")}`,
      },
    });
    if (res.status == 200 || res.status == 201) {
      console.log(res.data);
      dispatch(get_coust(res.data));
    }
  } catch (error) {
    console.log(error);
  }
};

export const update_commande_jour_cost = (commande) => async (dispatch) => {
  dispatch(loading());
  console.log("commande", commande.id_commande);
  try {
    const res = await axios.post(
      local+"/api/update_commande_jour_cost/",
      commande
    );
    if(res.status==200){
      dispatch(setCommande(res.data));
      dispatch(get_coust(res.data));
    }

  } catch (error) {
    console.log(error);
  }
};
export const update_coust_cmd = (commandes , coust) => async (dispatch) => {
  dispatch(loading());
  console.log("coust", coust);
  try {
    const res = await axios.post(
      local+"/api/update_coust_cmd/",
      {'commandes' : commandes, 
        'coust' : coust
      }
    );
    if(res.status==200){
      dispatch(setCommande(res.data));
      dispatch(get_coust(res.data));
    }
  } catch (error) {
    console.log(error);
  }
};