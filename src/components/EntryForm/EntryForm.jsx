import React, { useState } from 'react';
import axios from 'axios';
import './EntryForm.css';
import { useTranslation } from 'react-i18next';

const EntryForm = ({ onEntryCreated, defaultTipo }) => {
    const { t } = useTranslation("global");
    const [newEntry, setNewEntry] = useState({
        tipo: defaultTipo,
        nombre: '',
        referencia: '',
        dept: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEntry({ ...newEntry, [name]: value });
    };

    const getCurrentTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!newEntry.nombre.trim() || !newEntry.referencia.trim() || !newEntry.dept.trim()) {
            setError(t('entryForm.errorIncompleteFields'));
            return;
        }

        const entryWithTime = { ...newEntry, horario: getCurrentTime() };

        setLoading(true);
        axios.post('https://apivercel-smoky.vercel.app/api/ingreso', entryWithTime)
            .then(response => {
                setLoading(false);
                setNewEntry({
                    tipo: defaultTipo,
                    nombre: '',
                    referencia: '',
                    dept: ''
                });
                onEntryCreated(entryWithTime);
            })
            .catch(error => {
                setLoading(false);
                console.error('Error creating entry:', error);

                if (error.response) {
                    if (error.response.status === 400) {
                        const errorMessage = error.response.data.error || t('entryForm.errorRequest');
                        setError(errorMessage);
                    } else {
                        setError(t('entryForm.errorCreateEntry'));
                    }
                } else {
                    setError(t('entryForm.errorNetwork'));
                }
            });
    };

    const getPlaceholder = (name) => {
        if (name === 'referencia') {
            switch (defaultTipo) {
                case 'Visita':
                    return t('visitas.rutPlaceholder');
                case 'Vehiculo':
                    return t('entryForm.patentePlaceholder');
                case 'Delivery':
                    return t('entryForm.idPlaceholder');
                default:
                    return '';
            }
        } else if (name === 'nombre') {
            switch (defaultTipo) {
                case 'Visita':
                    return t('entryForm.namePlaceholder');
                case 'Vehiculo':
                    return t('entryForm.carNamePlaceholder');
                case 'Delivery':
                    return t('entryForm.deliveryNamePlaceholder');
                default:
                    return '';
            }
        }
    };
    const getTitle = (name) => {
        if (name === 'referencia') {
            switch (defaultTipo) {
                case 'Visita':
                    return t('entryForm.rutTitle');
                case 'Vehiculo':
                    return t('entryForm.patenteTitle');
                case 'Delivery':
                    return t('entryForm.deliveryTitle');
                default:
                    return '';
            }
        } else if (name === 'nombre') {
            switch (defaultTipo) {
                case 'Visita':
                    return t('entryForm.nameTitle');
                case 'Vehiculo':
                    return t('entryForm.carNameTitle');
                case 'Delivery':
                    return t('entryForm.deliveryNameTitle');
                default:
                    return '';
            }
        }
    };

    return (
        <div className="entry-form">
            <h2>{t('entryForm.formTitle')}</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="tituloNombre">{getTitle("nombre")}</label>
                <input type="text" name="nombre" placeholder="" value={newEntry.nombre} onChange={handleInputChange} />
                <label htmlFor="tituloReferencia">{getTitle("referencia")}</label>
                <input type="text" name="referencia" placeholder="" value={newEntry.referencia} onChange={handleInputChange} />
                <label htmlFor="tituloDepartamento">{t('entryForm.departmentTitle')}</label>
                <select id="departmentNoFrecuente" name="dept" value={newEntry.dept} onChange={handleInputChange}>
                    <option value="">{t('entryForm.departmentPlaceholder')}</option>
                    <option value="Departamento 01">{t('visitaFrecuenteForm.depto1')}</option>
                    <option value="Departamento 02">{t('visitaFrecuenteForm.depto2')}</option>
                    <option value="Departamento 03">{t('visitaFrecuenteForm.depto3')}</option>
                    <option value="Departamento 04">{t('visitaFrecuenteForm.depto4')}</option>
                </select>
                <button type="submit" disabled={loading}>{loading ? t('entryForm.loading') : t('entryForm.submitButton')}</button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default EntryForm;

