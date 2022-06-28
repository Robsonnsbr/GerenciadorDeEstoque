const mysql = require("../mysql").pool;
const data = new Date();
const dia = String(data.getDate()).padStart(2, "0");
const mes = String(data.getMonth() + 1).padStart(2, "0");
const mes1 = String(data.getMonth() + 2).padStart(2, "0");
const ano = String(data.getFullYear());
const dataAtual = `${ano}${mes}${dia}`;
const dataVencimento = `${ano}${mes1}${dia}`;

exports.getMovimentacao = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query("select * from movi_seq", (error, result, field) => {
            if (error) {
                return res.status(500).send({ error: error });
            }
            const response = {
                movi_seq: result.map((mov) => {
                    return {
                        id_mov: mov.id_pedido,
                        id_titulo: mov.qt_pedido,
                        data: mov.data,
                        valor: mov.valor_aberto,
                        tipo: mov.tipo_mov,
                    };
                }),
            };
            return res.status(200).send(response);
        });
    });
};

exports.postMovimentacao = (req, res, next) => {
    console.log(req.usuario);
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query(
            "SELECT * FROM titulos WHERE id_titulo = ?",
            [req.body.id_titulo],
            (error, result, field) => {
                if (error) {
                    return res.status(500).send({ error: error });
                }
                if (result.length === 0) {
                    return res.status(404).send({
                        mensagem: "Titulo não encontrado",
                    });
                }
                conn.query(
                    `INSERT INTO movi_seq 
                    (id_titulo, valor, tipo_mov) VALUE (?,?,?)`,
                    [req.body.id_titulo, req.body.valor, req.body.tipo_mov],
                    (error, result, field) => {
                        conn.release();
                        if (error) {
                            return res.status(500).send({ error: error });
                        }
                        const response = {
                            mensagem: "Movimentação gerada com sucesso",
                            movimentacaoCriada: {
                                id_titulo: req.body.id_titulo,
                                valor: req.body.valor,
                                tipo: req.body.tipo_mov,
                            },
                        };
                        return res.status(201).send(response);
                    }
                );
            }
        );
    });
};

exports.getMovimentacaoId = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        conn.query(
            "SELECT * FROM movi_seq WHERE id_mov = ?",
            [req.params.id_mov],
            (error, result, field) => {
                if (error) {
                    return res.status(500).send({ error: error });
                }
                if (result.length === 0) {
                    return res.status(404).send({
                        mensagem: "Não foi encontrada movimentacao com esse ID",
                    });
                }
                const response = {
                    mov: {
                        id_mov: result[0].id_mov,
                        id_titulo: result[0].id_titulo,
                        data: result[0].data,
                        valor: result[0].valor,
                        tipo: result[0].tipo_mov,
                    },
                };
                return res.status(201).send(response);
            }
        );
    });
};
