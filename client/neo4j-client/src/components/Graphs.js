import VisGraph from "react-vis-graph-wrapper";
import React, { useContext, useEffect, useState } from "react";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import "../css/Graphs.css";
import { GraphContext } from "../context/GraphContext";

const Graphs = () => {
    const [filmSelected, setFilmSelected] = useState(false);
    const [genreSelected, setGenreSelected] = useState(false);
    const [edgeSelected, setEdgeSelected] = useState(false);
    const [selectedFilmId, setSelectedFilmId] = useState(null);
    const [selectedGenreId, setSelectedGenreId] = useState(null);
    const [selectedEdgeId, setSelectedEdgeId] = useState(null);

    const [title, setTitle] = useState('');
    const [language, setLanguage] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [voteAverage, setVoteAverage] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [formErrors, setFormErrors] = useState({});

    const yearRange = "1800:" + new Date().getFullYear();

    const { ready, graph, actions } = useContext(GraphContext)

    const options = {
        layout: {
            hierarchical: false
        },
        edges: {
            color: "#000000",
        },
    };

    const events = {
        select: ({ nodes, edges }) => {
            if (nodes.length) {
                const [nodeId] = nodes
                if (graph.movies.hasOwnProperty(nodeId)) {
                    const movie = graph.movies[nodeId]
                    setSelectedFilmId(nodeId)
                    setTitle(movie.name)
                    setLanguage(movie.language)
                    setReleaseDate(new Date(movie.releaseDate))
                    setVoteAverage(movie.rating)
                    setSelectedGenres(movie.genres)
                    setFilmSelected(true)
                } else {
                    setSelectedGenreId(nodeId)
                    setGenreSelected(true)
                }
            } else if (edges.length) {
                const [edgeId] = edges
                setSelectedEdgeId(edgeId)
                setEdgeSelected(true)
            }
        }
    };

    const onDeleteFilm = () => {
        actions.deleteMovie(selectedFilmId)
        setFilmSelected(false)
    }

    const onDeleteGenre = () => {
        actions.deleteGenre(selectedGenreId)
        setGenreSelected(false)
    }

    const onDeleteRelationship = () => {
        const [edge] = graph.edges.filter(edge => edge.id === selectedEdgeId)
        const movieToUpdate = graph.movies[edge.from]
        actions.updateMovie({
            ...movieToUpdate,
            genres: movieToUpdate.genres.filter((genreId) => genreId !== edge.to)
        })
        setEdgeSelected(false)
    }

    const validateEditFilm = () => {
        const errors = {}

        if (!title) errors.title = "El título es requerido"
        if (!language) errors.language = "El idioma es requerido"
        if (!releaseDate) errors.releaseDate = "La fecha de estreno es requerida"
        if (!voteAverage) errors.voteAverage = "La puntuación es requerida"

        setFormErrors(errors)

        if (!Object.values(errors).length) {
            actions.updateMovie({
                id: selectedFilmId,
                name: title,
                language,
                releaseDate,
                rating: voteAverage,
                genres: selectedGenres
            })
        }

        setFilmSelected(false)
    }

    const getFieldError = (field) => {
        return formErrors[field] && <span className="errorMessage">{formErrors[field]}</span>
    }

    return (
        <div>
            <VisGraph
                graph={graph}
                options={options}
                events={events}
            />

            <Dialog header="Propiedades de la película" className="w-4" visible={filmSelected} onHide={() => setFilmSelected(false)}>
                <div className="p-inputgroup mb-2">
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
                    <MultiSelect value={selectedGenres} options={Object.values(graph.genres)} onChange={(e) => setSelectedGenres(e.value)} optionLabel="name" optionValue="id" placeholder="Selecciona géneros" />
                </div>
                <div className="grid w-full m-auto">
                    <div className="col-12 md:col-6">
                        <Button label="Editar" icon="pi pi-pencil" className="w-full h-full" onClick={validateEditFilm} />
                    </div>
                    <div className="col-12 md:col-6">
                        <Button label="Eliminar" className="p-button-danger w-full h-full" icon="pi pi-minus-circle" onClick={onDeleteFilm} />
                    </div>
                </div>
            </Dialog>
            <Dialog header="¿Quieres eliminar el género?" className="w-3" visible={genreSelected} onHide={() => setGenreSelected(false)}>
                <div className="grid w-full m-auto">
                    <div className="col-12 md:col-6">
                        <Button label="Cancelar" className="w-full h-full" icon="pi pi-times" onClick={() => setGenreSelected(false)} />
                    </div>
                    <div className="col-12 md:col-6">
                        <Button label="Eliminar" className="p-button-danger w-full h-full" icon="pi pi-minus-circle" onClick={onDeleteGenre} />
                    </div>
                </div>
            </Dialog>
            <Dialog header="¿Quieres eliminar la relación?" className="w-3" visible={edgeSelected} onHide={() => setEdgeSelected(false)}>
                <div className="grid w-full m-auto">
                    <div className="col-12 md:col-6">
                        <Button label="Cancelar" className="w-full h-full" icon="pi pi-times" onClick={() => setEdgeSelected(false)} />
                    </div>
                    <div className="col-12 md:col-6">
                        <Button label="Eliminar" className="p-button-danger w-full h-full" icon="pi pi-minus-circle" onClick={onDeleteRelationship} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
export default Graphs;
