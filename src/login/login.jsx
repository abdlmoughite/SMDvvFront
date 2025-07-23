import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/thunk.jsx";
import axios from "axios";
function Login() {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.message);
  const loading = useSelector((state) => state.loading);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const getValue = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const login_user = async () => {
    await dispatch(login(user));
    navigate("/");
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Font Awesome CDN */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-300 text-lg">Connexion en cours...</p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md transform transition-all duration-500 ease-in-out hover:scale-105">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8">
            {/* App Logo and Name */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg">
                <i className="fas fa-chart-line text-white text-2xl"></i>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">SMDvv</h1>
              <p className="text-gray-400 text-sm">Connectez-vous à votre compte</p>
            </div>

            {/* Login Form */}
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email ou Nom
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={getValue}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-700/70"
                    placeholder="Entrez votre email ou nom"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <i className="fas fa-user text-gray-400"></i>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={user.password}
                    onChange={getValue}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-700/70"
                    placeholder="Entrez votre mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
                    Se souvenir de moi
                  </label>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="button"
                onClick={() => login_user()}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center justify-center">
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Se connecter
                </div>
              </button>

              {/* Error Message */}
              {message && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 animate-pulse">
                  <div className="flex items-center">
                    <i className="fas fa-exclamation-triangle text-red-400 mr-2"></i>
                    <p className="text-red-400 text-sm">{message}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;

// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { login } from "../redux/thunk.jsx";  // Make sure this is the correct import
// import axios from "axios";

// function Login() {
//   const dispatch = useDispatch();
//   const message = useSelector((state) => state.message);
//   const loading = useSelector((state) => state.loading);
//   const navigate = useNavigate();

//   const [user, setUser] = useState({
//     email: "",
//     password: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);

//   const getValue = (e) => {
//     setUser({ ...user, [e.target.name]: e.target.value });
//   };

//   const login_user = async () => {
//     try {
//       const res = await axios.post("http://127.0.0.1:8000/api/login", user, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token-user")}`,
//         },
//       });

//       console.log("Data from login response:", res.data);

//       if (res.data.success === true) {
//         // Dispatch the correct Redux action to store user info
//         dispatch(
//           login(
//             res.data.id_role,
//             res.data.token,
//             res.data.message,
//             res.data.user
//           )
//         );

//         // Store response and token in localStorage for future use
//         localStorage.setItem("response", JSON.stringify(res.data));
//         localStorage.setItem("token-user", res.data.token);
//         localStorage.setItem("id_role-user", res.data.id_role);
//         localStorage.setItem("user", JSON.stringify(res.data.user));

//         navigate("/"); // Redirect to home after successful login
//       } else {
//         // Handle failed login (show message)
//         dispatch(login(null, null, res.data.message));
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//     }
//   };

//   return (
//     <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
//       {/* Font Awesome CDN */}
//       <link
//         rel="stylesheet"
//         href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
//         integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
//         crossOrigin="anonymous"
//         referrerPolicy="no-referrer"
//       />

//       {loading ? (
//         <div className="flex items-center justify-center h-screen">
//           <div className="flex flex-col items-center">
//             <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500 mb-4"></div>
//             <p className="text-gray-300 text-lg">Connexion en cours...</p>
//           </div>
//         </div>
//       ) : (
//         <div className="w-full max-w-md transform transition-all duration-500 ease-in-out hover:scale-105">
//           <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8">
//             {/* App Logo and Name */}
//             <div className="text-center mb-8">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg">
//                 <i className="fas fa-chart-line text-white text-2xl"></i>
//               </div>
//               <h1 className="text-3xl font-bold text-white mb-2">SMDvv</h1>
//               <p className="text-gray-400 text-sm">Connectez-vous à votre compte</p>
//             </div>

//             {/* Login Form */}
//             <div className="space-y-6">
//               {/* Email Field */}
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-300 mb-2"
//                 >
//                   Email ou Nom
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     id="email"
//                     name="email"
//                     value={user.email}
//                     onChange={getValue}
//                     className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-700/70"
//                     placeholder="Entrez votre email ou nom"
//                     required
//                   />
//                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                     <i className="fas fa-user text-gray-400"></i>
//                   </div>
//                 </div>
//               </div>

//               {/* Password Field */}
//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-300 mb-2"
//                 >
//                   Mot de passe
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     id="password"
//                     name="password"
//                     value={user.password}
//                     onChange={getValue}
//                     className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-700/70"
//                     placeholder="Entrez votre mot de passe"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200"
//                   >
//                     <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
//                   </button>
//                 </div>
//               </div>

//               {/* Remember Me & Forgot Password */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="remember"
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
//                   />
//                   <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
//                     Se souvenir de moi
//                   </label>
//                 </div>
//               </div>

//               {/* Login Button */}
//               <button
//                 type="button"
//                 onClick={login_user} // Corrected the onClick handler
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
//               >
//                 <div className="flex items-center justify-center">
//                   <i className="fas fa-sign-in-alt mr-2"></i>
//                   Se connecter
//                 </div>
//               </button>

//               {/* Error Message */}
//               {message && (
//                 <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 animate-pulse">
//                   <div className="flex items-center">
//                     <i className="fas fa-exclamation-triangle text-red-400 mr-2"></i>
//                     <p className="text-red-400 text-sm">{message}</p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Divider */}
//             <div className="mt-6">
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-600"></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Login;
