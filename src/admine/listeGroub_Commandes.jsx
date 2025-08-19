import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ajouter_coust_groub,update_coust_cmd, edit_coust_groub,update_commande_jour_cost, get_coust_groub , update_commande } from "../redux/thunk.jsx";
import { useSelector } from "react-redux";
import { list_coust_groub } from "../redux/reducers.jsx";
import { edit, get_commande } from "../redux/actions.jsx";
import { set } from "date-fns";
import { use } from "react";

const ListeGroubCommandes = () => {
    
    const [data , setdata] = useState(0)
    const [NouveuaCoust , setNouveuaCoust] = useState(0)


    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(get_coust_groub());
        
    }, [data, dispatch]);

    const [isOpen, setIsOpen] = useState(false);
      const openPopup = () => setIsOpen(true);
      const closePopup = () => setIsOpen(false);
    const list_commandes = useSelector((state) => state.list_commandes);
    const list_coust_groub_sort = useSelector((state) => state.list_coust_groub);
     
    const list_coust_groub = Array.isArray(list_coust_groub_sort) ? list_coust_groub_sort.sort((a, b) => new Date(b.date_coust) - new Date(a.date_coust)) : [];

    const [ajouterADS , setajouterADS] = useState(0);

    const ajouter_jour_coust = (e)=>{
        e.preventDefault();
        const date = e.target.date.value;
        const cost = e.target.cost.value;
        const name_produit = e.target.name_produit.value;
            const newCoust = {
                date_coust: date,
                coust: cost,
                name_produit: name_produit,
            };
            setdata(newCoust);
            dispatch(ajouter_coust_groub(newCoust));
            alert('coust ajouter avec success');
            closePopup();
    }

    const handleUpdate = (id, newCost) => {
        const updatedCoust = {
            id: id,
            coust: newCost,
        };
        setdata(updatedCoust);
        dispatch(edit_coust_groub(updatedCoust));
        const commandes_sons_cost = list_commandes.filter((i) => i.coustgroub_id == id);
        dispatch(update_coust_cmd(commandes_sons_cost , newCost ))
        dispatch(get_coust_groub());
    }

    const [openGroub , setopenGroub] = useState(false);

    const commandes_sons_cost = list_commandes.filter((i) => i.coustgroub_id == null);

    const [choise_jour_select , setchoise_jour_select] = useState(0);
    const [id_coust_jour , setid_coust_jour] = useState(0);

    const choise_jour = (id_commande)=>{
      setchoise_jour_select(id_commande)
      setid_coust_jour(list_coust_groub[0].id)
    }

    const ajouter_Fin= ()=>{
      const commande = list_commandes.find(i => i.id_commande == choise_jour_select);
      commande.coustgroub_id = id_coust_jour;
      dispatch(update_commande_jour_cost(commande));
      trater_coust(id_coust_jour)
    }

    const trater_coust = (id_coust)=>{
      const obj_jour_cmd = list_commandes.filter(i => i.coustgroub_id == id_coust);
      const coust = list_coust_groub.find(i => i.id == id_coust_jour);
      dispatch(update_coust_cmd(obj_jour_cmd , coust ))
      dispatch(get_coust_groub());
    }
    const [ProfitParJour , setProfitParJour] = useState(0);
    
  useEffect(() => {
    const profitCalcul = {};

    list_commandes.forEach((j) => {
      let profit = 0;
      if (j.status === "livrer") {
        profit = j.prix - j.prix_livraison - j.prix_produit - j.cost;
      } else {
        profit = -j.cost;
        if (j.status === "refuser") profit -= 10;
      }

      if (j.coustgroub_id) {
        if (!profitCalcul[j.coustgroub_id]) {
          profitCalcul[j.coustgroub_id] = 0;
        }
        profitCalcul[j.coustgroub_id] += profit;
      }
    });

    setProfitParJour(profitCalcul); 
  }, [list_commandes]);


  const [serchejour , setcserchejour] = useState([]);
  const serche =(e)=>{
    const value = e.target.value;
      const filteredList = list_coust_groub.filter((i) => i.date_coust.includes(value));
      setcserchejour(filteredList)
      console.log(filteredList);

  }
  const reload = ()=>{
    window.location.reload()
  }

  const [date_filter , setdate_filter] =  useState({
    date_farst : '',
    date_fin: '',
  })

  const [data_fin_filter , setdata_fin_filter] = useState([]);

  const setdate = (e)=>{
    setdate_filter({...date_filter , [e.target.name] : e.target.value})
  }

  const filter = ()=>{
      const datafilter = list_coust_groub.filter((i=> i.date_coust >= date_filter.date_farst && i.date_coust <= date_filter.date_fin));
      setdata_fin_filter(datafilter);
  }



