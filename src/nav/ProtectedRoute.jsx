import React from 'react';
import { Navigate } from 'react-router-dom';
import Add_produit from "../super_admin/produit/Add_produit";
import Permission from './Permitiion';
const ProtectedRoute = ({ children, isAllowed, route }) => {
    if (isAllowed) {
      // Utilise la valeur de 'route' pour rediriger dynamiquement
      return children;
    }
  
    // Sinon, rend le composant enfant
    return <Permission/>;;
  };
export default ProtectedRoute;
