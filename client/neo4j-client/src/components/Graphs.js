import Graph from "react-graph-vis";
import React, { useContext, useState } from "react";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import "../css/Graphs.css";
import { GraphContext } from "../context/GraphContext";

const Graphs = () => {
    const [filmSelected, setFilmSelected] = useState(false);
    const [edgeSelected, setEdgeSelected] = useState(false);
    const [idSelectedNode, setIdSelectedNode] = useState(false);
    const [idSelectedEdge, setIdSelectedEdge] = useState(false);

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
            if (nodes.length !== 0) {
                setIdSelectedNode(nodes)
                setFilmSelected(true)
            }

            if (nodes.length === 0 && edges.length !== 0) {
                setIdSelectedEdge(edges)
                setEdgeSelected(true)
            }
        },
    };

    /*
    TODO: Differentiate between movies and genres

    <Dialog header="¿Quieres eliminar el género?" className="w-3" visible={genreSelected} onHide={() => setGenreSelected(false)}>
        <div className="grid w-full m-auto">
            <div className="col-12 md:col-6">
                <Button label="Cancelar" className="w-full h-full" icon="pi pi-times" onClick={() => console.log("cancelar eliminado")} />
            </div>
            <div className="col-12 md:col-6">
                <Button label="Eliminar" className="p-button-danger w-full h-full" icon="pi pi-minus-circle" onClick={() => console.log("genero eliminado")} />
            </div>
        </div>
    </Dialog>
    */

    return (
        <div>
            <Graph
                graph={graph}
                options={options}
                events={events}
            />

            <Dialog header="Propiedades de la película" className="w-4" visible={filmSelected} onHide={() => setFilmSelected(false)}>

                <div className="p-inputgroup mb-2">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-id-card"></i>
                    </span>
                    <InputText placeholder='Título de la película' />
                </div>
                <div className="p-inputgroup mb-2">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-globe"></i>
                    </span>
                    <InputText className='w-full' placeholder='Idioma original' />
                </div>
                <div className="p-inputgroup mb-2">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-calendar"></i>
                    </span>
                    <Calendar className='w-full' placeholder='Fecha de estreno' yearNavigator monthNavigator yearRange={yearRange} />
                </div>
                <div className="p-inputgroup mb-2">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-star"></i>
                    </span>
                    <InputText className='w-full' placeholder='Puntuación' />
                </div>
                <div className="p-inputgroup mb-2">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-tag"></i>
                    </span>
                    <MultiSelect className="left-auto" placeholder="Selecciona géneros" />
                </div>
                <div className="grid w-full m-auto">
                    <div className="col-12 md:col-6">
                        <Button label="Editar" icon="pi pi-pencil" className="w-full h-full" onClick={() => console.log("nodo editado")} />
                    </div>
                    <div className="col-12 md:col-6">
                        <Button label="Eliminar" className="p-button-danger w-full h-full" icon="pi pi-minus-circle" onClick={() => console.log("nodo eliminado")} />
                    </div>
                </div>
            </Dialog>

            <Dialog header="¿Quieres eliminar la relación?" className="w-3" visible={edgeSelected} onHide={() => setEdgeSelected(false)}>
                <div className="grid w-full m-auto">
                    <div className="col-12 md:col-6">
                        <Button label="Cancelar" className="w-full h-full" icon="pi pi-times" onClick={() => console.log("cancelar eliminado")} />
                    </div>
                    <div className="col-12 md:col-6">
                        <Button label="Eliminar" className="p-button-danger w-full h-full" icon="pi pi-minus-circle" onClick={() => console.log("arista eliminada")} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
export default Graphs;
