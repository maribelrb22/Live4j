import { Card } from 'primereact/card';
import "../css/GraphOperations.css";
import { Accordion, AccordionTab } from 'primereact/accordion';
import React, { useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';

const GraphOperations = () => {
    const [inputQuery, setInputQuery] = useState('');
    const [title, setTitle] = useState('');
    const [language, setLanguage] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [voteAverage, setVoteAverage] = useState('');
    const [genre, setGenre] = useState('');
    const [selectedGenres, setSelectedGenres] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const yearRange = "1800:" + new Date().getFullYear();

    const genres = [
        { name: 'Acción' },
        { name: 'Aventura' },
        { name: 'Crimen' },
    ];

    const validateFilm = () => {
        const errors = {}

        if (!title) errors.title = "El título es requerido"
        if (!language) errors.language = "El idioma es requerido"
        if (!releaseDate) errors.releaseDate = "La fecha de estreno es requerida"
        if (!voteAverage) errors.voteAverage = "La puntuación es requerida"

        setFormErrors(errors)
    }

    const validateGenre = () => {
        const errors = {}
        if (!genre) errors.genre = "El género es requerido"
        setFormErrors(errors)
    }

    const validateQuery = () => {
        const errors = {}
        if (!inputQuery) errors.inputQuery = "La consulta es requerida"
        setFormErrors(errors)
    }

    const getFieldError = (field) => {
        return formErrors[field] && <span className="errorMessage">{formErrors[field]}</span>
    }

    return (
        <Card className="w-full p-operation-panel" title="Películas">
            <Accordion className="accordion-custom">
                <AccordionTab
                    header={
                        <React.Fragment>
                            <i className="pi pi-plus-circle mr-3"></i>
                            <span>Crear película</span>
                        </React.Fragment>}>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-id-card"></i>
                        </span>
                        <InputText placeholder='Título de la película' value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    {getFieldError("title")}
                    <div className="p-inputgroup mt-2">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-globe"></i>
                        </span>
                        <InputText className='w-full' placeholder='Idioma original' value={language} onChange={(e) => setLanguage(e.target.value)} />
                    </div>
                    {getFieldError("language")}
                    <div className="p-inputgroup mt-2">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-calendar"></i>
                        </span>
                        <Calendar className='w-full' placeholder='Fecha de estreno' value={releaseDate} onChange={(e) => setReleaseDate(e.value)} yearNavigator monthNavigator yearRange={yearRange} />
                    </div>
                    {getFieldError("releaseDate")}
                    <div className="p-inputgroup mt-2">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-star"></i>
                        </span>
                        <InputText className='w-full' placeholder='Puntuación' value={voteAverage} onChange={(e) => setVoteAverage(e.target.value)} />
                    </div>
                    {getFieldError("voteAverage")}
                    <div className="p-inputgroup mt-2">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-tag"></i>
                        </span>
                        <MultiSelect value={selectedGenres} options={genres} onChange={(e) => setSelectedGenres(e.value)} optionLabel="name" optionValue="name" placeholder="Selecciona géneros" />
                    </div>
                    <Button label="Crear" className='w-full mt-3' icon="pi pi-plus" onClick={validateFilm} />
                </AccordionTab>
                <AccordionTab
                    header={
                        <React.Fragment>
                            <i className="pi pi-plus-circle mr-3"></i>
                            <span>Crear género</span>
                        </React.Fragment>}>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-tag"></i>
                        </span>
                        <InputText className='w-full' placeholder='Género' value={genre} onChange={(e) => setGenre(e.target.value)} />
                    </div>
                    {getFieldError("genre")}
                    <Button label="Crear" className='w-full mt-3' icon="pi pi-plus" onClick={validateGenre} />

                </AccordionTab>
                <AccordionTab
                    header={
                        <React.Fragment>
                            <i className="pi pi-pencil mr-3"></i>
                            <span>Haz tu propia consulta</span>
                        </React.Fragment>}>
                    <div className="flex flex-column">
                        <InputTextarea className="w-full" value={inputQuery} onChange={(e) => setInputQuery(e.target.value)} rows={5} />
                        {getFieldError("inputQuery")}
                        <Button className="mt-3" label="Enviar" icon="pi pi-send" onClick={validateQuery} />
                    </div>
                </AccordionTab>
            </Accordion>
        </Card>
    )
}

export default GraphOperations;