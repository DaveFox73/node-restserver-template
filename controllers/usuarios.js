const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { validate } = require('../models/usuario');


const usuariosGet = async(req = request, res = response) => {

    const query = { estado: true };

    const { limite = 5, desde = 0 } = req.query;

    //const total = await Usuario.countDocuments(query);

    // El await es una instrucción bloqueante

    //const usuarios = await Usuario.find( query )
    //    .limit( Number( isNaN ( limite )? 5: limite) )
    //    .skip( Number( isNaN( desde )? 0 : desde) );


    // una forma de agrupar varias promesas en una
    // promise.all() permie enviar un arreglo con todas las promesas a ejecutar
    // y devuelve una colección de las n promesas que se han ejecutado
    // desestructuración de arreglos (no de objetos)
    // el primer resultado será el total y el segundo los usuarios (según filtro en ambos casos)
    const [total, usuarios] = await Promise.all(
        [
            Usuario.countDocuments(query),
            Usuario.find(query)
            .limit(Number(isNaN(limite) ? 5 : limite))
            .skip(Number(isNaN(desde) ? 0 : desde))
        ]
    );

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req = request, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar password
    const salt = bcryptjs.genSaltSync(11);
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosPut = async(req = request, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;


    // TODO validar contra base de datos
    if (password) {
        // Encriptar password
        const salt = bcryptjs.genSaltSync(11);
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);
    // Para llamar a este método findByIdAndUpdate en la conexión de mongo en \database\config.js al
    // realizar la conexión este parámetro debe estar indicado: useFindAndModify: false

    res.json({
        msg: 'put API - controlador',
        usuario
    });
}
const usuariosPatch = (req = request, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });
}
const usuariosDelete = async(req = request, res = response) => {
    const { id } = req.params;
    //const usuarioAutenticado = req.usuario;

    //const uid = req.uid;

    // Borrado físico:
    // const usuario = await Usuario.findByIdAndDelete(id);

    // Borrado "lógico":
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        usuario
        //,usuarioAutenticado
        //,
        //uid
    });
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}