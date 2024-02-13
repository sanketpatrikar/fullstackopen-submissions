import axios from "axios";

const baseUrl = "http://localhost:5000";

const getAll = () => {
    return axios.get(`${baseUrl}/people`).then((response) => {
        return response.data;
    });
};

const add = (newPerson) => {
    return axios.post(`${baseUrl}/people`, newPerson).then((response) => {
        return response.data;
    });
};

export default { getAll, add };
