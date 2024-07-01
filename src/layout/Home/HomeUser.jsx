import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import './Home.css';
import { useTranslation } from "react-i18next";
import axios from 'axios';
import VisitaFrecuenteForm from '../../components/VisitaFrecuenteForm/visitaFrecuenteForm.jsx'; 

const HomeUser = () => {
    const { t } = useTranslation("global");
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Función para cargar los ingresos al cargar la página
    useEffect(() => {
        fetchEntries();
    }, []);
    const labels = {
        formTitle: t('home.formTitle'),
        namePlaceholder: t('home.namePlaceholder'),
        referencePlaceholder: t('home.referencePlaceholder'),
        departmentPlaceholder: t('home.departmentPlaceholder'),
        submitButton: t('home.submitButton')
    };

    // Función para obtener los ingresos desde el backend
    const fetchEntries = () => {
        axios.get('https://apivercel-smoky.vercel.app/api/ingreso')
            .then(response => {
                setEntries(response.data);
            })
            .catch(error => {
                console.error('Error fetching entries:', error);
                setError('Error fetching entries. Please try again later.');
            });
    };

    return (
        <div>
            <Navbar />
            <div className="main-home">
                <VisitaFrecuenteForm />
                <div className="entries-list">
                    <h2>{t('home.entriesList')}</h2>
                    {error && <p>{t('home.errorFetchingEntries')}</p>}
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t('home.type')}</th>
                                <th>{t('home.name')}</th>
                                <th>{t('home.reference')}</th>
                                <th>{t('home.plate')}</th>
                                <th>{t('home.department')}</th>
                                <th>{t('home.schedule')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map(entry => (
                                <tr key={entry.id}>
                                    <td>{entry.id}</td>
                                    <td>{entry.tipo}</td>
                                    <td>{entry.nombre}</td>
                                    <td>{entry.referencia}</td>
                                    <td>{entry.patente}</td>
                                    <td>{entry.dept}</td>
                                    <td>{entry.horario}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HomeUser;

