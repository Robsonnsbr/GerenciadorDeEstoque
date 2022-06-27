const express = require("express");
const router = express.Router();
const login = require("../middleware/login");
const produtos = require("../controllers/produtosControllers");
const PedidosController = require("../controllers/pedidosControllers");

// RETORNA TODOS OS PEDIDOS
router.get("/", PedidosController.getPedidos);
// INSERIR UM PEDIDO
router.post("/", login, PedidosController.postPedidos);
// RETORNA OS DADOS DE UM PEDIDO
router.get("/:id_pedido", PedidosController.getPedidosId);
// EXCLUI UM PRODUTO
router.delete("/", PedidosController.deletePedido);
// ALTERA UM PEDIDO
// router.patch("/", (req, res, next) => {
//     res.status(201).send({
//         mensagem: "O Pedido foi atualizado",
//     });
// });
module.exports = router;
