const express = require("express");
const router = express.Router();
const login = require("../middleware/login");
const TitulosControllers = require("../controllers/titulosConstrollers");

// RETORNA TODOS OS TITULOS
router.get("/", TitulosControllers.getTitulos);
// INSERIR UM TITULO
router.post("/", login, TitulosControllers.postTitulos);
// RETORNA OS DADOS DE UM TITULO
router.get("/:id_titulo", TitulosControllers.getTitulosId);
// EXCLUI UM TITULO
router.delete("/", TitulosControllers.deleteTitulo);
// ALTERA UM TITULO
router.patch("/", TitulosControllers.patchTitulo);

module.exports = router;
