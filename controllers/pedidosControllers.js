const mysql = require("../mysql").pool;
const data = new Date();
const dia = String(data.getDate()).padStart(2, "0");
const mes = String(data.getMonth() + 1).padStart(2, "0");
const ano = String(data.getFullYear());
const dataAtual = `${ano}${mes}${dia}`;

exports.getPedidos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query(
            `SELECT pedidos.id_pedido,
                           pedidos.id_usuario,
                           pedidos.qt_pedido, 
                           produtos.id_produto, 
                           produtos.nome, 
                           produtos.preco,
                           produtos.qt_produto
                      FROM pedidos 
                INNER JOIN produtos 
                        ON produtos.id_produto = pedidos.id_produto;`,
            (error, result, field) => {
                if (error) {
                    return res.status(500).send({ error: error });
                }
                const response = {
                    pedidos: result.map((pedido) => {
                        return {
                            id_pedido: pedido.id_pedido,
                            QtPedido: pedido.qt_pedido,
                            produto: {
                                id_produto: pedido.id_produto,
                                nome: pedido.nome,
                                preco: pedido.preco,
                                Qtproduto: pedido.qt_produto,
                            },
                            request: {
                                tipo: "GET",
                                descricao:
                                    "Retorna os detalhes de um pedido específico",
                                url:
                                    "http://localhost:3000/pedidos/" +
                                    pedido.id_pedido,
                            },
                        };
                    }),
                };
                return res.status(200).send(response);
            }
        );
    });
};

exports.postPedidos = (req, res, next) => {
    console.log(req.usuario);
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query(
            "SELECT nome, preco, qt_produto FROM produtos WHERE id_produto = ?",
            [req.body.id_produto],
            (error, result, field) => {
                if (error) {
                    return res.status(500).send({ error: error });
                }
                if (result.length === 0) {
                    return res.status(404).send({
                        mensagem: "Produto não encontrado",
                    });
                }
                conn.query(
                    `INSERT INTO pedidos (id_usuario, id_produto, qt_pedido, dt_pedido) VALUE (?,?,?,${dataAtual})`,
                    [
                        req.usuario.id_usuario,
                        req.body.id_produto,
                        req.body.qt_pedido,
                        req.body.dt_pedido,
                    ],
                    (error, result, field) => {
                        conn.release();
                        if (error) {
                            return res.status(500).send({ error: error });
                        }
                        const response = {
                            mensagem: "Pedido inserido com sucesso",
                            pedidoCriado: {
                                id_usuario: req.usuario.id_usuario,
                                id_pedido: result.id_pedido,
                                id_produto: req.body.id_produto,
                                quantidade: req.body.qt_pedido,
                                data: result.dt_pedido,
                                request: {
                                    tipo: "GET",
                                    descricao: "Retorna todos os pedidos",
                                    url: "http://localhost:3000/pedidos",
                                },
                            },
                        };
                        return res.status(201).send(response);
                    }
                );
            }
        );
    });
};

exports.getPedidosId = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query(
            "SELECT * FROM pedidos WHERE id_pedido = ?",
            [req.params.id_pedido],
            (error, result, field) => {
                if (error) {
                    return res.status(500).send({ error: error });
                }
                if (result.length === 0) {
                    return res.status(404).send({
                        mensagem: "Não foi encontrado pedido com esse ID",
                    });
                }
                const response = {
                    pedido: {
                        id_pedido: result[0].id_pedido,
                        id_produto: result[0].id_produto,
                        quantidade: result[0].qt_pedido,
                        request: {
                            tipo: "GET",
                            descricao: "Retorna todos os pedidos",
                            url: "http://localhost:3000/pedidos",
                        },
                    },
                };
                return res.status(201).send(response);
            }
        );
    });
};

exports.deletePedido = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query(
            `DELETE FROM pedidos WHERE id_pedido = ?`,
            [req.body.id_pedido],
            (error, result, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({ error: error });
                }
                const response = {
                    mensagem: "Pedido removido com sucesso",
                    request: {
                        tipo: "POST",
                        descricao: "Insere um pedido",
                        url: "http://localhost:3000/pedidos",
                        body: {
                            id_produto: "Number",
                            quantidade: "Number",
                        },
                    },
                };
                return res.status(202).send(response);
            }
        );
    });
};
