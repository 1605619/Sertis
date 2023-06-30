import { useRouteError } from "react-router-dom";

const Error = () => {
    const error = useRouteError();

    return (
        <>
            <h1>Error Occured</h1>
            <h1>{ error.status } : { error.statusText }</h1>
        </>
    );
};

export default Error;