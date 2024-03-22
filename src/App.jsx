import "./App.css";
import { Calendar } from "./components/calendar/Calendar";
import { NavBar } from "./components/navbar/NavBar";

function App() {
  return (
    <>
      <NavBar />
      <div className="app">
        <Calendar />
      </div>
    </>
  );
}

export default App;
