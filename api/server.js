const express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    fs = require('file-system'),
    shortId = require('shortid'),
    dataFile = 'projects.json',
    app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('common'));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/api/projects', (req, res) => {
    res.send(fs.readFileSync(dataFile, 'utf8'));
});

app.post('/api/projects', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8')),
        project = req.body;

    project.id = shortId.generate();
    project.description = project.description || 'No Description';
    project.status = 'In Progress';
    project.date = project.date;

    data.push(project);
    fs.writeFileSync(dataFile, JSON.stringify(data));

    res.send(project);
});


app.get('/api/projects/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8')),
        project = data.find(project => project.id === req.params.id);

    res.send(project);
});

app.put('/api/projects/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8')),
        project = data.find(project => project.id === req.params.id),
        updatedProject = req.body;

    project.title = updatedProject.title;
    project.description = updatedProject.description || 'No Description';

    fs.writeFileSync(dataFile, JSON.stringify(data));

    res.sendStatus(204);
});

app.put('/api/projects/:id/done', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

    data.find(project => project.id === req.params.id).status = 'Done';

    fs.writeFileSync(dataFile, JSON.stringify(data));

    res.sendStatus(204);
});

app.delete('/api/projects/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

    const updatedData = data.filter(project => project.id !== req.params.id);

    fs.writeFileSync(dataFile, JSON.stringify(updatedData));

    res.sendStatus(204);
});

app.delete('/api/projects', (req, res) => {
    fs.writeFileSync(dataFile, JSON.stringify([]));

    res.sendStatus(204);
});

app.listen(3000, () =>  console.log('Server has been started...'));