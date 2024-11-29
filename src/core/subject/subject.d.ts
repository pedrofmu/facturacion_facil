// F => Persona fisica
// L => persona juridica o entidad
const enum PersonType {
    F = 'F',
    L = 'L',
}

type subject = {
    // Datos del tex identification
    taxIdentificationName: string,
    personType: PersonType,
    id: string,
    // datos del individuo
    name: string,
    address: string,
    postCode: string,
    town: string,
    province: string,
    contact: string
}