return (<>
    <h1 className="text-2xl font-bold text-center mt-8 bg-slate-400">Liste des commandes sons cost</h1>    {
        commandes_sons_cost.length > 0  ? 
        commandes_sons_cost.map((i, index) => {
            return (
              <>
                <tr onClick={()=>{choise_jour(i.id_commande)}} key={i.id_commande} className="hover:bg-gray-800 cursor-pointer">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-200">
                            {i.id_commande}
                          </td>
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
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                              {i.status}
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
              {choise_jour_select > 0 && choise_jour_select == i.id_commande &&
                <div className="bg-white font-bold p-2">
                  {choise_jour_select} {'=>'} 
                  <select onChange={(e)=> setid_coust_jour(e.target.value)} name="jour_ads" id="">
                    {list_coust_groub.map((j, index) => {
                        return (
                          <option key={j.id} value={j.id} onClick={()=>{setchoise_jour_select(j.id)}} className="bg-gray-200 text-gray-800 p-2 rounded-md">
                            {j.date_coust}
                          </option>
                        )
                    })}
                  </select>
                  <button onClick={ajouter_Fin} className="bg-blue-400 p-1 ">Ajouter</button>
                </div>
              }
              </>
            )
        })
        : 
        <p className="text-center text-red-500">Aucune commande trouvée</p>
    }

    <div className="bg-slate-800 flex  text-white font-bold p-4 rounded-lg shadow-md m-9">
      <h1 className="text-2xl">
        number de jours {list_coust_groub.length}
      </h1>
        

        <button onClick={openPopup} className="bg-blue-500 m-1 text-white px-4 py-2 rounded hover:bg-blue-600 ml-4">Ajouter Jour</button>
        <input type="date" className="w-36 bg-white m-1 text-blue-400 p-2 rounded-md" name="serche" id="serche" onChange={serche}/>
        <button className="bg-green-500 text-white m-1 px-4 py-2 rounded hover:bg-green-600 ml-4" onClick={reload}>afficher tous</button>
        <div className="ml-96">
          <input type="date"  onChange={setdate}  name="date_farst" className="w-36 m-1 bg-white text-blue-400 p-2 rounded-md" />
          <input type="date" onChange={setdate} name="date_fin" className="w-36 bg-white text-blue-400 p-2 rounded-md" />
          <button onClick={filter} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-4">Rechercher</button>
        </div>
      </div>
    {isOpen && (
<div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
    <h2 className="text-xl font-bold text-center mb-4">Ajouter un jour</h2>
    <form action="" onSubmit={ajouter_jour_coust}>
    <div className="mb-4">
        
      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
        Date
      </label>
      <input
        type="date"
        id="date"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Entrez la date"
        required
      />
      <label htmlFor="name_produit" className="block text-sm font-medium text-gray-700">
        name_produit
      </label>
      <input
        type="text"
        id="name_produit"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="nom produit"
        required
      />
    </div>
    
    <div className="mb-6">
      <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
        Coût
      </label>
      <input
        type="number"
        id="cost"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Entrez le coût"
        required
      />
    </div>

    <div className="flex justify-between items-center">
      <button
        onClick={closePopup}
        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
      >
        Fermer
      </button>

      <input type="submit" value={'ajouter'} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"/>
    </div>
    </form>
  </div>
</div>

      )}
    {list_coust_groub.length > 0 && data_fin_filter.length==0 ? 
        list_coust_groub.map((i, index) => {
            return (
        <div className="bg-slate-600 m-9 p-4 rounded-lg shadow-md">
            <div className=" items-center justify-between ">
                <h1 className="text-xl font-bold">jour {i.date_coust}</h1>
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-bold">produit : {i.name_produit}</h1>
                  <h1 className="text-xl font-bold"> ||| profit : {ProfitParJour[i.id]}</h1>
                </div>
                <div className="flex items-center gap-4">
                    {ajouterADS > 0 && i.id == ajouterADS ?
                    <>
                        <p className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold">cost : {NouveuaCoust}</p>
                        <input type="number" value={NouveuaCoust} onChange={(e)=> setNouveuaCoust(e.target.value)} className="w-20 bg-black text-blue-400 p-2 rounded-md" />
                        <button onClick={()=>{setajouterADS(0); handleUpdate(i.id , NouveuaCoust )}} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Mise a jour</button>
                    </>
                    :
                    <>
                    <p className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold">cost : {i.coust}</p>
                    <button onClick={()=>{setajouterADS(i.id)}} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">ADS</button>
                    </>
                    }

                    {openGroub == i.id ? 
                    
                    <button onClick={()=>{setopenGroub(false)}} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                        <h1 className="text-xl font-bold">{'^'}</h1>
                    </button>
                    : 
                    <>
                    <button onClick={()=>{setopenGroub(i.id)}} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                        <h1 className="text-xl font-bold">{'>'}</h1>
                    </button>
                    </>
                    }
                </div>
                    {openGroub == i.id &&
                    <>
                    {list_commandes.map((j, index) => {
                      if (j.coustgroub_id == i.id) {
                        return (
                           <tr onClick={()=>{choise_jour(i.id_commande)}} key={i.id_commande} className="hover:bg-gray-800 cursor-pointer">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-200">
                            {j.id_commande}
                          </td>
                          {/* {console.log(i)} */}
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {j.numero}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {j.nom_c}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {j.ville_commande}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {j.nom}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {j.status}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {j.prix}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {j.date_commande}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {j.status == "livrer" ? j.prix - j.prix_livraison - j.prix_produit - j.cost : -j.cost - ( j.status == "refuser" ?  10 : 0 ) }
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {j.cost }
                          </td>
              </tr>
                        ) 
                      }
                          })
                    
                    }
                </>
        }
            </div>
        </div>
            )
        })
    :data_fin_filter.length >0 ?
        data_fin_filter.map((i, index) => {
            return (
        <div className="bg-slate-600 m-9 p-4 rounded-lg shadow-md">
            <div className=" items-center justify-between ">
                <h1 className="text-xl font-bold">jour {i.date_coust}</h1>
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-bold">produit : {i.name_produit}</h1>
                  <h1 className="text-xl font-bold"> ||| profit : {ProfitParJour[i.id]}</h1>
                </div>
                <div className="flex items-center gap-4">
                    {ajouterADS > 0 && i.id == ajouterADS ?
                    <>
                        <p className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold">cost : {NouveuaCoust}</p>
                        <input type="number" value={NouveuaCoust} onChange={(e)=> setNouveuaCoust(e.target.value)} className="w-20 bg-black text-blue-400 p-2 rounded-md" />
                        <button onClick={()=>{setajouterADS(0); handleUpdate(i.id , NouveuaCoust )}} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Mise a jour</button>
                    </>
                    :
                    <>
                    <p className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold">cost : {i.coust}</p>
                    <button onClick={()=>{setajouterADS(i.id)}} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">ADS</button>
                    </>
                    }

                    {openGroub == i.id ? 
                    
                    <button onClick={()=>{setopenGroub(false)}} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                        <h1 className="text-xl font-bold">{'^'}</h1>
                    </button>
                    : 
                    <>
                    <button onClick={()=>{setopenGroub(i.id)}} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                        <h1 className="text-xl font-bold">{'>'}</h1>
                    </button>
                    </>
                    }
                </div>
                    {openGroub == i.id &&
                    <>
                    {list_commandes.map((j, index) => {
                      if (j.coustgroub_id == i.id) {
                        return (
                           <tr onClick={()=>{choise_jour(i.id_commande)}} key={i.id_commande} className="hover:bg-gray-800 cursor-pointer">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-200">
                            {j.id_commande}
                          </td>
                          {/* {console.log(i)} */}
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {j.numero}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {j.nom_c}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {j.ville_commande}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {j.nom}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {j.status}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {j.prix}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {j.date_commande}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {j.status == "livrer" ? j.prix - j.prix_livraison - j.prix_produit - j.cost : -j.cost - ( j.status == "refuser" ?  10 : 0 ) }
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {j.cost }
                          </td>
              </tr>
                        ) 
                      }
                          })
                    
                    }
                </>
        }
            </div>
        </div>
            )
        })
    :(
      <> not found data </>
    )
    
    } 
</>)
}
export default ListeGroubCommandes;