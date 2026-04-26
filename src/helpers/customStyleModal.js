/**
 * @description Estilos personalizados para los modales de react-modal.
 * Define el posicionamiento centrado del contenido y un overlay oscuro semi-transparente.
 * @type {Object}
 */
export const customStyleModal =  {

  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 9999,
  }

};

/** @description Timeout en milisegundos para la animacion de cierre de modales */
export const modalCloseTimeout = 200;
