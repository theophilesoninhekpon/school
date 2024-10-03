"use client"
import Layout from '@/layouts/Layout';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';

export default function Eleves() {
  const [eleves, setEleves] = useState([]);

  useEffect(() => {
    fetch('https://api.example.com/eleves')
      .then(response => response.json())
      .then(data => setEleves(data))
      .catch(error => console.error('Erreur:', error));
  }, []);

  const createEleve = () => {
    console.log("Créer un nouvel élève");
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl">Liste des Élèves</h1>
        <Button label="Créer un élève" icon="pi pi-plus" onClick={createEleve} />
      </div>
      <DataTable value={eleves} responsiveLayout="scroll">
        <Column field="nom" header="Nom" />
        <Column field="age" header="Âge" />
        <Column field="classe" header="Classe" />
      </DataTable>
    </Layout>
  );
}
