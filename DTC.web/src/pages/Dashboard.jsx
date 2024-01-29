import { useState } from 'react';
import './Dashboard.css';
import { faSearch, faMultiply } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Dashboard() {

    const navigate = useNavigate();

    //Use state for input
    const [input, setInput] = useState("");
    

    function search() {
        if (input != "" && input.length <= 100) {
            navigate(`/cardsearch?q=${input}`);
            setInput("");
          }
    }

    //Clear search
    function clearSearch() {
        setInput("");
    }

    // Create all components
    return (
        <div id="dashboard">
        <div id="header-db">
            <Link to="/" style={{ textDecoration: 'none' }}>
                <text id="heading-db">DeckTechCentral</text>
            </Link>
            <div id="search-panel-db">
            <button id="go-db"
                onClick={() => search()}>
                <FontAwesomeIcon icon={faSearch}/>
            </button>
            <input id="search-bar-db" 
                placeholder="Search card..."
                autoComplete="off"
                onClick={() => setInput("")}
                onKeyDown={(e) => {if(e.key == "Enter") {search()}}}
                value={input}
                onChange={(e) => setInput(e.target.value)}>
            </input>
            <button id="clear-db"
                onClick={() => clearSearch()}>
                <FontAwesomeIcon icon={faMultiply}/>
            </button>
            </div>
            <div id="placeholder-db"></div>
        </div>
        </div>
    )
}
