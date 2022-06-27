const mysql = require("../mysql").pool;
const data = new Date();
const dia = String(data.getDate()).padStart(2, "0");
const mes = String(data.getMonth() + 1).padStart(2, "0");
const ano = String(data.getFullYear());
const dataAtual = `${ano}${mes}${dia}`;

exports.getProdutos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query(
            `SELECT nome, preco, qt_produto, SUM(qt_produto) AS total FROM produtos;
            `,
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
                            quantidade: prod.qt_produto,
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
};

exports.postProdutos = (req, res, next) => {
    console.log(req.usuario);
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
};

exports.getProdutosId = (req, res, next) => {
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
};

exports.patchProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query(
            `UPDATE produtos
                SET nome             = ?, 
                    preco            = ?,
                    qt_produto       = ?
                    WHERE id_produto = ?`,
            [
                req.body.nome,
                req.body.preco,
                req.body.qt_produto,
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
                        QtProduto: req.body.qt_produto,
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
};

exports.deleteProduto = (req, res, next) => {
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
};
