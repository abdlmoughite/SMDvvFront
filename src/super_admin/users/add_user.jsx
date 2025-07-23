import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ajouter_users, get_roles } from "../../redux/thunk";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Ajouter_user() {
  const dispatch = useDispatch();
  const email = useSelector((state) => state.email);
  const password = useSelector((state) => state.password);
  const Confirmer_password = useSelector((state) => state.Confirmer_password);
  const name = useSelector((state) => state.name);
  const role = useSelector((state) => state.role);
  const list_role = useSelector((state) => state.list_role);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    Confirmer_password: "",
    id_role: "",
  });

  useEffect(() => {
    dispatch(get_roles());
  }, []);

  const getValue = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const add_users = () => {
    if (user) {
      dispatch(ajouter_users(user));
      if (email === "" && password === "" && role === "" && name === "" && Confirmer_password === "") {
        setUser({
          name: "",
          email: "",
          password: "",
          Confirmer_password: "",
          id_role: "",
        });
        toast.success("Utilisateur ajouté avec succès!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark", // Match the dark theme
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center py-8 px-4">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 border border-gray-600">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Ajouter un nouveau utilisateur
        </h1>
        <form action="">
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Nom</label>
            <input
              type="text"
              value={user.name}
              name="name"
              className={`w-full px-4 py-2 bg-gray-700 border ${
                name !== "" ? "border-red-500" : "border-gray-600"
              } rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              onChange={getValue}
            />
            {name !== "" && (
              <p className="text-sm text-red-500 bg-red-100 border border-red-400 rounded-md p-2 mt-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.517 11.6A1.5 1.5 0 0117.517 17H2.483a1.5 1.5 0 01-1.257-2.301l6.517-11.6zM10 13a1 1 0 100-2 1 1 0 000 2zm.75-3.75a.75.75 0 10-1.5 0v1.5a.75.75 0 101.5 0v-1.5z"
                    clipRule="evenodd"
                  />
                </svg>
                {name}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Role</label>
            <select
              name="id_role"
              value={user.id_role}
              onChange={getValue} // Changed from onClick to onChange for proper event handling
              className={`w-full px-4 py-2 bg-gray-700 border ${
                role !== "" ? "border-red-500" : "border-gray-600"
              } rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="">Choisir un role</option>
              {list_role.length !== 0
                ? list_role.map((i) => (
                    <option key={i.id_role} value={i.id_role}>
                      {i.nom_role}
                    </option>
                  ))
                : null}
            </select>
            {role !== "" && (
              <p className="text-sm text-red-500 bg-red-100 border border-red-400 rounded-md p-2 mt-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.517 11.6A1.5 1.5 0 0117.517 17H2.483a1.5 1.5 0 01-1.257-2.301l6.517-11.6zM10 13a1 1 0 100-2 1 1 0 000 2zm.75-3.75a.75.75 0 10-1.5 0v1.5a.75.75 0 101.5 0v-1.5z"
                    clipRule="evenodd"
                  />
                </svg>
                {role}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={user.email}
              name="email"
              className={`w-full px-4 py-2 bg-gray-700 border ${
                email !== "" ? "border-red-500" : "border-gray-600"
              } rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              onChange={getValue}
            />
            {email !== "" && (
              <p className="text-sm text-red-500 bg-red-100 border border-red-400 rounded-md p-2 mt-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.517 11.6A1.5 1.5 0 0117.517 17H2.483a1.5 1.5 0 01-1.257-2.301l6.517-11.6zM10 13a1 1 0 100-2 1 1 0 000 2zm.75-3.75a.75.75 0 10-1.5 0v1.5a.75.75 0 101.5 0v-1.5z"
                    clipRule="evenodd"
                  />
                </svg>
                {email}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Mot de passe</label>
            <input
              value={user.password}
              type="password"
              name="password"
              className={`w-full px-4 py-2 bg-gray-700 border ${
                password !== "" ? "border-red-500" : "border-gray-600"
              } rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              onChange={getValue}
            />
            {password !== "" && (
              <p className="text-sm text-red-500 bg-red-100 border border-red-400 rounded-md p-2 mt-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.517 11.6A1.5 1.5 0 0117.517 17H2.483a1.5 1.5 0 01-1.257-2.301l6.517-11.6zM10 13a1 1 0 100-2 1 1 0 000 2zm.75-3.75a.75.75 0 10-1.5 0v1.5a.75.75 0 101.5 0v-1.5z"
                    clipRule="evenodd"
                  />
                </svg>
                {password}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Confirmer mot de passe</label>
            <input
              type="password"
              value={user.Confirmer_password}
              name="Confirmer_password"
              className={`w-full px-4 py-2 bg-gray-700 border ${
                Confirmer_password !== "" ? "border-red-500" : "border-gray-600"
              } rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              onChange={getValue}
            />
            {Confirmer_password !== "" && (
              <p className="text-sm text-red-500 bg-red-100 border border-red-400 rounded-md p-2 mt-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.517 11.6A1.5 1.5 0 0117.517 17H2.483a1.5 1.5 0 01-1.257-2.301l6.517-11.6zM10 13a1 1 0 100-2 1 1 0 000 2zm.75-3.75a.75.75 0 10-1.5 0v1.5a.75.75 0 101.5 0v-1.5z"
                    clipRule="evenodd"
                  />
                </svg>
                {Confirmer_password}
              </p>
            )}
          </div>
          <button
            onClick={() => add_users()}
            type="button"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
}

export default Ajouter_user;