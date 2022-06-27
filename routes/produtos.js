const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const multer = require("multer");
const login = require("../middleware/login");
const ProdutosController = require("../controllers/produtosControllers");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    },
});
const upload = multer({ storage: storage });

// RETORNA TODOS OS PRODUTOS
router.get("/", ProdutosController.getProdutos);
// INSERIR UM PRODUTO
router.post("/", login, ProdutosController.postProdutos);
// RETORNA OS DADOS DE UM PRODUTO
router.get("/:id_produto", ProdutosController.getProdutosId);
// ALTERA UM PRODUTO
router.patch("/", login, ProdutosController.patchProduto);
// EXCLUI UM PRODUTO
router.delete("/", login, ProdutosController.deleteProduto);

module.exports = router;
