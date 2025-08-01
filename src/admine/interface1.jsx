import { useState, useEffect } from "react";
import { compareAsc, format, set } from "date-fns";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaCity,
    FaHome,
    FaDollarSign,
    FaTrashAlt,
    FaEdit,
} from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import * as XLSX from "xlsx";
import Select from "react-select";
import {
    get_produit,
    delete_commande,
    add_commandes,
    set_qnt_produit,
    engr_commande,
    get_commandes,
    update_commande,
} from "../redux/thunk.jsx";
import { useDispatch, useSelector } from "react-redux";
import Claster_commande from "./commande_claster";
import "../App.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Add_commande() {
    const [old_qnt, setOld_qnt] = useState(0);
    const [prix_livraison, setprix_livraison] = useState(0);
    const [errors, setErrors] = useState({});
    const loading = useSelector((state) => state.loading);
    const [button, setButton] = useState(false); // pour le chnagement de button ajouter et update
    const user = useSelector((state) => state.user);
    const id_user = user.id;
    const [list_villes, setList_villes] = useState([]);
    const [commande, setCommande] = useState({
        id_commande: Date.now().toString(),
        nom_client: "",
        numero_client: "",
        adresse_client: "",
        ville: "",
        ville_id: "",
        prix_livraison: "",
        quntite: 1,
        prix: "",
        commantaire: "",
        produit_id: "",
        nom_produit: "",
        ville_commande: "",
        id_user: user.id,
        date_commande: "",
    });
     const list_produit = useSelector((state) => state.list_produit);
    const [produitTrouve, setProduitTrouve] = useState([]);

