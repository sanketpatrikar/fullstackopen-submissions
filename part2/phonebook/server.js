// Import required modules
import express from "express";
import fs from "node:fs/promises";
import cors from "cors";

// Create an Express application
const app = express();
const port = 5000; // You can change this to any port you prefer
const filePath = "./db.json";

const corsOptions = {
    origin: "http://localhost:5173",
};

app.use(express.json());
app.use(cors(corsOptions));

// Define a route that returns the JSON
app.get("/people", async (req, res) => {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        res.json(JSON.parse(data));
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
});

app.get("/people/:personID", async (req, res) => {
    const personID = req.params.personID;
    try {
        const data = await fs.readFile(filePath, "utf-8");
        let jsonData = await JSON.parse(data);
        return res.send(jsonData[personID - 1]);
    } catch (error) {
        console.error(error);
    }
});

app.post("/people", async (req, res) => {
    const receivedPerson = req.body;
    try {
        const data = await fs.readFile(filePath, "utf-8");
        let jsonData = await JSON.parse(data);

        receivedPerson.id = jsonData.length + 1;

        jsonData.push(receivedPerson);

        
        jsonData = await fixIdOrder(jsonData);
        console.log(jsonData);

        await fs.writeFile(filePath, JSON.stringify(jsonData));

        res.status(201).send(receivedPerson);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file or data");
    }
});

app.put("/people/:personID", async (req, res) => {
    const personID = req.params.personID;
    const modifiedPerson = req.body;

    try {
        const data = await fs.readFile(filePath, "utf-8");
        let jsonData = await JSON.parse(data);

        jsonData.splice(personID, 1, modifiedPerson);

        jsonData = await fixIdOrder(jsonData);

        return res.send(jsonData);
    } catch (error) {
        console.error(error);
    }
});

app.delete("/people/:personID", async (req, res) => {
    const personID = req.params.personID;

    try {
        const data = await fs.readFile(filePath, "utf-8");
        let jsonData = await JSON.parse(data);
        console.log(jsonData);

        const indexOfPerson = jsonData.findIndex((person) => {
            return person.id === parseInt(personID);
        });

        jsonData.splice(indexOfPerson, 1);

        jsonData = await fixIdOrder(jsonData);

        await fs.writeFile(filePath, JSON.stringify(jsonData));

        return res.send(jsonData);
    } catch (error) {
        console.error(error);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/people`);
});

const fixIdOrder = async (people) => {
    await people.forEach((person, index) => {
        people[index].id = index + 1;
    });

    return people;
};
