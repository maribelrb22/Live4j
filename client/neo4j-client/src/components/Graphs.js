import Graph from "react-graph-vis";
import React, { useState } from "react";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import "../css/Graphs.css";

const Graphs = () => {
    const [nodeSelected, setNodeSelected] = useState(false);
    const [edgeSelected, setEdgeSelected] = useState(false);
    const [idSelectedNode, setIdSelectedNode] = useState(false);
    const [idSelectedEdge, setIdSelectedEdge] = useState(false);

    const [graph] = useState({
        nodes: [
            { id: 1, label: "Node 1", title: "node 1" },
            { id: 2, label: "Node 2", title: "node 2" },
            { id: 3, label: "Node 3", title: "node 3" },
            { id: 4, label: "Node 4", title: "node 4" },
            { id: 5, label: "Node 5", title: "node 5" }
        ],
        edges: [
            { id: 1, from: 1, to: 2, label: "arista 1" },
            { id: 2, from: 1, to: 3, label: "arista 2" },
            { id: 3, from: 2, to: 4, label: "arista 3" },
            { id: 4, from: 2, to: 5, label: "arista 4" }
        ]
    })

    const options = {
        layout: {
            hierarchical: false
        },
        edges: {
            color: "#000000"
        },
        height: "500px"
    };

    const events = {
        select: ({ nodes, edges }) => {
            if (nodes.length !== 0) {
                setIdSelectedNode(nodes)
                setNodeSelected(true)
            }

            if (nodes.length === 0 && edges.length !== 0) {
                setIdSelectedEdge(edges)
                setEdgeSelected(true)
            }
        },
    };
    return (
        <div>
            <Graph
                graph={graph}
                options={options}
                events={events}
            />

            <Dialog header={"Editar nodo " + idSelectedNode} className="w-4" visible={nodeSelected} onHide={() => setNodeSelected(false)}>
                <div className="text-center">
                    <Button label="Eliminar" className="mr-3 p-button-danger" icon="pi pi-minus-circle" onClick={() => console.log("nodo eliminado")} />
                    <Button label="Editar" icon="pi pi-pencil" onClick={() => console.log("nodo editado")} />
                </div>
            </Dialog>
            <Dialog header={"Editar arista " + idSelectedEdge} className="w-4" visible={edgeSelected} onHide={() => setEdgeSelected(false)}>
                <div className="mt-3 text-center">
                    <Button label="Eliminar" className="mr-3 p-button-danger" icon="pi pi-minus-circle" onClick={() => console.log("arista eliminada")} />
                    <Button label="Editar" icon="pi pi-pencil" onClick={() => console.log("arista editada")} />
                </div>
            </Dialog>
        </div>
    );
}
export default Graphs;