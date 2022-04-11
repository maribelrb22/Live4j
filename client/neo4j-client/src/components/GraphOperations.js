import { Card } from 'primereact/card';
import "../css/GraphOperations.css";
import { Accordion, AccordionTab } from 'primereact/accordion';
import React, { useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

const GraphOperations = () => {
    const [inputQuery, setInputQuery] = useState('');

    return (
        <Card className="w-full p-operation-panel" title="Operaciones">
            <Accordion className="accordion-custom">
                <AccordionTab
                    header={
                        <React.Fragment>
                            <i className="pi pi-plus-circle mr-3"></i>
                            <span>Crear nodo</span>
                        </React.Fragment>}>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                        ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </AccordionTab>
                <AccordionTab
                    header={
                        <React.Fragment>
                            <i className="pi pi-reply mr-3"></i>
                            <span>Crear relación</span>
                        </React.Fragment>}>
                    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                        architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
                        voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.</p>
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