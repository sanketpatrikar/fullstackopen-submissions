const CountriesList = ({
    displayedCountry,
    filteredCountries,
    handleCountrySelect,
}) => {
    return (
        <div>
            {!displayedCountry && filteredCountries.length > 10 && (
                <div>Too many matches, specify another filter</div>
            )}
            {!displayedCountry &&
                filteredCountries.length > 1 &&
                filteredCountries.length < 10 &&
                filteredCountries.map((country, index) => (
                    <div key={index}>
                        {country}{" "}
                        <button onClick={() => handleCountrySelect(country)}>
                            show
                        </button>
                    </div>
                ))}
        </div>
    );
};
export default CountriesList;
