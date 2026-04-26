/**
 * @description Punto de entrada principal de la aplicacion.
 * Monta el componente raiz StarFactoryApp dentro de StrictMode en el elemento #root del DOM.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './animations.css'
import { StarFactoryApp } from './StarFactoryApp'
import 'bootstrap/dist/css/bootstrap.min.css';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StarFactoryApp/>
  </StrictMode>
)
