import "./App.css";
import { RoutesConfiguration } from "./routes/routes";
import "./styles/General.scss";
import 'bootswatch/dist/flatly/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./styles/components/CarrierCreationForm.scss";
import "./styles/components/ModalForms.scss";
import "./styles/components/Table.scss";
import "./styles/pages/Login.scss";
import "./styles/pages/Maintenance.scss";
import 'boxicons';

function App() {
  return (
    <>
      <RoutesConfiguration></RoutesConfiguration>
    </>
  );
}

export default App;
