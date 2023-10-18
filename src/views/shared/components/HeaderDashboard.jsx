import NavigationButtons from "./NavigationButtons"
import BUTTONS_LIST from "../../../constants/dashboard"
import "../../../styles/components/HeaderDashboard.scss"
const HeaderDashboard = () => {
    return (<div className= "header-dashboard__container">
        <header>
            <div>
                <h1>HOME</h1>
                <h3>Welcome to Integral</h3>
            </div>
            <div>
                <input type="search" placeholder="Search" />
                <div>Tasa Representativa del mercado: $4761.64</div>
            </div>

        </header>


        <article>
            {BUTTONS_LIST.map((options) => (
                <NavigationButtons icon={options.icon} text={options.name} />
            ))}



        </article>
    </div>)
}

export default HeaderDashboard