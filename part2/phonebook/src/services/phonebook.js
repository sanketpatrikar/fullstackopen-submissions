import axios from "axios";

const baseUrl = "http://localhost:5000/api/people";

const getAll = () => {
	return axios.get(`${baseUrl}`).then((response) => {
		return response.data;
	});
};

const add = (newPerson) => {
	return axios.post(`${baseUrl}`, newPerson).then((response) => {
		return response.data;
	});
};

const update = (id, modifiedPerson) => {
	return axios.put(`${baseUrl}/${id}`, modifiedPerson).then((response) => {
		return response.data;
	});
};

const deletePerson = async (id) => {
	return await axios.delete(`${baseUrl}/${id}`).then((response) => {
		return response.data;
	});
};

export default { getAll, add, update, deletePerson };
