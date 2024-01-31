import Part from "./Part";

const Content = (props) => {
    return (
        <>
            {props.course.parts.map((part) => {
                return <Part part={part.name} exercise={part.exercise} />;
            })}
        </>
    );
};

export default Content;
