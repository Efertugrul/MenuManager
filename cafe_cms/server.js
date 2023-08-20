const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(express.static(__dirname));

app.use(cors());  // To allow cross-origin requests
app.use(bodyParser.json());  // Parse JSON body data

// Read the menu from the JSON file
const getMenu = () => {
    return JSON.parse(fs.readFileSync('menu.json', 'utf8'));
};

// Save the menu to the JSON file
const saveMenu = (data) => {
    fs.writeFileSync('menu.json', JSON.stringify(data, null, 2), 'utf8');
};

// GET endpoint to fetch the menu
app.get('/menu', (req, res) => {
    res.json(getMenu());
});

// POST endpoint to update the menu
app.post('/menu', (req, res) => {
    const newMenu = req.body;
    saveMenu(newMenu);
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
