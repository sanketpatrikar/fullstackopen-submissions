import { useEffect, useState } from "react";
import CountriesList from "./components/CountriesList";
import CountryDetails from "./components/CountryDetails";

const App = () => {
    const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";

    const [inputCountry, setInputCountry] = useState(null);
    const [countriesList, setCountriesList] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [displayedCountry, setDisplayedCountry] = useState(null);

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

        if (inputCountry === "") {
            filteredCountries = [];
            setFilteredCountries(filteredCountries);
            return;
        }
        filteredCountries = countriesList.filter((country) =>
            country.toLowerCase().startsWith(inputCountry)
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
        } else {
            setDisplayedCountry(null);
        }
    };

    const handleCountrySelect = (countryName) => {
        const fetchCountry = async () => {
            const response = await fetch(`${baseUrl}/name/${countryName}`);
            setDisplayedCountry(await response.json());
        };

        fetchCountry();
    };

    return (
        <div>
            find countries <input type="text" onChange={handleInputChange} />
            <CountriesList
                displayedCountry={displayedCountry}
                filteredCountries={filteredCountries}
                handleCountrySelect={handleCountrySelect}
            />
            <CountryDetails displayedCountry={displayedCountry} />
        </div>
    );
};
export default App;
