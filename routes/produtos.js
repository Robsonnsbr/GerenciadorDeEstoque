const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const multer = require("multer");
const login = require("../middleware/login");

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
router.get("/", (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query(
            `SELECT nome, preco, quantidade, SUM(quantidade) AS total FROM produtos;`,
            (error, result, field) => {
                if (error) {
                    return res.status(500).send({ error: error });
                }
                const response = {
                    quantidade: result.length,
                    produtos: result.map((prod) => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            quantidade: prod.quantidade,
                            quantidade_Total: prod.total,
                            request: {
                                tipo: "GET",
                                descricao:
                                    "Retorna os detalhes de um produto específico",
                                url:
                                    "http://localhost:3000/produtos/" +
                                    prod.id_produto,
                            },
                        };
                    }),
                };
                return res.status(200).send(response);
            }
        );
    });
});

// INSERIR UM PRODUTO
router.post("/", upload.single("produto_imagem"), login, (req, res, next) => {
    console.log(req.file);
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query(
            "INSERT INTO produtos (nome, preco, quantidade) VALUE (?,?,?)",
            [req.body.nome, req.body.preco, req.body.quantidade],
            (error, result, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({ error: error });
                }
                const response = {
                    mensagem: "Produto inserido com sucesso",
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        quantidade: req.body.quantidade,
                        request: {
                            tipo: "POST",
                            descricao: "Insere um produto",
                            url: "http://localhost:3000/produtos",
                        },
                    },
                };
                return res.status(201).send(response);
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
            (error, result, field) => {
                if (error) {
                    return res.status(500).send({ error: error });
                }
                if (result.length === 0) {
                    return res.status(404).send({
                        mensagem: "Não foi encontrado produto com esse ID",
                    });
                }
                const response = {
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        quantidade: result[0].quantidade,
                        request: {
                            tipo: "GET",
                            descricao: "Retorna todos os produtos",
                            url: "http://localhost:3000/produtos",
                        },
                    },
                };
                return res.status(201).send(response);
            }
        );
    });
});

// ALTERA UM PRODUTO
router.patch("/", login, (req, res, next) => {
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
            (error, result, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({ error: error });
                }
                const response = {
                    mensagem: "Produto atualizado com sucesso!",
                    produtoAtualizado: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        quantidade: req.body.quantidade,
                        request: {
                            tipo: "GET",
                            descricao:
                                "Retorna os detalhes de um produto específico",
                            url:
                                "http://localhost:3000/produtos/" +
                                req.body.id_produto,
                        },
                    },
                };
                return res.status(202).send(response);
            }
        );
    });
});

// EXCLUI UM PRODUTO
router.delete("/", login, (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query(
            `DELETE FROM produtos WHERE id_produto = ?`,
            [req.body.id_produto],
            (error, result, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({ error: error });
                }
                const response = {
                    mensagem: "Produto removido com sucesso",
                    request: {
                        tipo: "POST",
                        descricao: "Insere um produto",
                        url: "http://localhost:3000/produtos",
                        body: {
                            nome: "String",
                            preco: "Number",
                            quantidade: "Number",
                        },
                    },
                };
                return res.status(202).send(response);
            }
        );
    });
});

module.exports = router;
