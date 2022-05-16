const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

// RETORNA TODOS OS PRODUTOS
router.get("/", (req, res, next) => {
    res.status(200).send({
        menssagem: "Retorna todos os produtos",
    });
});

// INSERIR UM PRODUTO
router.post("/", (req, res, next) => {
    mysql.getConnection((error, conn) => {
        conn.query(
            "INSERT INTO produtos (nome, preco, quantidade) VALUE (?,?,?)",
            [req.body.nome, req.body.preco, req.body.quantidade],
            (error, resultado, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null,
                    });
                }
                res.status(201).send({
                    menssagem: "Produto inserido com sucesso",
                    id_produto: resultado.insertId,
                });
            }
        );
    });
});

// RETORNA OS DADOS DE UM PRODUTO
router.get("/:id_produto", (req, res, next) => {
    const id = req.params.id_produto;

    if (id === "especial") {
        res.status(200).send({
            menssagem: "Você descobriu o ID epecial",
            id_produto: id,
        });
    } else {
        res.status(200).send({
            menssagem: "Você passou um ID",
        });
    }
});

// ALTERA UM PRODUTO
router.patch("/", (req, res, next) => {
    res.status(201).send({
        menssagem: "O produto foi atualizado",
    });
});

// EXCLUI UM PRODUTO
router.delete("/", (req, res, next) => {
    res.status(201).send({
        menssagem: "Produto excluido",
    });
});

module.exports = router;
