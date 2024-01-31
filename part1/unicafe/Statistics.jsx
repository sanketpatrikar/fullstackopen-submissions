import { StatisticLine } from "../StatisticLine";

export const Statistics = ({ good, neutral, bad }) => {
    return (
        <>
            <h1>statistics</h1>
            {good < 1 && neutral < 1 && bad < 1 ? (
                <p>No feedback given</p>
            ) : (
                <table>
                    <tbody>
                        <StatisticLine text="good" value={good} />
                        <StatisticLine text="neutral" value={neutral} />
                        <StatisticLine text="bad" value={bad} />
                        <tr>
                            <td>all</td>
                            <td>{good + neutral + bad}</td>
                        </tr>
                        <tr>
                            <td>average</td>
                            <td>{(good - bad) / (good + neutral + bad)}</td>
                        </tr>
                        <tr>
                            <td>positive</td>
                            <td>{(good / (good + neutral + bad)) * 100} %</td>
                        </tr>
                    </tbody>
                </table>
            )}
        </>
    );
};
