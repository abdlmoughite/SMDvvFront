import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineHome,
  AiOutlineLogout,
} from "react-icons/ai";
import {
  MdCategory,
  MdShoppingCart,
  MdPeople,
  MdAttachMoney,
  MdInventory,
  MdListAlt,
  MdAddCircleOutline,
  MdPersonAdd,
  MdPayment,
} from "react-icons/md";

// Import components
import Add_commande from "../admine/interface1";
import List_commande from "../admine/interface2";
import Add_produit from "../super_admin/produit/Add_produit";
import Afficher_produit from "../super_admin/produit/index_produit";
import Edit_produit from "../super_admin/produit/edit_produit";
import Afficher_category from "../super_admin/category/index_category";
import Ajouter_category from "../super_admin/category/add_category";
import Ajouter_user from "../super_admin/users/add_user";
import Afficher_users from "../super_admin/users/index_user";
import Afficher_depence from "../full_control/index_despence";
import Ajouter_depence from "../full_control/add_depence";
import Logout from "../login/logout";
import Accueil from "../full_control/accueil";
import Afficher_category_produit from "../super_admin/category/index_category_produit";
import ProtectedRoute from "./ProtectedRoute";
import { useSelector } from "react-redux";
import NewVille from "../complain/newVille";
import Login from "../login/login";
import ListeGroubCommandes from "../admine/listeGroub_Commandes";

function NavSuperAdmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const user = useSelector((state) => state.user);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navLinks = [
    { path: "/", label: "Accueil", icon: <AiOutlineHome />, permission: true },
    {
      path: "/add/commande",
      label: "Ajouter une commande",
      icon: <MdShoppingCart />,
      permission: "commandes",
    },
    {
      path: "/index/commande",
      label: "Liste commandes",
      icon: <MdListAlt />,
      permission: "commandes",
    },
    {
      path: "/index/Groupe_commande",
      label: "Groupe commande",
      icon: <MdListAlt />,
      permission: "commandes",
    },
    {
      path: "/add/produit",
      label: "Ajouter un produit",
      icon: <MdAddCircleOutline />,
      permission: "produits",
    },
    {
      path: "/index/produit",
      label: "Liste produits",
      icon: <MdInventory />,
      permission: "produits",
    },
    {
      path: "/index/category",
      label: "Liste catégories",
      icon: <MdCategory />,
      permission: "categorys",
    },
    {
      path: "/add/category",
      label: "Ajouter catégorie",
      icon: <MdCategory />,
      permission: "categorys",
    },
    {
      path: "/add/users",
      label: "Ajouter utilisateur",
      icon: <MdPersonAdd />,
      permission: "utilisateurs",
    },
    {
      path: "/index/users",
      label: "Liste utilisateurs",
      icon: <MdPeople />,
      permission: "utilisateurs",
    },
    {
      path: "/index/depences",
      label: "Liste dépenses",
      icon: <MdAttachMoney />,
      permission: "depence",
    },
    {
      path: "/add/depences",
      label: "Ajouter dépense",
      icon: <MdPayment />,
      permission: "depence",
    },
  ];

  const routes = [
    { path: "/ville", element: <NewVille /> },
    { path: "/", element: <Accueil /> },
    {
      path: "/add/commande",
      element: <Add_commande />,
      permission: "commandes",
    },
    {
      path: "/index/commande",
      element: <List_commande />,
      permission: "commandes",
    },
    {
      path: "/index/Groupe_commande",
      element: <ListeGroubCommandes />,
      permission: "commandes",
    },
    {
      path: "/add/produit",
      element: <Add_produit />,
      permission: "produits",
    },
    {
      path: "/index/produit",
      element: <Afficher_produit />,
      permission: "produits",
    },
    {
      path: "/edit/produit",
      element: <Edit_produit />,
      permission: "produits",
    },
    {
      path: "/index/category",
      element: <Afficher_category />,
      permission: "categorys",
    },
    {
      path: "/index/category/produit",
      element: <Afficher_category_produit />,
      permission: "categorys",
    },
    {
      path: "/add/category",
      element: <Ajouter_category />,
      permission: "categorys",
    },
    {
      path: "/add/users",
      element: <Ajouter_user />,
      permission: "utilisateurs",
    },
    {
      path: "/index/users",
      element: <Afficher_users />,
      permission: "utilisateurs",
    },
    {
      path: "/index/depences",
      element: <Afficher_depence />,
      permission: "depence",
    },
    {
      path: "/add/depences",
      element: <Ajouter_depence />,
      permission: "depence",
    },
    { path: "/logout", element: <Logout /> },
  ];

  return (
    <div className="min-h-screen flex bg-[#0f111b] text-white">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full shadow-lg transition-all duration-300 z-20 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
        style={{ backgroundColor: "#0f111b" }}
      >
        {/* Bouton toggle */}
        <button
          className="p-4 text-white flex items-center justify-center w-full"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? (
            <AiOutlineClose size={20} />
          ) : (
            <AiOutlineMenu size={20} />
          )}
        </button>

        {/* Logo + nom */}
        <div className="px-4 py-3 flex flex-col items-start">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 rounded p-1">
              {/* Icon panier / logo */}
              <MdShoppingCart size={24} className="text-white" />
            </div>
            {isSidebarOpen && (
              <div>
                <h1 className="text-blue-400 text-xl font-semibold">SMDvv</h1>
                <p className="text-gray-400 text-sm">Gestion de Commandes</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex flex-col overflow-y-auto h-[calc(100vh-96px)] scrollbar-thin scrollbar-thumb-[#2d65e6] scrollbar-track-[#0f111b]">
          <ul className="space-y-3 px-2">
            {navLinks.map(({ path, label, icon, permission }, index) => {
              const isActive = location.pathname === path;
              if (user.permition[permission] === false) return null;

              return (
                <li key={index} className="relative">
                  <Link
                    to={path}
                    className={`flex items-center p-3 rounded-lg transition-colors duration-200
                      ${
                        isActive
                          ? "bg-[#2d65e6] text-white"
                          : "text-gray-400 hover:bg-gray-700 hover:text-white"
                      }
                    `}
                  >
                    <span
                      className={`mr-3 text-lg ${
                        isActive ? "text-white" : "text-blue-400"
                      }`}
                    >
                      {icon}
                    </span>
                    {isSidebarOpen && <span>{label}</span>}
                  </Link>

                  {/* Petit point bleu à droite du label quand actif */}
                  {isActive && isSidebarOpen && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></span>
                  )}
                </li>
              );
            })}

            {/* Déconnexion */}
            <li>
              <Link
                to="/logout"
                className="flex items-center p-3 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200"
              >
                <span className="mr-3 text-lg text-blue-400">
                  <AiOutlineLogout />
                </span>
                {isSidebarOpen && <span>Déconnexion</span>}
              </Link>
            </li>
            <li></li><br />
            <li></li><br />
            <li></li><br />
            <li></li><br />
            <li></li><br />
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`flex-grow p-6 bg-black text-gray-900 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <br />
        <br />

        <Routes>
          {routes.map(({ path, element, permission }, index) => (
            <Route
              key={index}
              path={path}
              element={
                permission ? (
                  <ProtectedRoute isAllowed={user.permition[permission]}>
                    {element}
                  </ProtectedRoute>
                ) : (
                  element
                )
              }
            />
          ))}
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return <NavSuperAdmin />;
}
