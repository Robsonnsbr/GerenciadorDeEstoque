const express = require("express");
const router = express.Router();
const login = require("../middleware/login");
const movController = require("../controllers/movConstrollers");

// RETORNA TODOS as MOVIMENTACOES
router.get("/", movController.getMovimentacao);
// INSERIR UMA MOVIMENTACAO
router.post("/", login, movController.postMovimentacao);
// RETORNA UMA MOVIMENTACOES
router.get("/:id_mov", movController.getMovimentacaoId);

module.exports = router;
