import axios from "axios";

const baseUrl = "http://localhost:5000/api/people";

const getAll = () => {
	return axios.get(`${baseUrl}`).then((response) => {
		console.log(response);
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

const deletePerson = (name, id) => {
	return axios.delete(`${baseUrl}/${id}`).then((response) => {
		return response.data;
	});
};

export default { getAll, add, update, deletePerson };
