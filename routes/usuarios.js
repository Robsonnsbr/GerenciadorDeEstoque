const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");
const Connection = require("mysql/lib/Connection");

router.post("/cadastro", (req, res, next) => {
    mysql.getConnection((err, conn) => {
        if (err) {
            return res.status(500).send({ error: error });
        }
        conn.query(
            "SELECT * FROM usuarios WHERE email = ?",
            [req.body.email],
            (error, results) => {
                if (error) {
                    return res.status(500).send({ error: error });
                }
                if (results.length > 0) {
                    res.status(401).send({
                        menssagem: "Usuário já cadastrado",
                    });
                } else {
                    bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                        if (errBcrypt) {
                            return res.status(500).send({ error: errBcrypt });
                        }
                        conn.query(
                            `INSERT INTO usuarios (email, senha) VALUES (?,?)`,
                            [req.body.email, hash],
                            (error, results) => {
                                conn.release();
                                if (error) {
                                    return res
                                        .status(500)
                                        .send({ error: error });
                                }
                                response = {
                                    menssagem: "Usuário criado com sucesso",
                                    usuarioCriado: {
                                        id_usuario: results.insertId,
                                        email: req.body.email,
                                    },
                                };
                                return res.status(201).send(response);
                            }
                        );
                    });
                }
            }
        );
    });
});

router.post("/login", (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error });
        }
        const query = `SELECT * FROM usuarios WHERE email = ?`;
        conn.query(query, [req.body.email], (error, results, fields) => {
            conn.release();
            if (error) {
                return res.status(500).send({ error: error });
            }
            if (results.length < 1) {
                return res
                    .status(401)
                    .send({ menssagem: "Falha na autenticação" });
            }
            bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
                if (err) {
                    return res
                        .status(401)
                        .send({ menssagem: "Falha na autenticação" });
                }
                if (result) {
                    return res
                        .status(200)
                        .send({ menssagem: "Autenticado com sucesso" });
                }
                return res
                    .status(401)
                    .send({ menssagem: "Falha na autenticação" });
            });
        });
    });
});

module.exports = router;
