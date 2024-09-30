"use client";

import { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";

const Register = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const toast = useRef<Toast>(null);

  const handleRegister = async () => {
    const payload = {
      firstname,
      lastname,
      phone_number: phoneNumber,
      password,
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        if (toast.current) {
          toast.current.show({
            severity: "success",
            summary: "Enregistrement réussi",
          });
        }
      } else {
        const errorData = await response.json();
        if (toast.current) {
          toast.current.show({
            severity: "error",
            summary: "Erreur",
            detail: errorData.message,
          });
        }
      }
    } catch (error) {
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Erreur",
          detail: "Enregistrement échoué",
        });
      }
    }
  };

  return (
    <div
      className="flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Toast ref={toast} />
      <Card
        title="Enregistrement"
        className="p-shadow-6"
        style={{ width: "30rem" }}
      >
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="firstname">Prénom</label>
            <InputText
              id="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="Entrez votre prénom"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="lastname">Nom</label>
            <InputText
              id="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Entrez votre nom"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="phone">Numéro de téléphone</label>
            <InputText
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Entrez votre numéro de téléphone"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez un mot de passe"
              toggleMask
              feedback={false}
              required
            />
          </div>

          <Button
            label="S'enregistrer"
            icon="pi pi-user"
            onClick={handleRegister}
            className="p-button-success"
          />
        </div>
      </Card>
    </div>
  );
};

export default Register;
