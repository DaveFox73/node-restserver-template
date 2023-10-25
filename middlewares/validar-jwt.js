const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uid);

        //el token puede ser válido, pero... el usuario lo pueden haber borrado
        if (!usuario) {
            return res.status(401).json({
                msg: 'Usuario no existe en BBDD'
            });
        }

        // verificar si el uid tiene estado true
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - usuario autenticado con estado no activo'
            });
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        const { name, expiredAt } = error;
        let message = '';

        switch (name) {
            case "JsonWebTokenError":
                message = 'La firma del token no es válida';
                break;
            case "TokenExpiredError":
                message = `El token expiró el ${new Date(expiredAt).toISOString()}`;
                break;
            default:
                message = 'Token no válido';
                break;
        }

        res.status(401).json({
            msg: message
        });
    }
}

module.exports = {
    validarJWT
}