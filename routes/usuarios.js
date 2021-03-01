
const {Router} = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet,
        usuariosPost,
        usuariosPut,
        usuariosPatch,
        usuariosDelete
    } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet );

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser de m�s de 6 caracteres').isLength({ min: 5 }),
    check('correo', 'El correo no es v�lido').isEmail(),    
    check('correo').custom( emailExiste ),    
    check('rol').custom( esRoleValido ), //tamib�n : check('rol').custom( (rol) => esRoleValido(rol) )
    validarCampos
], usuariosPost);

router.put('/:id', [
    check('id', 'No es un ID v�lido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido), 
    validarCampos
], usuariosPut);

router.patch('/', usuariosPatch );

router.delete('/:id', [
    check('id', 'No es un ID v�lido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

module.exports = router;