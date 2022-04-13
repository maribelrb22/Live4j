import { Card } from 'primereact/card';
import "../css/GraphOperations.css";
import { Accordion, AccordionTab } from 'primereact/accordion';
import React, { useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';

const GraphOperations = () => {
    const [inputQuery, setInputQuery] = useState('');
    const [title, setTitle] = useState('');
    const [language, setLanguage] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [voteAverage, setVoteAverage] = useState('');
    const [genre, setGenre] = useState('');
    const [selectedGenres, setSelectedGenres] = useState(null);

    const genres = [
        { name: 'Acción' },
        { name: 'Aventura' },
        { name: 'Crimen' },
    ];

    return (
        <Card className="w-full p-operation-panel" title="Películas">
            <Accordion className="accordion-custom">
                <AccordionTab
                    header={
                        <React.Fragment>
                            <i className="pi pi-plus-circle mr-3"></i>
                            <span>Crear película</span>
                        </React.Fragment>}>
                    <div className="p-inputgroup mb-2">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-id-card"></i>
                        </span>
                        <InputText placeholder='Título de la película' value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="p-inputgroup mb-2">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-globe"></i>
                        </span>
                        <InputText className='w-full' placeholder='Idioma original' value={language} onChange={(e) => setLanguage(e.target.value)} />
                    </div>
                    <div className="p-inputgroup mb-2">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-calendar"></i>
                        </span>
                        <InputText className='w-full' placeholder='Fecha de estreno' value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
                    </div>
                    <div className="p-inputgroup mb-2">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-star"></i>
                        </span>
                        <InputText className='w-full' placeholder='Puntuación' value={voteAverage} onChange={(e) => setVoteAverage(e.target.value)} />
                    </div>
                    <div className="p-inputgroup mb-2">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-tag"></i>
                        </span>
                        <MultiSelect value={selectedGenres} options={genres} onChange={(e) => setSelectedGenres(e.value)} optionLabel="name" optionValue="name" placeholder="Selecciona géneros" />
                    </div>
                    <Button label="Crear" className='w-full' icon="pi pi-plus" onClick={() => console.log("pelicula creada")} />
                </AccordionTab>
                <AccordionTab
                    header={
                        <React.Fragment>
                            <i className="pi pi-plus-circle mr-3"></i>
                            <span>Crear género</span>
                        </React.Fragment>}>
                    <div className="p-inputgroup mb-2">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-tag"></i>
                        </span>
                        <InputText className='w-full' placeholder='Género' value={genre} onChange={(e) => setGenre(e.target.value)} />
                    </div>
                    <Button label="Crear" className='w-full' icon="pi pi-plus" onClick={() => console.log("genero creada")} />

                </AccordionTab>
                <AccordionTab
                    header={
                        <React.Fragment>
                            <i className="pi pi-pencil mr-3"></i>
                            <span>Haz tu propia consulta</span>
                        </React.Fragment>}>
                    <div className="flex flex-column">
                        <InputTextarea className="w-full mb-3" value={inputQuery} onChange={(e) => setInputQuery(e.target.value)} rows={5} />
                        <Button label="Enviar" icon="pi pi-send" onClick={() => console.log("consulta enviada")} />
                    </div>
                </AccordionTab>
            </Accordion>
        </Card>
    )
}

export default GraphOperations;