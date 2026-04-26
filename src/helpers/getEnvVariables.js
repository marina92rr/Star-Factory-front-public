/**
 * @description Obtiene y desestructura las variables de entorno de Vite (import.meta.env).
 * Permite acceder a las variables VITE_* definidas en el archivo .env.
 * @returns {Object} Objeto con todas las variables de entorno de Vite
 */
export const getEnvVariables = () =>{

    import.meta.env;        //Variables de entorno

    return {
        ...import.meta.env     
    }
}