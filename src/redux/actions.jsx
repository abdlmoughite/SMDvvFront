import { type } from "@testing-library/user-event/dist/type";

export const loading = () => ({
  type: "LOADING",
  payload:true,
});


//// interface 1
export const produit_list = (data) => ({
  type: "PRODUIT_LIST",
  payload:data,
});

export const setCommande=(data)=>({
  type:"SET_COMMANDES",
  payload:data
})

export const seleteCommande=(data)=>({
  type:"DELETE_COMMANDES",
  payload:data
})

export const set_produit_qnt=(data)=>({
  type:'SET_QNT_PRODUIT',
  payload:data
})

export const add_commande=(data)=>({
  type:"ADD_COMMANDE",
  payload:data
})

export const  get_commande_a_ajouter=(list)=>({
  type:'LIST_COMMANDE_A_AJOUTER',
  payload:list
})

export const  claire_commandes=(id)=>({
  type:'CLAIRE_COMMANDES',
  payload:id
})

//////// interface 2
export const  get_commande=(list)=>({
  type:'LIST_COMMANDE',
  payload:list
})

export const set_status=(cmd)=>({
  type:'SET_STATUS',
  payload:cmd
})

//////admin

export const category_list=(list)=>({
  type:'LIST_CATEGORY',
  payload:list
})

export const delete_category=(id_c)=>({
   type:"DELETE_CATEGORY",
   payload:id_c

})


export const delete_produit=(idp)=>({
  type:'DELETE_PRODUIT',
  payload:idp
})

export const add_category=(data)=>({
  type:'ADD_PRODUIT',
  payload:data
})

//////////login

export const login_user=(id_role,token,message,user)=>({
  type:'LOGIN',
  payload:{id_role:id_role,token:token,message:message,user:user}
})


export const message_error=(data)=>({
  type:'GESTION_MSG_ERR',
  payload:data
})

export const get_role=(data)=>({
  type:'GET_ROLE',
  payload:data
})

export const get_user=(data)=>({
  type:'GET_USER',
  payload:data
})

export const get_depence=(data)=>({
  type:'GET_DEPENCE',
  payload:data
})

export const get_cmd_calcul=(data)=>({
  type:'CMD_CALCUL',
  payload:data
})

export const set_users=(data)=>({
  type:'SET_USERS',
  payload:data
})
