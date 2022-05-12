import { Card } from 'primereact/card';
import "../css/GraphOperations.css";
import { Accordion, AccordionTab } from 'primereact/accordion';
import React, { useState, useContext, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { GraphContext } from '../context/GraphContext';
import { Messages } from 'primereact/messages';

const GraphOperations = () => {
    const [title, setTitle] = useState('');
    const [language, setLanguage] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [voteAverage, setVoteAverage] = useState('');
    const [genre, setGenre] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const message = useRef(null);

    const yearRange = "1800:" + new Date().getFullYear();

    const { actions, graph: { genres } } = useContext(GraphContext)

    const validateMovie = () => {
        const errors = {}

        if (!title) errors.title = "El título es requerido"
        if (!language) errors.language = "El idioma es requerido"
        if (!releaseDate) errors.releaseDate = "La fecha de estreno es requerida"
        if (!voteAverage) errors.voteAverage = "La puntuación es requerida"

        setFormErrors(errors)

        if (!Object.values(errors).length) {
            actions.addMovie({
                name: title,
                language,
                releaseDate,
                rating: voteAverage,
                genres: selectedGenres
            })
            message.current.show({ severity: 'success', detail: 'Película añadida correctamente' });
        }
    }

    const validateGenre = () => {
        const errors = {}
        if (!genre) errors.genre = "El género es requerido"
        setFormErrors(errors)

        if (!Object.values(errors).length) {
            actions.addGenre({
                name: genre
            })
            message.current.show({ severity: 'success', detail: 'Género añadido correctamente' });
        }
    }

    const getFieldError = (field) => {
        return formErrors[field] && <span className="errorMessage">{formErrors[field]}</span>
    }

    return (
        <Card className="w-full" title="Películas">
            <Messages ref={message} />
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
                        <MultiSelect value={selectedGenres} options={Object.values(genres)} onChange={(e) => setSelectedGenres(e.value)} optionLabel="name" optionValue="id" placeholder="Género(s)" />
                    </div>
                    <Button label="Crear" className='w-full mt-3' icon="pi pi-plus" onClick={validateMovie} />
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
                        <InputText className='w-full' placeholder='Nombre' value={genre} onChange={(e) => setGenre(e.target.value)} />
                    </div>
                    {getFieldError("genre")}
                    <Button label="Crear" className='w-full mt-3' icon="pi pi-plus" onClick={validateGenre} />
                </AccordionTab>
            </Accordion>
        </Card>
    )
}

export default GraphOperations;
