const Total = (props) => {
    return (
        <>
            Number of exercises{" "}
            {props.course.parts.reduce((sum, part) => (sum += part.exercise), 0)}
        </>
    );
};

export default Total;
