import { isAction } from "redux";
import { loading } from "./actions.jsx";

const initialState = {
    ////////login
    user_connect:null,
    token:typeof window!=="undefined" ? localStorage.getItem("token-user") : null,
    message:'',
    id_role:typeof window!=="undefined" ? localStorage.getItem("id_role-user") : null,
    user: typeof window !== "undefined" && localStorage.getItem('user') ? 
    
    (() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (e) {
            console.error("خطأ في تحليل بيانات المستخدم:", e);
            return {
                permition: {
                    graphe: false,
                    chiffre: false,
                    depence: false,
                    produits: false,
                    categorys: false,
                    commandes: false,
                    utilisateurs: false,
                    details_commandes: false,
                },
            };
        }
    })() : {
        permition: {
            graphe: false,
            chiffre: false,
            depence: false,
            produits: false,
            categorys: false,
            commandes: false,
            utilisateurs: false,
            details_commandes: false,
        },
    },

    /////////////////////////////////////////////////
    loading:false,
    //// admin////////////////////////////////////////////////////////////
    ////////////interface 1//////////////////////
    list_produit:'',
    commandes:[],

    /////////////interface 2////////////////////////
     list_commandes:[],


    ////////////////////// super admin////////////////////////////////////////
     list_category:[],
     list_role:[],
     list_users:[],

     /////// gestion message ereur //////////
     email:'',
     name:'',
     password:'',
     Confirmer_password:'',
     role:'',
     /////// gestion depence//////////////////////////////
     list_depence:[],
     ////////////////////////////////
     list_cmd_calcul:[] ,


     ////// coust ///////
     list_coust_groub : [],
  };

  const clientReducer = (state = initialState, action) => {
    switch (action.type) {

        case 'LOADING':
            return{
                ...state,
                loading:action.payload,
            }

            case 'OUT_LOADING':
            return{
                ...state,
                loading:action.payload,
            }

        case 'PRODUIT_LIST':
            return {
                ...state,
                list_produit:action.payload,
                loading:false
            }

        case "SET_COMMANDES":
            return{
                ...state,
                commandes:state.commandes.map(i=>{
                    if(i.id==action.payload.id){
                        return action.payload
                    }
                    return i
                }),
                loading:false

            }

        case "DELETE_COMMANDES":

            return{
                ...state,
                commandes:state.commandes.filter(i=>i.id!=action.payload),
                loading:false
            }

        case 'ADD_COMMANDE':

            return {
                ...state,
                commandes:[...state.commandes,action.payload],
                loading:false
            }

            case 'CLAIRE_COMMANDES':
            return {
                ...state,
                commandes:state.commandes.filter((i)=>i.id_commande!=action.payload),
                loading:false




            }


            case 'SET_QNT_PRODUIT':
                return {
                    ...state,
                    list_produit:state.list_produit.map((i)=>{
                        if(i.id_produit==action.payload.id_produit){
                            return action.payload
                        }
                        return i
                    })
                }

            case "LIST_COMMANDE_A_AJOUTER":
                return{
                    ...state,
                    commandes:action.payload.filter((i)=>i.id_user==state.user.id),
                    loading:false
                }
    ///////////////// interface 2
            case 'LIST_COMMANDE':
                return {
                    ...state,
                    list_commandes:action.payload,
                    loading:false
                }

            case 'SET_STATUS':
                return{
                    ...state,
                    list_commandes:state.list_commandes.map((i)=>{
                        if(i.id_commande===action.payload.id_commande){
                            return {...i,status:action.payload.status}
                        }
                        return i
                    }),
                    loading:false
                }

            ////// admin
            case 'LIST_CATEGORY':
                return{
                    ...state,
                    list_category:action.payload,
                    loading:false
                }

            case 'DELETE_PRODUIT':
                return {
                    ...state,
                    list_produit:state.list_produit.filter((i)=>i.id_produit!=action.payload),
                    loading:false
                }

            case 'DELETE_CATEGORY':
                return{
                    ...state,
                    list_category:state.list_category.filter((i)=>i.id_category!=action.payload),
                    loading:false
                }

            case 'ADD_PRODUIT':
                return{
                    ...state,
                    list_category:[...state.list_category,action.payload],
                    loading:false
                }

            case 'LOGIN':
                return {
                    ...state,
                    loading:false,
                    user:action.payload.user,
                    message:action.payload.message,
                    id_role:action.payload.id_role,
                    token:action.payload.token,
                }

            case 'GESTION_MSG_ERR':
                return{
                    ...state,
                    email:(action.payload.email && action.payload.email[0]) || '',
                    name:(action.payload.name && action.payload.name[0]) || '',
                    password:(action.payload.password && action.payload.password[0]) || '',
                    Confirmer_password:(action.payload.Confirmer_password && action.payload.Confirmer_password[0]) || '',
                    role:(action.payload.id_role && action.payload.id_role[0]) || '',
                    loading:false
                }

            case 'GET_ROLE':
                return {
                    ...state,
                    list_role:action.payload,
                    loading:false
                }

            case 'GET_USER':
                return{
                    ...state,
                    list_users:action.payload,
                    loading:false
                }

            case 'GET_DEPENCE':
                return{
                    ...state,
                    list_depence:action.payload,
                    loading:false
                }

            case 'CMD_CALCUL':
                return{
                        ...state,
                        list_cmd_calcul:action.payload,
                        loading:false
                    }

            case 'SET_USERS':
                return{
                    ...state,
                    list_users:state.list_users.map((i)=>{
                        if(i.id==action.payload.id){
                            return action.payload;
                        }
                        return i
                    }),
                    loading:false
                }

                //////couste
            case 'GET_COUST':
                return{
                    ...state,
                    list_coust_groub:action.payload,
                    loading:false
                }
            case 'ADD_COUST':
                return{
                    ...state,
                    list_coust_groub:action.payload,
                    loading:false
                }
            case 'edit_COUST':
                return{
                    ...state,
                    list_coust_groub:action.payload,
                    loading:false
                }

 default:
        return state;
    }
  };

  export default clientReducer;
