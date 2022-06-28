const mysql = require("../mysql").pool;
const data = new Date();
const dia = String(data.getDate()).padStart(2, "0");
const mes = String(data.getMonth() + 1).padStart(2, "0");
const mes1 = String(data.getMonth() + 2).padStart(2, "0");
const ano = String(data.getFullYear());
const dataAtual = `${ano}${mes}${dia}`;
const dataVencimento = `${ano}${mes1}${dia}`;

exports.getTitulos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query("select * from titulos", (error, result, field) => {
            if (error) {
                return res.status(500).send({ error: error });
            }
            const response = {
                titulos: result.map((titulo) => {
                    return {
                        id_titulo: titulo.id_pedido,
                        id_pedido: titulo.qt_pedido,
                        valorTitulo: titulo.valor_titulo,
                        valorAberto: titulo.valor_aberto,
                        data: { dt_registro: Date },
                        vencimento: { dt_vencimento: Date },
                        // Status: { estado: enum },
                    };
                }),
            };
            return res.status(200).send(response);
        });
    });
};

exports.postTitulos = (req, res, next) => {
    console.log(req.usuario);
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query(
            "SELECT * FROM pedidos WHERE id_pedido = ?",
            [req.body.id_pedido],
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
                    `INSERT INTO titulos 
                    (id_pedido, valor_titulo, valor_aberto, 
                        dt_registro, dt_vencimento) 
                        VALUE (?,?,?,${dataAtual},${dataVencimento});`,
                    [
                        req.body.id_pedido,
                        req.body.valor_titulo,
                        req.body.valor_titulo,
                        (req.body.valor_aberto = req.body.valor_titulo),
                    ],
                    (error, result, field) => {
                        conn.release();
                        if (error) {
                            return res.status(500).send({ error: error });
                        }
                        const response = {
                            mensagem: "Titulo gerado com sucesso",
                            tituloCriado: {
                                id_usuario: req.usuario.id_usuario,
                                id_pedido: req.body.id_pedido,
                                valor_titulo: req.body.valor_titulo,
                                dataAtual: dataAtual,
                                dataVencimento: dataVencimento,
                            },
                        };
                        return res.status(201).send(response);
                    }
                );
            }
        );
    });
};

exports.getTitulosId = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query(
            "SELECT * FROM titulos WHERE id_titulo = ?",
            [req.params.id_titulo],
            (error, result, field) => {
                if (error) {
                    return res.status(500).send({ error: error });
                }
                if (result.length === 0) {
                    return res.status(404).send({
                        mensagem: "Não foi encontrado titulo com esse ID",
                    });
                }
                const response = {
                    titulo: {
                        id_titulo: result[0].id_titulo,
                        id_pedido: result[0].id_pedido,
                        valorTirulo: result[0].valor_titulo,
                        vallrAberto: result[0].valor_aberto,
                        data: result[0].dt_registro,
                        vencimento: result[0].dt_vencimento,
                    },
                };
                return res.status(201).send(response);
            }
        );
    });
};

exports.deleteTitulo = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query(
            `DELETE FROM titulos WHERE id_titulo = ?`,
            [req.body.id_titulo],
            (error, result, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({ error: error });
                }
                const response = {
                    mensagem: "Titulo removido com sucesso",
                };
                return res.status(202).send(response);
            }
        );
    });
};

exports.patchTitulo = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query(
            `UPDATE titulos
                SET valor_aberto    = ?,
                    estatus         = ?
                    WHERE id_titulo = ?`,
            [req.body.valor_aberto, req.body.estatus, req.body.id_titulo],
            (error, result, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({ error: error });
                }
                const response = {
                    mensagem: "Titulo atualizado com sucesso!",
                    TituloAtualizado: {
                        id_titulo: req.body.id_titulo,
                        valor_titulo: req.body.valor_titulo,
                        valor_aberto: req.body.valor_aberto,
                        estatus: req.body.estatus,
                    },
                };
                return res.status(202).send(response);
            }
        );
    });
};
