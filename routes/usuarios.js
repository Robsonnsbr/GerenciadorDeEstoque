const express = require("express");
const router = express.Router();
const UsuarioControllers = require("../controllers/usuariosConstrollers");

router.post("/cadastro", UsuarioControllers.cadastroUsuario);

router.post("/login", UsuarioControllers.loginUsuario);

module.exports = router;
