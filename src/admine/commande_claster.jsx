import { useState } from "react";

function Claster_commande(props){
   const [claster, setClaster] = useState(props.claster);
   

   return (
      <div className="overflow-x-auto">
         <table className="min-w-full bg-white border-collapse shadow-md rounded-md overflow-hidden">
            <thead className="bg-gray-50">
               <tr className="text-left text-gray-700 uppercase tracking-wider">
                  <th className="py-3 px-4">id commande</th>
                  <th className="py-3 px-4">nom client</th>
                  <th className="py-3 px-4">numero client</th>
                  <th className="py-3 px-4">adresse client</th>
                  <th className="py-3 px-4">ville</th>
                  <th className="py-3 px-4">quantité</th>
                  <th className="py-3 px-4">prix</th>
                  <th className="py-3 px-4">nom produit</th>
                  <th className="py-3 px-4">commentaire</th> 
                  <th className="py-3 px-4">action</th> 
               </tr>
            </thead>
            <tbody className="text-gray-800">
               {claster.list_cmd.map((i, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                     <td className="py-3 px-4">{i.id_commande}</td>
                     <td className="py-3 px-4">{i.nom_client}</td>
                     <td className="py-3 px-4">{i.numero_client}</td>
                     <td className="py-3 px-4">{i.adresse_client}</td>
                     <td className="py-3 px-4">{i.ville}</td>
                     <td className="py-3 px-4">{i.quantite}</td>
                     <td className="py-3 px-4">{i.prix}</td>
                     <td className="py-3 px-4">{i.nom_produit}</td>
                     <td className="py-3 px-4">{i.commantaire}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

export default Claster_commande;
