import './css/App.css';
import Graphs from "./components/Graphs";
import GraphOperations from './components/GraphOperations';

function App() {
  return (
    <div className="flex grid App">
      <div className="col-8">
        <Graphs />
      </div>
      <div className="col-4">
        <GraphOperations />
      </div>
    </div>
  );
}

export default App;
