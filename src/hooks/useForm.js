/**
 * @description Hook personalizado para la gestion de formularios con validacion.
 * Gestiona el estado del formulario, los cambios en los inputs, el reseteo
 * y la validacion automatica de campos segun las reglas proporcionadas.
 *
 * @param {Object} initialForm - Valores iniciales del formulario (claves = nombres de campo)
 * @param {Object} formValidations - Reglas de validacion. Cada clave es un nombre de campo
 *   y su valor es un array [funcion_validadora, mensaje_error].
 *
 * @returns {Object} Objeto que contiene:
 *   - ...formState: todos los valores del formulario desestructurados
 *   - formState: objeto completo del estado del formulario
 *   - onInputChange: handler para onChange de inputs
 *   - onResetForm: funcion para resetear el formulario a los valores iniciales
 *   - ...formValidation: errores de validacion (campo + 'Valid', null si valido)
 *   - isFormValid: booleano que indica si todo el formulario es valido
 */

import { useEffect, useMemo, useState } from "react";

export const useForm = (initialForm = {}, formValidations = {}) => {

  const [formState, setFormState] = useState(initialForm);
  const [formValidation, setFormValidation] = useState({});

  useEffect(() => {
    createValidators();
  }, [formState])

  useEffect(() => {
    setFormState(initialForm);
  }, [initialForm])


  const isFormValid = useMemo(() => {

    for (const formValue of Object.keys(formValidation)) {
      if (formValidation[formValue] !== null) return false;
    }

    return true;
  }, [formValidation])


  const onInputChange = ({ target }) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value
    });
  }

  const onResetForm = () => {
    setFormState(initialForm);
  }

  const createValidators = () => {

    const formCheckedValues = {};

    for (const formField of Object.keys(formValidations)) {
      const [fn, errorMessage] = formValidations[formField];

      formCheckedValues[`${formField}Valid`] = fn(formState[formField]) ? null : errorMessage;
    }

    setFormValidation(formCheckedValues);
  }


  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm,
    
    ...formValidation,
    isFormValid,
  };
};
