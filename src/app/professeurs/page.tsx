"use client"
import Layout from '@/layouts/Layout';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';

export default function Professeurs() {
  const [professeurs, setProfesseurs] = useState([]);

  useEffect(() => {
    fetch('https://api.example.com/professeurs')
      .then(response => response.json())
      .then(data => setProfesseurs(data))
      .catch(error => console.error('Erreur:', error));
  }, []);

  const createProfesseur = () => {
    console.log("Créer un nouveau professeur");
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl">Liste des Professeurs</h1>
        <Button label="Créer un professeur" icon="pi pi-plus" onClick={createProfesseur} />
      </div>
      <DataTable value={professeurs} responsiveLayout="scroll">
        <Column field="nom" header="Nom" />
        <Column field="matiere" header="Matière" />
        <Column field="email" header="Email" />
      </DataTable>
    </Layout>
  );
}
