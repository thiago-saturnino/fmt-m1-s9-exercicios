const express = require("express");
const connection = require("./src/database");
const Place = require("./src/models/place");

const app = express();

app.use(express.json()); //obrigatório

connection.authenticate();
connection.sync({ alter: true });

app.post("/places", async (request, response) => {
  try {
    const data = {
      name: request.body.name,
      contact: request.body.contact,
      opening_hours: request.body.opening_hours,
      description: request.body.description,
      latitude: request.body.latitude,
      longitude: request.body.longitude,
    };

    const place = await Place.create(data);

    response.status(201).json(place);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Não possivel concluir a operação" });
  }
});

app.get("/places", async (request, response) => {
  try {
    const places = await Place.findAll();
    return response.json(places);
  } catch (error) {}
});

app.delete("/places/:id", async (request, response) => {
  const id = request.params.id;
  try {
    const place = await Place.findOne({ where: { id: id } });
    if (!place) {
      return response.status(404).json({ message: "Local não encontrado" });
    }
    await place.destroy();

    response.json({ message: "Local exluído com sucesso" });
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: "Erro ao excluir local" });
  }
});

app.put("/places/:id", async (request, response) => {
  try {
    const place = await Place.findByPk(request.params.id);
    if (!place) {
      response.status(404).send("Local não encontrado.");
    } else {
      await place.update({
        name: request.body.name || place.name,
        telephone_number:
          request.body.telephone_number || place.telephone_number,
        opening_hours: request.body.opening_hours || place.opening_hours,
        description: request.body.description || place.description,
        latitude_degrees:
          request.body.latitude_degrees || place.latitude_degrees,
        longitude_degrees:
          request.body.longitude_degrees || place.longitude_degrees,
      });
      response.json(place);
    }
  } catch (error) {
    console.error(error);
    response.status(500).send("Ocorreu um erro ao atualizar o local.");
  }
});

app.listen(3332, () => {
  console.log("Servidor online 🏃");
});
