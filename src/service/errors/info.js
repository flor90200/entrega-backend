export const generateErrorInfo = product => {
   
    return `Uno o mas properties estan incompletos o son invalidos.
    Lista de propiedades obligatorias:
    - Title: Colocar titulo. (${product.title})
    - Price: Colocar Price. (${product.price})
    `
}