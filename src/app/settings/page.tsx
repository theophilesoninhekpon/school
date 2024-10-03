"use client"
import Layout from '@/layouts/Layout';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useState } from 'react';

export default function Parametres() {
  const [email, setEmail] = useState('');
  const [theme, setTheme] = useState('');

  const saveSettings = () => {
    console.log('Enregistrer les paramètres', { email, theme });
  };

  return (
    <Layout>
      <h1 className="text-3xl mb-4">Paramètres</h1>
      <div className="mb-4">
        <span className="p-float-label">
          <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="email">Email Administrateur</label>
        </span>
      </div>
      <div className="mb-4">
        <span className="p-float-label">
          <InputText id="theme" value={theme} onChange={(e) => setTheme(e.target.value)} />
          <label htmlFor="theme">Thème du Tableau de Bord</label>
        </span>
      </div>
      <Button label="Enregistrer" icon="pi pi-save" onClick={saveSettings} />
    </Layout>
  );
}
