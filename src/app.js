const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repository = { id: uuid(), url, title, techs, likes: 0 };

  repositories.push(repository);

  response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs, likes } = request.body;

  if (likes) {
    return response.json({ likes: 0 });
  }

  const repository = repositories.find((repo) => {
    if (repo.id === id) {
      repo.url = url;
      repo.title = title;
      repo.techs = techs;

      return repo;
    }
  });

  if (repository) return response.json(repository);

  return response.sendStatus(400);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  repositories.splice(repositoryIndex, 1);

  if (repositoryIndex >= 0) return response.sendStatus(204);

  return response.sendStatus(400);
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((repo) => {
    if (repo.id === id) {
      repo.likes = ++repo.likes;

      return repo;
    }
  });

  if (repository) return response.json({ likes: repository.likes });

  return response.sendStatus(400);
});

module.exports = app;