useEffect(() => {

        setProduitTrouve(list_produit);
}, [list_produit]);
    const dispatch = useDispatch();
    const commandes = useSelector((state) => state.commandes);
    const [afficher_commandes_excel,setAfficher_commandes_excel]=useState(false)
    const [list_commande_excel,setList_commande_excel]=useState([])

    useEffect(() => {
        dispatch(get_produit());
        dispatch(get_commandes());
        axios.get("http://127.0.0.1:8000/api/villes").then((res) => {
            if (res.status == 200) {
                res.data.map((i) => {
                    const newVille = {
                        value: i.NAME,
                        label: i.NAME,
                        id: i.id,
                        REF: i.REF,
                        NAME: i.NAME,
                        DELIVERED: i.DELIVERED,
                        RETURNED: i.RETURNED,
                        REFUSED: i.REFUSED,
                    };
                    setList_villes((prevVilles) => {
                        if (
                            !prevVilles.some((ville) => ville.value === i.NAME)
                        ) {
                            return [...prevVilles, newVille];
                        }
                        return prevVilles;
                    });
                });
            }
        });
    }, []);

    const get_value = (e) => {
        setCommande({
            ...commande,
            [e.target.name]: e.target.value,
            date_commande: format(new Date(), "yyyy-MM-dd"),
        });
    };

    const get_valueV = async (option) => {
        const value = option.value;
        const passport = list_villes.some((i) => value === i.label);
        setprix_livraison(option.DELIVERED);
        if (passport) {
            setCommande({
                ...commande,
                ville: value,
                prix_livraison: option.DELIVERED,
                ville_id: option.id,
                ville_commande: value,
                date_commande: format(new Date(), "yyyy-MM-dd"),
            });
        } else {
            setCommande({
                ...commande,
                ville: value,
                prix_livraison: "",
                ville_commande: value,
            });
            console.log("Aucune correspondance trouvée pour la ville saisie.");
        }
    };

    const get_value_produit = (e) => {
        if ([e.target.name == "id_produit"]) {
            list_produit.map((i) => {
                if (i.id_produit == e.target.value) {
                    setCommande({
                        ...commande,
                        nom_produit: i.nom,
                        produit_id: e.target.value,
                        date_commande: format(new Date(), "yyyy-MM-dd"),
                    });
                }
            });
        }
    };

    const add_commande = () => {
        const newErrors = {};
        if (!commande.nom_client)
            newErrors.nom_client = "Le nom du client est requis";
        if (!commande.numero_client)
            newErrors.numero_client = "Le numéro du client est requis";
        if (!commande.adresse_client)
            newErrors.adresse_client = "L'adresse du client est requise";
        if (!commande.ville) newErrors.ville = "La ville est requise";
        if (!commande.prix) newErrors.prix = "Le prix est requis";
        if (!commande.nom_produit)
            newErrors.nom_produit = "Le produit est requis";
        if (!commande.commantaire)
            newErrors.commantaire = "Le commentaire est requis";

        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            const validNumber = /^(06|07|05)\d{8}$/;
            if (!validNumber.test(commande.numero_client))
                newErrors.numero_client = "invalide phone number";
            if (Object.keys(newErrors).length === 0) {
                setCommande({
                    ...commande,
                    ["date_commande"]: format(new Date(), "yyyy-MM-dd"),
                });
                const objQnt = {
                    id_produit: commande.produit_id,
                    action: "ajouter",
                    new_qnt: commande.quntite,
                    old_qnt: 0,
                };
                dispatch(add_commandes(commande));
                dispatch(set_qnt_produit(objQnt));
                setCommande({
                    id_commande: Date.now().toString(),
                    nom_client: "",
                    numero_client: "",
                    adresse_client: "",
                    ville: "",
                    ville_id: "",
                    prix_livraison: "",
                    quntite: 1,
                    prix: "",
                    commantaire: "",
                    produit_id: "",
                    nom_produit: "",
                    ville_commande: "",
                    id_user: user.id,
                    date_commande: format(new Date(), "yyyy-MM-dd"),
                });
                setErrors({});
            }
        }
    };

    const add_commanded = () => {
        if (
            commande.adresse_client != "" &&
            commande.nom_client != "" &&
            commande.commantaire &&
            commande.nom_produit != "" &&
            commande.id_produit != "" &&
            commande.numero_client != "" &&
            commande.prix != "" &&
            commande.quntite != "" &&
            commande.ville != ""
        ) {
            if (commande.prix_livraison == "") {
                // Do nothing or handle as needed
            } else {
                const validNumber = /^0\d{9}$/;
                if (!validNumber.test(commande.numero_client)) {
                    alert(
                        "Le numéro de client doit être de 10 chiffres et commencer par 0"
                    );
                    return;
                }

                dispatch(add_commandes(commande));
                dispatch(set_qnt_produit(commande.produit_id));
                setCommande({
                    id_commande: Date.now().toString(),
                    nom_client: "",
                    numero_client: "",
                    adresse_client: "",
                    ville: "",
                    ville_id: "",
                    prix_livraison: "",
                    quntite: 1,
                    prix: "",
                    commantaire: "",
                    produit_id: "",
                    nom_produit: "",
                    ville_commande: "",
                    id_user: user.id,
                    date_commande: "",
                });
            }
        } else {
            alert("chi haja khawya");
        }
    };

    const supprimer_commande = (cmd) => {
        const objQnt = {
            id_produit: cmd.produit_id,
            action: "delete",
            new_qnt: 0,
            old_qnt: cmd.quntite,
        };
        dispatch(set_qnt_produit(objQnt));
        dispatch(delete_commande(cmd.id));
    };

    const edit_commande = (cmd) => {
        setOld_qnt(cmd.quntite);
        setCommande({
            id: cmd.id,
            id_commande: cmd.id_commande,
            nom_client: cmd.nom_client,
            numero_client: cmd.numero_client,
            adresse_client: cmd.adresse_client,
            ville: cmd.ville,
            prix_livraison: cmd.prix_livraison,
            quntite: cmd.quntite,
            prix: cmd.prix,
            commantaire: cmd.commantaire,
            produit_id: cmd.produit_id,
            nom_produit: cmd.nom_produit,
            id_user: user.id,
            date_commande: format(new Date(), "yyyy-MM-dd"),
        });
        setButton(true);
    };

    const upDate_commande = () => {
        const objQnt = {
            id_produit: commande.produit_id,
            action: "edit",
            new_qnt: commande.quntite,
            old_qnt: old_qnt,
        };
        dispatch(set_qnt_produit(objQnt));
        dispatch(update_commande(commande));

        setCommande({
            id_commande: Date.now().toString(),
            nom_client: "",
            numero_client: "",
            adresse_client: "",
            ville: "",
            ville_id: "",
            prix_livraison: "",
            quntite: 1,
            prix: "",
            commantaire: "",
            produit_id: "",
            nom_produit: "",
            ville_commande: "",
            id_user: user.id,
            date_commande: "",
        });
        setOld_qnt(0);
        setButton(false);
    };

    const export_xl_data = () => {
        const data_exp = commandes.map((i) => ({
            "CODE SUIVI": i.id_commande,
            DESTINATAIRE: i.nom_client,
            TELEPHONE: i.numero_client,
            ADRESSE: i.adresse_client,
            PRIX: i.prix,
            VILLE: i.ville,
            COMMENTAIRE: i.commantaire,
            QUARTIER: "",
            NATURE: "",
        }));

        const worksheet = XLSX.utils.json_to_sheet(data_exp);
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, worksheet, "CustomizedSheet");
        XLSX.writeFile(newWorkbook, "customized_file.xlsx");
    };

    const enregistrer_commande = () => {
        dispatch(engr_commande(commandes));
    };

    const enregistrer_commande_ozon = async () => {
        for (const i of commandes) {
            try {
                const formData = new FormData();
                formData.append("tracking-number", i.id_commande);
                formData.append("parcel-receiver", i.nom_client);
                formData.append("parcel-phone", i.numero_client);
                formData.append("parcel-city", i.ville_id);
                formData.append("parcel-address", i.adresse_client);
                formData.append("parcel-note", i.commantaire);
                formData.append("parcel-price", i.prix);
                formData.append("parcel-nature", i.nom_produit);
                formData.append("parcel-stock", 0);
                formData.append(
                    "products",
                    JSON.stringify([{ ref: "", qnty: 2 }])
                );
                const res = await axios.post(
                    "https://api.ozonexpress.ma/customers/24539/002b25-110795-e1cdcf-be7ffc-660fc2/add-parcel",
                    formData
                );
                if (res.data["ADD-PARCEL"]?.["RESULT"] == "SUCCESS") {
                    console.log(111);
                    dispatch(engr_commande([i]));
                    toast.success(
                        "✅ Commande envoyée avec succès ! " + i.id_commande
                    );
                } else {
                    toast.error(
                        "❌ Échec de l'envoi de la commande ! " + i.id_commande
                    );
                    console.error(
                        "Erreur lors de l'envoi de la commande :",
                        res.data
                    );
                }
            } catch (error) {
                console.error("Erreur lors de l'envoi de la commande :", error);
            }
        }
    };

    const [excelData, setExcelData] = useState(null);
    const handleFileUpload = (e) => {
        const file = e.target.files[0];

        if (
            file &&
            file.type ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
            const reader = new FileReader();

            reader.onload = (event) => {
                const arrayBuffer = event.target.result;
                const workbook = XLSX.read(arrayBuffer, { type: "array" });

                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                const data = XLSX.utils.sheet_to_json(sheet, {
                    range: "A1:I100",
                });

                setExcelData(data);
            };

            reader.readAsArrayBuffer(file);
        } else {
            alert("Veuillez télécharger un fichier Excel valide.");
        }
    };

    const findville = (villeName) => {
        const foundVille = list_villes.find(
            (ville) => ville.value === villeName
        );
        return foundVille;
    };
    const find_produit = (cmnt) => {
    const id_produit = cmnt.split(",")[0];

    if (Array.isArray(produitTrouve) && produitTrouve.length > 0) {
        return produitTrouve.find(
            (produit) => produit.id_produit == id_produit
        );
    }

    return null; // Aucun produit trouvé ou tableau vide
};


    const ajouterExcelData_json = () => {
        setAfficher_commandes_excel(true)
        if (excelData && Array.isArray(excelData)) {
            excelData.forEach((row) => {
                if (
                    Object.values(row).every(
                        (value) => value === "" || value === null
                    )
                ) {
                    return;
                }

                const firstNineColumns = Object.values(row).slice(0, 9);
                if (
                    firstNineColumns.every(
                        (value) => value === "" || value === null
                    )
                ) {
                    return;
                }

                let num = row["TELEPHONE"] || "";
                if (num && num[0] !== "0") {
                    num = "0" + num;
                }

                if (num.length < 10) {
                    num = num.padStart(10, "0");
                }

                const newCommande = {
                    id_commande: Date.now().toString(),
                    nom_client: row["DESTINATAIRE"] || "",
                    numero_client: num,
                    adresse_client: row["ADRESSE"] || "", // Adresse du client
                    ville: findville(row["VILLE"]) ? findville(row["VILLE"]).label : null,
                    ville_id: findville(row["VILLE"])
                        ? findville(row["VILLE"]).id
                        : null,
                    prix_livraison: findville(row["VILLE"])
                        ? findville(row["VILLE"]).DELIVERED
                        : 0,
                    quntite: 1,
                    prix: row["PRIX"] || 0,
                    commantaire: row["COMMENTAIRE"] || "", // Commentaire
                    produit_id: find_produit(JSON.stringify(row["COMMENTAIRE"])) ? find_produit(JSON.stringify(row["COMMENTAIRE"])).id : null, // Identifiant du produit (vide pour l'instant)
                    nom_produit: find_produit(JSON.stringify(row["COMMENTAIRE"])) ? find_produit(JSON.stringify(row["COMMENTAIRE"])).nom : null, // Nature du produit
                    id_user: user.id, // Identifiant de l'utilisateur
                    date_commande: format(new Date(), "yyyy-MM-dd"),
                };
                setList_commande_excel(prev => [...prev, newCommande]);
            });

            setExcelData(null);
            toast.success("✅ Données ajoutées avec succès !");
        } else {
            toast.error("❌ Aucune donnée à ajouter !");
        }
    };

    const modifieVille = (idcommande, newville) => {
        const commandeRecherch = list_commande_excel.find(
            (item) => item.id_commande === idcommande
        );
        commandeRecherch.ville = newville;
        commandeRecherch.ville_id = findville(newville).id;
        commandeRecherch.prix_livraison = findville(newville).DELIVERED;
        setList_commande_excel(list_commande_excel.map((i)=>{
            if(i.id_commande==idcommande){
                return commandeRecherch
            }
            return i
        }))

    };
    const modifieProduit = (idcommande, newproduit_id) => {
        const commandeRecherch = list_commande_excel.find(
            (item) => item.id_commande == idcommande
        );
        const new_produit=list_produit.find((i)=>i.id_produit==newproduit_id)
        commandeRecherch.produit_id = new_produit.id_produit;
        commandeRecherch.nom_produit = new_produit.nom;
        setList_commande_excel(list_commande_excel.map((i)=>{
            if(i.id_commande==idcommande){
                return commandeRecherch
            }
            return i
        }))
    };

    console.log("new ville",list_commande_excel)
    return (
        <div className="p-4 bg-gray-900 min-h-screen text-white">
            {loading === true || user === undefined ? (
                <div className="justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
                </div>
            ) : (
                <div className="w-full m-4">
                    <div className="w-full p-6 bg-gray-800 shadow-lg rounded-lg border border-gray-700">
                        <h1 className="text-xl font-semibold text-blue-400 mb-6">
                            Formulaire de Commande
                        </h1>
                        <form className="space-y-4">
                            <div className="flex gap-3 justify-center w-full">
                                <div className="mr-2">
                                    <label className="block text-gray-300 text-sm font-medium mb-1">
                                        Nom du client
                                    </label>
                                    <input
                                        type="text"
                                        value={commande.nom_client}
                                        onChange={get_value}
                                        name="nom_client"
                                        className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    />
                                    {errors.nom_client && (
                                        <p className="text-red-400 text-xs mt-1">
                                            {errors.nom_client}
                                        </p>
                                    )}
                                </div>

                                <div className="mr-2">
                                    <label className="block text-gray-300 text-sm font-medium mb-1">
                                        Numéro du client
                                    </label>
                                    <input
                                        type="text"
                                        value={commande.numero_client}
                                        onChange={get_value}
                                        name="numero_client"
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    />
                                    {errors.numero_client && (
                                        <p className="text-red-400 text-xs mt-1">
                                            {errors.numero_client}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-1">
                                        Adresse du client
                                    </label>
                                    <textarea
                                        value={commande.adresse_client}
                                        onChange={get_value}
                                        name="adresse_client"
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    />
                                    {errors.adresse_client && (
                                        <p className="text-red-400 text-xs mt-1">
                                            {errors.adresse_client}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-1">
                                        Produit
                                    </label>
                                    <select
                                        onChange={get_value_produit}
                                        name="produit_id"
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    >
                                        <option value="">
                                            Choisir un produit
                                        </option>
                                        {list_produit.length > 0 ? (
                                            list_produit.map((i) => (
                                                <option
                                                    key={i.id_produit}
                                                    value={i.id_produit}
                                                    disabled={i.quantite === 0}
                                                >
                                                    {`${i.nom} - Quantité: ${i.quantite}`}
                                                </option>
                                            ))
                                        ) : (
                                            <option>
                                                Aucun produit disponible
                                            </option>
                                        )}
                                    </select>
                                    {errors.nom_produit && (
                                        <p className="text-red-400 text-xs mt-1">
                                            {errors.nom_produit}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-1">
                                        Ville
                                    </label>
                                    <Select
                                        options={list_villes}
                                        placeholder="Choisir une ville"
                                        onChange={get_valueV}
                                        className="w-full text-sm bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-400"
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                backgroundColor: "#4B5563",
                                                borderColor: "#4B5563",
                                                color: "#FFFFFF",
                                                "&:hover": {
                                                    borderColor: "#93C5FD",
                                                },
                                            }),
                                            menu: (base) => ({
                                                ...base,
                                                backgroundColor: "#4B5563",
                                                color: "#FFFFFF",
                                            }),
                                            option: (base, state) => ({
                                                ...base,
                                                backgroundColor: state.isFocused
                                                    ? "#93C5FD"
                                                    : "#4B5563",
                                                color: "#FFFFFF",
                                            }),
                                            singleValue: (base) => ({
                                                ...base,
                                                color: "#FFFFFF",
                                            }),
                                            placeholder: (base) => ({
                                                ...base,
                                                color: "#D1D5DB",
                                            }),
                                        }}
                                    />
                                    {errors.ville && (
                                        <p className="text-red-400 text-xs mt-1">
                                            {errors.ville}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <lable className="block text-gray-300 text-sm font-medium mb-1">
                                        prix livraison
                                    </lable>
                                    <input
                                        type="number"
                                        name="prix_livraison"
                                        className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                        onChange={get_value}
                                        placeholder="prix livraison"
                                        value={commande.prix_livraison}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-1">
                                    Prix
                                </label>
                                <input
                                    type="number"
                                    value={commande.prix}
                                    onChange={get_value}
                                    name="prix"
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                />
                                {errors.prix && (
                                    <p className="text-red-400 text-xs mt-1">
                                        {errors.prix}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-1">
                                        Commentaire
                                    </label>
                                    <input
                                        type="text"
                                        value={commande.commantaire}
                                        onChange={get_value}
                                        name="commantaire"
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-1">
                                        Quantité
                                    </label>
                                    <input
                                        type="number"
                                        value={commande.quntite}
                                        onChange={get_value}
                                        name="quntite"
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={add_commande}
                                    className="w-full py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow focus:ring-2 focus:ring-blue-400"
                                >
                                    Ajouter
                                </button>
                                {button && (
                                    <button
                                        type="button"
                                        onClick={upDate_commande}
                                        className="w-full py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg shadow focus:ring-2 focus:ring-green-400"
                                    >
                                        Mettre à jour
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                    {/* Commandes Section (Right Side) */}
                    <div className="w-full p-6 bg-gray-800 shadow-lg rounded-lg border border-gray-700">
                        <ToastContainer
                            position="top-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            closeOnClick
                            pauseOnHover
                            draggable
                            pauseOnFocusLoss
                            toastClassName={() =>
                                "bg-gray-800 text-white rounded-lg shadow-lg p-4 flex items-center"
                            }
                            bodyClassName={() => "text-sm font-medium"}
                        />
                        <div className="mb-4">
                            <div className="flex justify-between items-center bg-gray-700 p-4 rounded-lg shadow-sm">
                                <h3 className="text-lg font-medium text-blue-400">
                                    Nombre de commandes:{" "}
                                    <span className="font-bold">
                                        {commandes.length}
                                    </span>
                                </h3>
                                <div className="text-sm text-gray-400">
                                    Affichage des commandes du plus récent au
                                    plus ancien
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-600 bg-gray-800 rounded-lg shadow-md">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider"
                                        >
                                            ID
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider"
                                        >
                                            Client
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider"
                                        >
                                            Téléphone
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider"
                                        >
                                            Ville
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider"
                                        >
                                            Prix
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider"
                                        >
                                            Produit
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider"
                                        >
                                            Adresse
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider"
                                        >
                                            Commentaire
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-600">
                                    {[...commandes]
                                        .reverse()
                                        .map((commande, index) => (
                                            <tr
                                                key={commande.id_commande}
                                                className={
                                                    index % 2 === 0
                                                        ? "bg-gray-700"
                                                        : "bg-gray-800"
                                                }
                                            >
                                                <td
                                                    className="px-6
                                            py-4 whitespace-nowrap text-sm text-gray-300"
                                                >
                                                    {commande.id_commande}
                                                </td>
                                                <td
                                                    className={`px-6 ${
                                                        commande.nom_client ==
                                                            "" ||
                                                        commande.nom_client ==
                                                            null
                                                            ? "bg-red-500"
                                                            : ""
                                                    } py-4 whitespace-nowrap text-sm text-gray-300`}
                                                >
                                                    {commande.nom_client}
                                                </td>
                                                <td
                                                    className={`px-6 ${
                                                        commande.numero_client ==
                                                            "" ||
                                                        commande.numero_client ==
                                                            null
                                                            ? "bg-red-500"
                                                            : ""
                                                    } py-4 whitespace-nowrap text-sm text-gray-300`}
                                                >
                                                    {commande.numero_client}
                                                </td>
                                                <td
                                                    className={`px-6 ${
                                                        commande.ville == "" ||
                                                        commande.ville == null
                                                            ? "bg-red-500"
                                                            : ""
                                                    } py-4 whitespace-nowrap text-sm text-gray-300`}
                                                >
                                                    {commande.ville == "?" ? (
                                                        <Select
                                                            options={
                                                                list_villes
                                                            }
                                                            placeholder="Choisir une ville"
                                                            onChange={(e) =>
                                                                modifieVille(
                                                                    commande.id_commande,
                                                                    e.value
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <Select
                                                            onChange={(e) =>
                                                                modifieVille(
                                                                    commande.id_commande,
                                                                    e.value
                                                                )
                                                            }
                                                            name="ville"
                                                            placeholder="Choisir une ville"
                                                            className="bg-green-400 text-slate-950"
                                                            options={
                                                                list_villes
                                                            }
                                                            value={list_villes.find(
                                                                (ville) =>
                                                                    ville.value ===
                                                                    commande.ville
                                                            )}
                                                        />
                                                    )}
                                                </td>
                                                <td
                                                    className={`px-6 ${
                                                        commande.nom_client ==
                                                            "" ||
                                                        commande.nom_client ==
                                                            null
                                                            ? "bg-red-500"
                                                            : ""
                                                    } py-4 whitespace-nowrap text-sm text-gray-300`}
                                                >
                                                    {commande.prix} DH
                                                </td>
                                                <td
                                                    className={`px-6 ${
                                                        commande.nom_client ==
                                                            "" ||
                                                        commande.nom_client ==
                                                            null
                                                            ? "bg-red-500"
                                                            : ""
                                                    } py-4 whitespace-nowrap text-sm text-gray-300`}
                                                >
                                                    {commande.nom_produit ==
                                                    null ? (
                                                        <select
                                                            name="produit_id"

                                                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                                        >
                                                            <option value="">
                                                                Choisir un
                                                                produit
                                                            </option>
                                                            {list_produit.length >
                                                            0 ? (
                                                                list_produit.map(
                                                                    (i) => (
                                                                        <option
                                                                            key={
                                                                                i.id_produit
                                                                            }
                                                                            value={
                                                                                i.id_produit
                                                                            }
                                                                            disabled={
                                                                                i.quantite ===
                                                                                0
                                                                            }
                                                                        >
                                                                            {`${i.nom} - Quantité: ${i.quantite}`}
                                                                        </option>
                                                                    )
                                                                )
                                                            ) : (
                                                                <option>
                                                                    Aucun
                                                                    produit
                                                                    disponible
                                                                </option>
                                                            )}
                                                        </select>
                                                    ) : (
                                                        <select
                                                            name="produit_id"
                                                            value={
                                                                commande.produit_id
                                                            }

                                                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                                        >
                                                            <option value="">
                                                                Choisir un
                                                                produit
                                                            </option>
                                                            {list_produit.length >
                                                            0 ? (
                                                                list_produit.map(
                                                                    (i) => (
                                                                        <option
                                                                            key={
                                                                                i.id_produit
                                                                            }
                                                                            value={
                                                                                i.id_produit
                                                                            }
                                                                            disabled={
                                                                                i.quantite ===
                                                                                0
                                                                            }
                                                                        >
                                                                            {`${i.nom} - Quantité: ${i.quantite}`}
                                                                        </option>
                                                                    )
                                                                )
                                                            ) : (
                                                                <option>
                                                                    Aucun
                                                                    produit
                                                                    disponible
                                                                </option>
                                                            )}
                                                        </select>
                                                    )}
                                                </td>
                                                <td
                                                    className={`px-6 ${
                                                        commande.adresse_client ==
                                                            "" ||
                                                        commande.adresse_client ==
                                                            null
                                                            ? "bg-red-500"
                                                            : ""
                                                    } py-4 whitespace-nowrap text-sm text-gray-300`}
                                                >
                                                    {commande.adresse_client}
                                                </td>
                                                <td
                                                    className={`px-6 ${
                                                        commande.nom_client ==
                                                            "" ||
                                                        commande.nom_client ==
                                                            null
                                                            ? "bg-red-500"
                                                            : ""
                                                    } py-4 whitespace-nowrap text-sm text-gray-300`}
                                                >
                                                    {commande.commantaire}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() =>
                                                            supprimer_commande(
                                                                commande
                                                            )
                                                        }
                                                        className="text-red-400 hover:text-red-600"
                                                        title="Supprimer"
                                                    >
                                                        <FaTrashAlt />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            edit_commande(
                                                                commande
                                                            )
                                                        }
                                                        className="ml-2 text-blue-400 hover:text-blue-600"
                                                        title="Modifier"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Buttons */}
                        <div className="mt-4 flex space-x-4">
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button onClick={ajouterExcelData_json}>
                                ajouter
                            </button>

                            <button
                                onClick={export_xl_data}
                                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                Exporter
                            </button>
                            <button
                                onClick={enregistrer_commande}
                                className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                Enregistrer
                            </button>
                            <button
                                onClick={enregistrer_commande_ozon}
                                className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            >
                                Ozon
                            </button>
                        </div>
                    </div>
                    {afficher_commandes_excel && (
    <div className="mt-6 p-6 bg-gray-800 shadow-lg rounded-lg border border-gray-700">
        <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-blue-400">
                Commandes importées depuis Excel
            </h2>
            <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                {list_commande_excel.length} commandes
            </span>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-blue-400 uppercase bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3">ID</th>
                        <th scope="col" className="px-6 py-3">Client</th>
                        <th scope="col" className="px-6 py-3">Téléphone</th>
                        <th scope="col" className="px-6 py-3">Ville</th>
                        <th scope="col" className="px-6 py-3">Prix</th>
                        <th scope="col" className="px-6 py-3">Produit</th>
                        <th scope="col" className="px-6 py-3">Adresse</th>
                        <th scope="col" className="px-6 py-3">Commentaire</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {list_commande_excel.map((commande, index) => (
                        <tr
                            key={index}
                            className={`border-b ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'} hover:bg-gray-600`}
                        >
                            <td className="px-6 py-4">{commande.id_commande || '-'}</td>
                            <td className={`px-6 py-4 ${!commande.nom_client ? 'bg-red-900' : ''}`}>
                                <input className="text-color-black" type="text" value={commande.nom_client || ''} />
                            </td>
                            <td className={`px-6 py-4 ${!commande.numero_client ? 'bg-red-900' : ''}`}>
                                <input className="text-color-black" type="text" value={commande.numero_client || ''} />

                            </td>
                            <td className={`px-6 py-4 ${!commande.ville ? 'bg-red-900' : ''}`}>
                                {commande.ville === null ? (
                                    <Select
                                        options={list_villes}
                                        placeholder="Choisir une ville"
                                        onChange={(e) => modifieVille(commande.id_commande, e.value)}
                                        className="basic-single"
                                        classNamePrefix="select"
                                    />
                                ) : (
                                    <Select
                                        options={list_villes}
                                        value={list_villes.find(ville => ville.value === commande.ville)}
                                        onChange={(e) => modifieVille(commande.id_commande, e.value)}
                                        className="basic-single"
                                        classNamePrefix="select"
                                    />
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <input className="text-color-black" type="text" value={commande.prix || 0} />
                            </td>
                            <td className="px-6 py-4">
                                <select
                                        onChange={(e) => modifieProduit(commande.id_commande, e.target.value)}
                                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                                    >
                                        <option value={commande.id_commande}>{commande.nom_produit}</option>
                                        {list_produit.map(produit => (
                                            <option key={produit.id_produit} value={produit.id_produit}>
                                                {produit.nom}
                                            </option>
                                        ))}
                                    </select>
                            </td>
                            <td className={`px-6 py-4 ${!commande.adresse_client ? 'bg-red-900' : ''}`}>
                                <input className="text-color-black" type="text" value={commande.adresse_client || '-'} />

                            </td>
                            <td className="px-6 py-4">
                            <input className="text-color-black" type="text" value={commande.commantaire || '-'} />
                            </td>
                            <td className="px-6 py-4 flex space-x-2">
                                <button
                                    onClick={() => supprimer_commande(commande)}
                                    className="text-red-400 hover:text-red-600"
                                    title="Supprimer"
                                >
                                    <FaTrashAlt />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Alert Box */}
        <div className="mt-4 p-4 bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-lg">
            <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <h3 className="text-yellow-400 font-medium">Vérification requise</h3>
            </div>

        </div>
    </div>
)}
                </div>
            )}
        </div>
    );
}

export default Add_commande;
