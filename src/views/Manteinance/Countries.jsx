import { useState, useEffect } from "react";
import Table from "../shared/components/Table"
import CountriesService from "../../services/CountriesService"
import Sidebar from "../shared/components/SideBar";

const Countries = () => {
  const [countries, setcountries] = useState([]);
  
  const fetchcountriesData = () => {
    CountriesService.fetchCountries()
    .then((response) => {
        setcountries(response.data);
    })
    .catch((error) => {
        console.log("Error: ", error)
    })
    };

  useEffect(() => {
    fetchcountriesData();
  }, []);

  return (
    <>
        <div className="dashboard__sidebar">
        <Sidebar />
      </div>
    <div className="content-page">
      <Table
        data={countries}
        columns={["Name", "Code"]}
        onSelect={()=>{return ''}}
        selectedRow={null}
        onDelete={()=>{return ''}}
        onEdit={()=>{return ''}}
        onAdd={()=>{return ''}}
        title="Countries"
      />
    </div>
    </>
  );
};

export default Countries;
