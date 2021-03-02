const { response, request } = require('express');

const esAdminRole = (req = request, res = response, next) => {


    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primnero'
        });
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede realizar la acción`
        });
    }


    next();

}

const tieneRole = ( ...roles) => {
    return (req = request, res = response, next) => {
        

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primnero'
            });
        }
        const { rol } = req.usuario;
        if (!roles.includes(rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            });
        }
        next();
    }

}


module.exports = {
    esAdminRole,
    tieneRole
}