"use client"
import Layout from '@/layouts/Layout';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';

export default function Classes() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    // Appel API Django pour récupérer les classes
    fetch('https://api.example.com/classes')
      .then(response => response.json())
      .then(data => setClasses(data))
      .catch(error => console.error('Erreur:', error));
  }, []);

  const createClass = () => {
    // Logique pour créer une nouvelle classe
    console.log("Créer une nouvelle classe");
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl">Liste des Classes</h1>
        <Button label="Créer une classe" icon="pi pi-plus" onClick={createClass} />
      </div>
      <DataTable value={classes} responsiveLayout="scroll">
        <Column field="nom" header="Nom" />
        <Column field="niveau" header="Niveau" />
        <Column field="professeur" header="Professeur" />
      </DataTable>
    </Layout>
  );
}
