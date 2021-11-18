const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService');
const { response } = require('express');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

// Create
app.post('/insert', async (request, response) => {
  const { name } = request.body;
  const db = dbService.getDbServiceInstance();

  try {
    const result = await db.insertNewName(name);
    return response.json({ data: result });
  }

  catch (error) {
    console.error(error);
  }
});

// Read
app.get('/getAll', async (request, response) => {
  const db = dbService.getDbServiceInstance();

  try {
    const result = await db.getAllData();
    return response.json({ data : result });
  }

  catch (error) {
    console.error(error);
  }
});

// Update
app.patch('/update', async (request, response) => {
  const { id, name } = request.body;
  const db = dbService.getDbServiceInstance();
  
  try {
    const result = await db.updateNameById(id, name);
    return response.json({ success : result });
  }

  catch (error) {
    console.error(error);
  }
});

// Delete
app.delete('/delete/:id', async (request, response) => {
  const { id } = request.params;
  const db = dbService.getDbServiceInstance();
  try {
    const result = await db.deleteRowById(id);
    return response.json({ success : result });
  }

  catch (error) {
    console.error(error);
  }
});

// Search
app.get('/search/:name', async (request, response) => {
  const { name } = request.params;
  const db = dbService.getDbServiceInstance();
  try {
    const result = await db.searchByName(name);
    return response.json({ data : result });
  }

  catch (error) {
    console.error(error);
  }
});

app.listen(process.env.PORT, () => console.log('App is running'));