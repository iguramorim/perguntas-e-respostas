import express from "express";
import bodyParser from "body-parser";
import connection from "./database/database.js";
import Pergunta from "./database/Perguntas.js";
import Resposta from "./database/Resposta.js";

connection
  .authenticate()
  .then(() => {
    console.log("✅ Conectado ao banco de dados com sucesso!");
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar ao banco de dados:", err);
  });

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 🛡️ Rota segura para listar perguntas
app.get("/", async (req, res) => {
  try {
    const perguntas = await Pergunta.findAll({
      raw: true,
      order: [["id", "DESC"]],
    });
    res.render("index", { perguntas });
  } catch (err) {
    console.error("❌ Erro ao buscar perguntas:", err);
    res.status(500).send("Erro ao carregar perguntas");
  }
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
  var title = req.body.titulo;
  var description = req.body.descricao;
  Pergunta.create({
    titulo: title,
    descricao: description,
  })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/salvarresposta", (req, res) => {
  var corpo = req.body.corpo;
  var perguntaId = req.body.perguntaId;
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId,
  })
    .then(() => {
      res.redirect("/pergunta/" + perguntaId);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/pergunta/:id", (req, res) => {
  var id = req.params.id;
  Pergunta.findOne({
    where: { id: id },
  }).then((pergunta) => {
    if (pergunta) {
      Resposta.findAll({
        where: {
          perguntaId: pergunta.id,
        },
        order: [["id", "DESC"]],
      }).then((respostas) => {
        res.render("pergunta", { pergunta, respostas: respostas });
      });
    } else {
      res.redirect("/");
    }
  });
});

app.listen(3000, () => console.log("Server rodando"));

// 1:09:18 aula
