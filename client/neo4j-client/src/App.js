import './css/App.css';
import Graphs from "./components/Graphs";
import GraphOperations from './components/GraphOperations';
import { GraphContextProvider } from './context/GraphContext';

function App() {
  return (
    <GraphContextProvider>
      <div className="flex grid App">
        <div className="col-9">
          <Graphs />
        </div>
        <div className="col-3">
          <GraphOperations />
        </div>
      </div>
    </GraphContextProvider>
  );
}

export default App;
