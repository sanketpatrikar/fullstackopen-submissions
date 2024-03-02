const CountryDetails = ({displayedCountry}) => {
    return (
        <div>
            {displayedCountry && (
                <div>
                    <h1>{displayedCountry.name.common}</h1>
                    <p>capital {displayedCountry.capital[0]}</p>
                    <p>area {displayedCountry.area}</p>
                    <p>
                        <strong>langauges</strong>
                    </p>
                    <ul>
                        {Object.values(displayedCountry.languages).map(
                            (language, index) => (
                                <li key={index}>{language}</li>
                            )
                        )}
                    </ul>
                    <img src={displayedCountry.flags.png} />
                </div>
            )}
        </div>
    );
};
export default CountryDetails;
