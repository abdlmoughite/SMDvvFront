import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DateRange } from "react-date-range";
import { addDays, subDays } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCalendar } from "react-icons/fa";
import { SearchIcon } from "@heroicons/react/solid";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { get_cmd_calculs, get_depences } from "../redux/thunk";

function Accueil() {
  const dispatch = useDispatch();
  const list_cmd_calcul = useSelector((state) => state.list_cmd_calcul);

  console.log(list_cmd_calcul)
  useEffect(() => {
    dispatch(get_cmd_calculs());
  }, []);
  const list_depence = useSelector((state) => state.list_depence);
  const loading = useSelector((state) => state.loading);
  const user = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(get_depences());
  }, []);
  const [nb_commandes, setNb_commandes] = useState(0);
  const [nb_commandes_livrer, setNb_commandes_livrer] = useState(0);
  const [nb_commandes_en_coure, setNb_commandes_en_coure] = useState(0);
  const [nb_commandes_annuler, setNb_commandes_annuler] = useState(0);
  const [nb_commandes_refuser, setNb_commandes_refuser] = useState(0);
  const [chiffre_affaire, setchiffre_affaire] = useState(0);
  const [frais_livraison, setFrais_livraison] = useState(0);
  const [frais_depence, setFrais_depence] = useState(0);
  const [profite, setProfite] = useState(0);

  const [prevProfite, setPrevProfite] = useState(0);
  const [prevChiffreAffaire, setPrevChiffreAffaire] = useState(0);
  const [prevNbCommandes, setPrevNbCommandes] = useState(0);
  const [prevFraisLivraison, setPrevFraisLivraison] = useState(0);
  const [prevFraisDepence, setPrevFraisDepence] = useState(0);

  const calculer = () => {
    const date1 = range[0].startDate.toISOString().split("T")[0];
    const date2 = range[0].endDate.toISOString().split("T")[0];
    const new_list = list_cmd_calcul.filter(
      (i) => i.date_commande >= date1 && i.date_commande <= date2
    );
    setNb_commandes(new_list.length);

    const startDate = new Date(date1);
    const endDate = new Date(date2);
    const rangeDuration = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;

    const prevEndDate = subDays(startDate, 1);
    const prevStartDate = subDays(prevEndDate, rangeDuration - 1);
    const prevDate1 = prevStartDate.toISOString().split("T")[0];
    const prevDate2 = prevEndDate.toISOString().split("T")[0];

    const prev_list = list_cmd_calcul.filter(
      (i) => i.date_commande >= prevDate1 && i.date_commande <= prevDate2
    );
    const prev_list_depences = list_depence.filter(
      (i) => i.date_depence >= prevDate1 && i.date_depence <= prevDate2
    );

    const new_list_depences = list_depence.filter(
      (i) => i.date_depence >= date1 && i.date_depence <= date2
    );

    let livrer = 0;
    let en_coure = 0;
    let annuler = 0;
    let refuser = 0;
    let chiffre = 0;
    let frais_livraison = 0;
    let frais_produit = 0;
    let chifre_livrer = 0;
    new_list.map((i) => {
      switch (i.status) {
        case "livrer":
          livrer += 1;
          chiffre += parseInt(i.prix, 10);
          frais_livraison += parseInt(i.prix_livraison);
          frais_produit += parseInt(i.prix_produit * i.quantite);
          chifre_livrer += parseInt(i.prix, 10);
          break;
        case "annuler":
          annuler += 1;
          frais_livraison += parseInt(i.prix_retour, 10);
          chiffre += parseInt(i.prix, 10);
          break;
        case "en coure":
          en_coure += 1;
          chiffre += parseInt(i.prix, 10);
          break;
        case "refuser":
          refuser += 1;
          frais_livraison += parseInt(i.prix_retour, 10);
          chiffre += parseInt(i.prix, 10);
          break;
        default:
          break;
      }
    });

    let depences = 0;
    new_list_depences.map((i) => {
      depences += parseInt(i.montant);
    });

    let prev_livrer = 0;
    let prev_en_coure = 0;
    let prev_annuler = 0;
    let prev_refuser = 0;
    let prev_chiffre = 0;
    let prev_frais_livraison = 0;
    let prev_frais_produit = 0;
    let prev_chifre_livrer = 0;
    prev_list.map((i) => {
      switch (i.status) {
        case "livrer":
          prev_livrer += 1;
          prev_chiffre += parseInt(i.prix, 10);
          prev_frais_livraison += parseInt(i.prix_livraison);
          prev_frais_produit += parseInt(i.prix_produit * i.quantite);
          prev_chifre_livrer += parseInt(i.prix, 10);
          break;
        case "annuler":
          prev_annuler += 1;
          prev_frais_livraison += parseInt(i.prix_retour, 10);
          prev_chiffre += parseInt(i.prix, 10);
          break;
        case "en coure":
          prev_en_coure += 1;
          prev_chiffre += parseInt(i.prix, 10);
          break;
        case "refuser":
          prev_refuser += 1;
          prev_frais_livraison += parseInt(i.prix_retour, 10);
          prev_chiffre += parseInt(i.prix, 10);
          break;
        default:
          break;
      }
    });

    let prev_depences = 0;
    prev_list_depences.map((i) => {
      prev_depences += parseInt(i.montant);
    });

    const prev_nb_commandes = prev_list.length;
    const prev_chiffre_affaire = parseInt(prev_chiffre + prev_depences);
    const prev_frais_depence = parseInt(prev_depences);
    let prev_profite = 0;
    if (user.id_role == 2) {
      prev_profite = prev_chifre_livrer - prev_frais_livraison - prev_depences - prev_frais_produit;
    } else {
      prev_profite = prev_livrer * 8;
    }

    setPrevProfite(prev_profite);
    setPrevChiffreAffaire(prev_chiffre_affaire);
    setPrevNbCommandes(prev_nb_commandes);
    setPrevFraisLivraison(prev_frais_livraison);
    setPrevFraisDepence(prev_frais_depence);

    toast.info(`Frais Produit: ${frais_produit}`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });

    setNb_commandes_livrer(livrer);
    setNb_commandes_refuser(refuser);
    setNb_commandes_annuler(annuler);
    setNb_commandes_en_coure(en_coure);
    setchiffre_affaire(parseInt(chiffre + depences));
    setFrais_livraison(frais_livraison);
    setFrais_depence(parseInt(depences));
    if (user.id_role == 2) {
      setProfite(chifre_livrer - frais_livraison - depences - frais_produit);
    } else {
      setProfite(livrer * 8);
    }
  };

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (ranges) => {
    setRange([ranges.selection]);
  };

  const applyPreset = (preset) => {
    let startDate;
    let endDate = new Date();

    switch (preset) {
      case "Aujourd'hui":
        startDate = endDate;
        break;
      case "Hier":
        startDate = addDays(endDate, -1);
        endDate = startDate;
        break;
      case "7 derniers jours":
        startDate = addDays(endDate, -7);
        break;
      case "30 derniers jours":
        startDate = addDays(endDate, -30);
        break;
      case "Ce mois":
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      case "Le mois dernier":
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        break;
      default:
        return;
    }

    setRange([{ startDate, endDate, key: "selection" }]);
  };

  const maxValue = Math.max(profite, chiffre_affaire, nb_commandes, frais_livraison, frais_depence);

  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };

  const profitPercentage = calculatePercentageChange(profite, prevProfite);
  const chiffreAffairePercentage = calculatePercentageChange(chiffre_affaire, prevChiffreAffaire);
  const nbCommandesPercentage = calculatePercentageChange(nb_commandes, prevNbCommandes);
  const fraisLivraisonPercentage = calculatePercentageChange(frais_livraison, prevFraisLivraison);
  const fraisDepencePercentage = calculatePercentageChange(frais_depence, prevFraisDepence);

  // Prepare data for bar chart
  const barData = [
    { name: "Livrées", value: nb_commandes_livrer, color: "#10B981" },
    { name: "En cours", value: nb_commandes_en_coure, color: "#3B82F6" },
    { name: "Retours", value: nb_commandes_refuser + nb_commandes_annuler, color: "#EF4444" },
  ];

  // Prepare data for pie chart
  const pieData = [
    { name: "Refusées", value: nb_commandes_refuser, color: "#F59E0B", percentage: 0 },
    { name: "Annulées", value: nb_commandes_annuler, color: "#EF4444", percentage: 0 },
    { name: "En cours", value: nb_commandes_en_coure, color: "#3B82F6", percentage: 0 },
    { name: "Livrées", value: nb_commandes_livrer, color: "#10B981", percentage: 0 },
  ];

  // Calculate percentages for pie chart
  const total = pieData.reduce((sum, item) => sum + item.value, 0);
  pieData.forEach((item) => {
    item.percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
  });

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-xl">
          <p className="text-gray-300 font-medium">{label}</p>
          <p className="text-blue-400 font-semibold">{`${payload[0].value} commandes`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-xl">
          <p className="text-gray-300 font-medium">{data.name}</p>
          <p className="text-white font-semibold">{`${data.value} commandes`}</p>
          <p className="text-gray-400 text-sm">{`${data.payload.percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent > 0.05) {
      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          fontSize="12"
          fontWeight="600"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    }
    return null;
  };

  // Custom legend for pie chart
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-gray-300 text-sm font-medium">
              {entry.value} ({pieData[index]?.percentage}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="px-4 md:px-8 lg:px-16 py-8 bg-gray-900 min-h-screen text-white">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {loading === true ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          <div className="relative py-8 bg-gray-900">
            <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg shadow-md max-w-xl mx-auto cursor-pointer hover:shadow-lg transition duration-200">
              <div
                className="flex items-center space-x-2"
                onClick={() => setIsOpen(!isOpen)}
              >
                <FaCalendar className="text-blue-400 w-5 h-5" />
                <span className="text-sm font-semibold text-gray-300">
                  {range[0].startDate.toLocaleDateString()} -{" "}
                  {range[0].endDate.toLocaleDateString()}
                </span>
              </div>
              <button
                aria-label="Search for selected date range"
                className="w-16 h-10 bg-blue-500 hover:bg-blue-600 focus:outline-none flex items-center justify-center rounded-lg transition duration-300"
                onClick={() => calculer()}
              >
                <SearchIcon className="h-6 w-6 text-white" />
              </button>
            </div>

            {isOpen && (
              <div className="absolute left-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-full max-w-4xl p-6 z-50">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3 bg-gray-700 border border-gray-600 rounded-lg p-4 shadow-md">
                    <ul className="space-y-3 text-blue-400 font-medium">
                      {[
                        "Aujourd'hui",
                        "Hier",
                        "7 derniers jours",
                        "30 derniers jours",
                        "Ce mois",
                        "Le mois dernier",
                      ].map((label) => (
                        <li
                          key={label}
                          onClick={() => applyPreset(label)}
                          className="cursor-pointer hover:bg-gray-600 px-4 py-2 rounded-lg transition-all duration-200"
                        >
                          {label}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1 bg-gray-700 border border-gray-600 rounded-lg p-6 shadow-md">
                    <DateRange
                      editableDateInputs={true}
                      onChange={handleSelect}
                      moveRangeOnFirstSelection={true}
                      ranges={range}
                      rangeColors={["#3B82F6"]}
                      className="text-gray-300 w-3/4"
                    />
                    <div className="mt-4 flex justify-end">
                      <button
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition duration-300"
                        onClick={() => setIsOpen(false)}
                      >
                        Appliquer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <style>
              {`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: translateY(-10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}
            </style>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[
              { label: "Profit", value: profite, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#3B82F6" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>, percentage: `${profitPercentage >= 0 ? "+" : ""}${profitPercentage}%`, positive: profitPercentage >= 0, accee: "0" },
              { label: "Chiffre d'affaire", value: chiffre_affaire, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#3B82F6" xmlns="http://www.w3.org/2000/svg"><path d="M11 17h2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1h-3v-1h4V8h-4c-.55 0-1-.45-1-1V5h-2v1H8c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3v1H7v2h4zm-2-9h2v1h-2zm2 3h2v1h-2zm2 3h-2v1h2z"/></svg>, percentage: `${chiffreAffairePercentage >= 0 ? "+" : ""}${chiffreAffairePercentage}%`, positive: chiffreAffairePercentage >= 0, accee: "2" },
              { label: "Total Commandes", value: nb_commandes, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#3B82F6" xmlns="http://www.w3.org/2000/svg"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-1-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>, percentage: `${nbCommandesPercentage >= 0 ? "+" : ""}${nbCommandesPercentage}%`, positive: nbCommandesPercentage >= 0, accee: "0" },
              { label: "Frais de Livraison", value: frais_livraison, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#3B82F6" xmlns="http://www.w3.org/2000/svg"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>, percentage: `${fraisLivraisonPercentage >= 0 ? "+" : ""}${fraisLivraisonPercentage}%`, positive: fraisLivraisonPercentage >= 0, accee: "2" },
              { label: "Dépenses", value: frais_depence, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#3B82F6" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>, percentage: `${fraisDepencePercentage >= 0 ? "+" : ""}${fraisDepencePercentage}%`, positive: fraisDepencePercentage >= 0, accee: "0" },
            ].map((item, index) => 
              (item.accee === "0" || item.accee == user.id_role) && (
                <div
                  key={index}
                  className="relative p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg flex flex-col items-start overflow-hidden"
                >
                  <div className="absolute inset-0 border-2 rounded-lg pointer-events-none" style={{ borderColor: item.positive ? "#3B82F6" : "#EF4444", opacity: 0.3 }}></div>
                  <div className="flex items-center justify-between w-full">
                    {item.icon}
                    <span className={`text-sm ${item.positive ? "text-blue-400" : "text-red-400"}`}>{item.percentage}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <p className="text-3xl font-bold text-white">{item.value}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-400 mt-1">{item.label}</p>
                  <div className="w-full h-1 bg-gray-700 rounded-full mt-3">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: item.value > 0 ? `${(item.value / maxValue) * 100 || 0}%` : "0%" }}></div>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-200 mb-6">
              Détails des Commandes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Commandes Livrées",
                  value: nb_commandes_livrer,
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#3B82F6" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  ),
                  positive: true,
                },
                {
                  label: "Commandes en cours",
                  value: nb_commandes_en_coure,
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#3B82F6" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm-2 13l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                    </svg>
                  ),
                  positive: true,
                },
                {
                  label: "Commandes annulées",
                  value: nb_commandes_annuler,
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#EF4444" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  ),
                  positive: false,
                },
                {
                  label: "Commandes refusées",
                  value: nb_commandes_refuser,
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#EF4444" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                  ),
                  positive: false,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg flex flex-col items-start overflow-hidden"
                >
                  <div className="absolute inset-0 border-2 rounded-lg pointer-events-none" style={{ borderColor: item.positive ? "#3B82F6" : "#EF4444", opacity: 0.3 }}></div>
                  <div className="flex items-center justify-between w-full">
                    {item.icon}
                    <span className={`text-sm ${item.positive ? "text-blue-400" : "text-red-400"}`}>
                      {item.value > 0 ? (item.positive ? "+0.0%" : "-0.0%") : "0.0%"}
                    </span>
                  </div>
                  <div className="flex items-center mt-2">
                    <p className="text-3xl font-bold text-white">{item.value || 0}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-400 mt-1">{item.label}</p>
                  <div className="w-full h-1 bg-gray-700 rounded-full mt-3">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: item.value > 0 ? `${(item.value / Math.max(...[nb_commandes_livrer, nb_commandes_en_coure, nb_commandes_annuler, nb_commandes_refuser].map(v => v || 0))) * 100 || 0}%` : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <br />
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
  <h1 className="text-2xl font-semibold text-gray-200 mb-4">Graphes</h1>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {/* Statut des Commandes (Bar Chart) */}
    <div
      className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-xl shadow-2xl p-6 border-2"
      style={{ borderColor: "#3B82F6" }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Statut des Commandes</h2>
        <p className="text-gray-400">Distribution par statut</p>
      </div>
      <div style={{ width: "100%", height: "300px" }}>
        <ResponsiveContainer>
          <BarChart
            data={barData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barCategoryGap="20%"
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity={1} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 500 }}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
              stroke="#3B82F6"
              strokeWidth={2}
            >
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Répartition des Commandes (Pie Chart) */}
    <div
      className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-xl shadow-2xl p-6 border-2"
      style={{ borderColor: "#3B82F6" }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Répartition des Commandes</h2>
        <p className="text-gray-400">Pourcentage par statut</p>
      </div>
      <div style={{ width: "100%", height: "300px" }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="45%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              innerRadius={40}
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
</div>

        </div>
      )}
    </div>
  );
}

export default Accueil;