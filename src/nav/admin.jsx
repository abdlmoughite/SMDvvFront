import React from "react";
import { BrowserRouter as Router, Routes, Route,Link  } from "react-router-dom";
import Add_commande from "../admine/interface1";
import List_commande from "../admine/interface2";
import Afficher_depence from "../full_control/index_despence";

function Nav_admin(){
    return (
        <Router>
            <div className=" py-6 px-4">
    {/* Navbar */}
    <nav className="bg-blue-700 p-4 rounded-lg shadow-lg mb-8">
        <ul className="flex space-x-6 justify-center">
            <li>
                <Link
                    to="/add/commande"
                    className="px-4 py-2 bg-white text-blue-700 rounded-lg shadow hover:bg-gray-200"
                >
                    Ajouter une commande
                </Link>
            </li>
            <li>
                <Link
                    to="/list/commande"
                    className="px-4 py-2 bg-white text-blue-700 rounded-lg shadow hover:bg-gray-200"
                >
                    Liste des commandes
                </Link>
            </li>
            <li>
                <Link
                    to="/index/depences"
                    className="px-4 py-2 bg-white text-blue-700 rounded-lg shadow hover:bg-gray-200"
                >
                    Liste des commandes
                </Link>
            </li>
        </ul>
    </nav>
    
    {/* Content */}
    <div className="bg-black p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
        <Routes>
            <Route path="/add/commande" element={<Add_commande />} />
            <Route path="/list/commande" element={<List_commande />} />
            <Route path="/index/depences" element={<Afficher_depence />} />
        </Routes>
    </div>
</div>
        </Router>
    );
    
    
    
    
}
export default Nav_admin