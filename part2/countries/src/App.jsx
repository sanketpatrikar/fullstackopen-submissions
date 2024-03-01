import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
    const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";

    const [inputCountry, setInputCountry] = useState(null);
    const [countriesList, setCountriesList] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [displayedCountry, setDisplayedCountry] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${baseUrl}/all`);
            const data = await response.json();

            const countries = await data.map((country) => {
                return country.name.common;
            });
            setCountriesList(countries);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return <div>loading data...</div>;
    }

    const handleInputChange = async (event) => {
        let filteredCountries = [];

        setInputCountry(event.target.value);
        const input = event.target.value;

        if (input === "") {
            filteredCountries = [];
            setFilteredCountries(filteredCountries);
            return;
        }
        filteredCountries = countriesList.filter((country) =>
            country.toLowerCase().startsWith(input)
        );

        setFilteredCountries(filteredCountries);

        if (filteredCountries.length === 1) {
            const fetchCountry = async () => {
                const response = await fetch(
                    `${baseUrl}/name/${filteredCountries[0]}`
                );
                setDisplayedCountry(await response.json());
            };

            fetchCountry();
        }
    };

    return (
        <div>
            find countries <input type="text" onChange={handleInputChange} />
            {filteredCountries.length > 1 &&
                filteredCountries.map((country) => <div>{country}</div>)}
            {filteredCountries.length === 1 && displayedCountry && (
                <div>
                    <h1>{displayedCountry.name.common}</h1>
                    <p>capital {displayedCountry.capital[0]}</p>
                    <p>area {displayedCountry.area}</p>
                    <ul>
                        {Object.values(displayedCountry.languages).map(language => <li>{language}</li>)}
                    </ul>
                    <img src={displayedCountry.flags.png} alt="" srcset="" />
                </div>
            )}
        </div>
    );
};
export default App;
