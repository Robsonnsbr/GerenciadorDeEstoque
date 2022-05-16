const express = require("express");
const router = express.Router();

// RETORNA TODOS OS PEDIDOS
router.get("/", (req, res, next) => {
    res.status(200).send({
        menssagem: "Retorna todos os peditos",
    });
});

// INSERIR UM PEDIDO
router.post("/", (req, res, next) => {
    const pedido = {
        id_pedido: req.body.id_pedido,
        quantidade: req.body.quantidade,
    };
    res.status(201).send({
        menssagem: "O Pedido foi criado",
        pedidoCriado: pedido,
    });
});

// RETORNA OS DADOS DE UM PEDIDO
router.get("/:id_pedido", (req, res, next) => {
    const id = req.params.id_pedido;
    res.status(200).send({
        menssagem: "Detalhes do pedido",
        id_pedido: id,
    });
});

// ALTERA UM PEDIDO
router.patch("/", (req, res, next) => {
    res.status(201).send({
        menssagem: "O Pedido foi atualizado",
    });
});

// EXCLUI UM PRODUTO
router.delete("/", (req, res, next) => {
    res.status(201).send({
        menssagem: "Pedido excluido",
    });
});

module.exports = router;
