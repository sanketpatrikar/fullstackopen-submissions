import axios from "axios";

const baseUrl = "http://localhost:5000";

const getAll = () => {
    axios.get(baseUrl).then((response) => {
        return response.data;
    });
};

export default { getAll };
