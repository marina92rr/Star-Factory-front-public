/**
 * @description Boton para abrir el modal de asignacion de etiquetas a un cliente.
 * Se muestra en la pagina de detalle del cliente junto a sus etiquetas actuales.
 * @returns {JSX.Element} Boton para gestionar etiquetas del cliente
 */
import { useLabelsStore } from "../../../hooks/useLabelsStore";
import { useUiStore } from "../../../hooks/useUiStore"


export const Labels = () => {
    const {openLabelModal} = useUiStore();   //Abrir modal
    const {setActiveLabel} = useLabelsStore();

    const handleClickNew = () =>{
        setActiveLabel({
            nameLabel: '',
            color: '',
        })
        openLabelModal();
    }

  return (
    <button
        className="btn btn-outline-dark btn-sm py-0"
        style={{ borderRadius: '25px', fontSize: '1rem' }}
        onClick={handleClickNew}>
        <i className="bi bi-pencil-square me-2"></i>
        Etiquetas
    </button>
  )
}
