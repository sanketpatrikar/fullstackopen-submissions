import axios from "axios";

const baseUrl = "/api/notes";

const getAll = async () => {
	const request = await axios.get(baseUrl);
	const nonExisting = {
		id: 10000,
		content: "This note is not saved to server",
		important: true,
	};
	return request.data.concat(nonExisting);
};

const create = async (newObject) => {
	const request = await axios.post(baseUrl, newObject);
	return request.data;
};

const toggleImportance = async (note) => {
	const id = note.id;
	const request = await axios.put(`${baseUrl}/${id}`, note);
	console.log(request.status, typeof request.status);
	if (request.status === 200) {
		return true;
	}
	return false;
};

export default {
	getAll,
	create,
	toggleImportance,
};
