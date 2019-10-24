const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

//middleware
function idExists(req, res, next){
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

    if (!project) {
      return res.status(400).json({ error: 'Projeto não existe' });
    }
    return next();
  }


//Middleware global
function countRequests(req, res, next){
  console.count("Requisições");

  return next();
}

server.use(countRequests);

//Create
server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  
  const project = {
    id,
    title,
    tasks: []
  }
  
  projects.push(project);
  
  return res.json(project);
});

//Read
server.get('/projects', (req, res) => {
  return res.json(projects);
});

//Update
server.put('/projects/:id', idExists, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const project = projects.find(p => p.id == id);
  
  project.title = title;

  return res.json(projects);

})

//Delete
server.delete('/projects/:id', idExists, (req, res) => {
  const { id } = req.params;

  const project = projects.findIndex(p => p.id == id);

  projects.splice(project, 1);

  res.send('Projeto excluído!');
})

//Create task
server.post('/projects/:id/tasks', idExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  res.json(projects);
})


server.listen(3001);