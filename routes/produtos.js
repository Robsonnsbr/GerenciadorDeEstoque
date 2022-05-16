const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

// RETORNA TODOS OS PRODUTOS
router.get("/", (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query("SELECT * FROM produtos;", (error, resultado, field) => {
            if (error) {
                return res.status(500).send({ error: error });
            }
            return res.status(200).send({ response: resultado });
        });
    });
});

// INSERIR UM PRODUTO
router.post("/", (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query(
            "INSERT INTO produtos (nome, preco, quantidade) VALUE (?,?,?)",
            [req.body.nome, req.body.preco, req.body.quantidade],
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({ error: error });
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
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query(
            "SELECT * FROM produtos WHERE id_produto = ?;",
            [req.params.id_produto],
            (error, resultado, field) => {
                if (error) {
                    return res.status(500).send({ error: error });
                }
                return res.status(200).send({ response: resultado });
            }
        );
    });
});

// ALTERA UM PRODUTO
router.patch("/", (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query(
            `UPDATE produtos
                SET nome             = ?, 
                    preco            = ?,
                    quantidade       = ?
                    WHERE id_produto = ?`,
            [
                req.body.nome,
                req.body.preco,
                req.body.quantidade,
                req.body.id_produto,
            ],
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({ error: error });
                }
                res.status(202).send({
                    menssagem: "Produto atualizado com sucesso",
                });
            }
        );
    });
});

// EXCLUI UM PRODUTO
router.delete("/", (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query(
            `DELETE FROM produtos WHERE id_produto = ?`,
            [req.body.id_produto],
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({ error: error });
                }
                res.status(202).send({
                    menssagem: "Produto excluido com sucesso",
                });
            }
        );
    });
});

module.exports = router;
