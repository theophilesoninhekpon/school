"use client";

import { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputOtp } from "primereact/inputotp"; // Import du composant OTP
import { ProgressSpinner } from "primereact/progressspinner"; // Loader pour indiquer la vérification en cours
import axios from "axios";
import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "tailwindcss/tailwind.css";
import "./register.css";

const Register = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const phoneNumber = useRef("");
  const [password, setPassword] = useState("");
  const toast = useRef<Toast>(null);
  const [showOtp, setShowOtp] = useState(false); // Affiche l'input OTP après l'enregistrement
  const [token, setToken] = useState(""); // Stocke l'OTP saisi
  const [otpExpired, setOtpExpired] = useState(false); // Pour gérer l'expiration de l'OTP
  const [timer, setTimer] = useState(60); // Compte à rebours d'expiration de l'OTP
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const [isVerifying, setIsVerifying] = useState(false); // Pour afficher le loader pendant la vérification

  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    username: "",
    phoneNumber: "",
    password: "",
  });

  useEffect(() => {
    // Gérer le timer pour l'OTP
    if (showOtp && timer > 0) {
      timerInterval.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setOtpExpired(true);
      clearInterval(timerInterval.current!);
    }

    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [showOtp, timer]);

  const validateFirstname = () => {
    if (!firstname) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        firstname: "Le prénom est requis",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, firstname: "" }));
    }
  };

  const validateLastname = () => {
    if (!lastname) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        lastname: "Le nom est requis",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, lastname: "" }));
    }
  };

  const validateUsername = () => {
    if (!username) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: "Le nom d'utilisateur est requis",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, username: "" }));
    }
  };

  const validatePhoneNumber = () => {
    const regex = /^\d{8}$/;
    if (!phoneNumber.current || !regex.test(phoneNumber.current)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "Le numéro de téléphone doit contenir 8 chiffres",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: "" }));
    }
  };

  const validatePassword = () => {
    if (!password || password.length < 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Le mot de passe doit contenir au moins 6 caractères",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }
  };

  // Demande OTP après enregistrement réussi
  const requestOtp = async () => {
    try {
      const response = await axios.post(`${apiUrl}/auth/request-code`, {
        phone_number: `+229${phoneNumber.current}`,
      });
      if (response.status === 200) {
        toast.current?.show({
          severity: "success",
          summary: "Code OTP envoyé",
          detail: "Un code OTP a été envoyé à votre numéro",
        });
        setShowOtp(true); // Afficher l'OTP input
        setTimer(60); // Réinitialiser le compte à rebours
        setOtpExpired(false); // Réinitialiser l'état d'expiration
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Échec de l'envoi du code OTP",
      });
    }
  };

  // Enregistre le nouvel utilisateur puis demande un OTP
  const handleRegister = async () => {
    const payload = {
      username: username,
      password: password,
      first_name: firstname,
      last_name: lastname,
      phone_number: `+229${phoneNumber.current}`,
    };

    try {
      const response = await axios.post(`${apiUrl}/admins/`, payload);

      if (response.status === 200) {
        // Demande automatique du code OTP après enregistrement réussi
        requestOtp();
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.current?.show({
          severity: "error",
          summary: "Erreur",
          detail: error.response.data.message || "Enregistrement échoué",
        });
      }
    }
  };

  const validateInputs = () => {
    validateFirstname();
    validateLastname();
    validateUsername();
    validatePhoneNumber();
    validatePassword();

    return (
      !errors.firstname &&
      !errors.lastname &&
      !errors.username &&
      !errors.phoneNumber &&
      !errors.password
    );
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      handleRegister();
    }
  };

  // Vérifie automatiquement l'OTP lorsque les 4 chiffres sont saisis
  useEffect(() => {
    if (token.length === 4) {
      verifyOtp();
    }
  }, [token]);

  // Vérifie le code OTP saisi
  const verifyOtp = async () => {
    setIsVerifying(true); // Affiche le loader pendant la vérification
    try {
      const response = await axios.post(`${apiUrl}/auth/verify-code`, {
        phone_number: `+229${phoneNumber.current}`,
        otp: token,
      });
      if (response.status === 200) {
        toast.current?.show({
          severity: "success",
          summary: "OTP vérifié",
          detail: "Votre numéro de téléphone a été vérifié",
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "OTP incorrect ou expiré",
      });
    } finally {
      setIsVerifying(false); // Arrête d'afficher le loader
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Toast ref={toast} />
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md">
        {showOtp ? (
          <div>
            <h1 className="text-2xl text-white font-semibold mb-4 text-center">
              Entrez votre code OTP
            </h1>
            <InputOtp
              value={token}
              onChange={(e) => setToken(e.value)}
              integerOnly
              length={4}
              className="mb-4"
            />
            {isVerifying ? (
              <div className="flex justify-center mt-4">
                <ProgressSpinner />
              </div>
            ) : otpExpired ? (
              <Button
                label="Redemander OTP"
                onClick={requestOtp}
                className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none"
              />
            ) : (
              <p className="text-gray-300 text-center mt-2">
                Le code expire dans {timer} secondes.
              </p>
            )}
          </div>
        ) : (
          <div>
            <h1 className="text-2xl text-white font-semibold mb-4 text-center">
              Inscription
            </h1>
            <div className="space-y-3">
              <div>
                <label htmlFor="firstname" className="block text-gray-300">
                  Prénom
                </label>
                <InputText
                  id="firstname"
                  value={firstname}
                  onChange={(e) => {
                    setFirstname(e.target.value);
                    validateFirstname();
                  }}
                  className={`w-full p-2 ${errors.firstname && "p-invalid"}`}
                  placeholder="Entrez votre prénom"
                />
                {errors.firstname && (
                  <small className="p-error">{errors.firstname}</small>
                )}
              </div>

              <div>
                <label htmlFor="lastname" className="block text-gray-300">
                  Nom
                </label>
                <InputText
                  id="lastname"
                  value={lastname}
                  onChange={(e) => {
                    setLastname(e.target.value);
                    validateLastname();
                  }}
                  className={`w-full p-2 ${errors.lastname && "p-invalid"}`}
                  placeholder="Entrez votre nom"
                />
                {errors.lastname && (
                  <small className="p-error">{errors.lastname}</small>
                )}
              </div>

              <div>
                <label htmlFor="username" className="block text-gray-300">
                  Nom d'utilisateur
                </label>
                <InputText
                  id="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    validateUsername();
                  }}
                  className={`w-full p-2 ${errors.username && "p-invalid"}`}
                  placeholder="Entrez votre nom d'utilisateur"
                />
                {errors.username && (
                  <small className="p-error">{errors.username}</small>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-gray-300">
                  Numéro de téléphone
                </label>
                <div className="flex">
                  <span className="flex items-center px-2 bg-gray-600 text-white rounded-l-md">
                    +229
                  </span>
                  <InputText
                    id="phone"
                    value={phoneNumber.current}
                    onChange={(e) => {
                      phoneNumber.current = e.target.value;
                      validatePhoneNumber();
                    }}
                    className={`w-full p-2 ${
                      errors.phoneNumber && "p-invalid"
                    } rounded-r-md`}
                    placeholder="Entrez 8 chiffres"
                    maxLength={8} // Limite à 8 chiffres pour garantir un format correct
                  />
                </div>
                {errors.phoneNumber && (
                  <small className="p-error">{errors.phoneNumber}</small>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-300">
                  Mot de passe
                </label>
                <Password
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword();
                  }}
                  inputClassName={`!w-full !p-2 w-full ${
                    errors.password && "p-invalid"
                  }`} // Pour styliser l'input interne
                  toggleMask
                  placeholder="Entrez un mot de passe"
                  style={{ width: "100%" }}
                  feedback={false} // Désactive la barre d'évaluation de la sécurité du mot de passe
                />
                {errors.password && (
                  <small className="p-error">{errors.password}</small>
                )}
              </div>

              <Button
                label="S'inscrire"
                onClick={handleSubmit}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
