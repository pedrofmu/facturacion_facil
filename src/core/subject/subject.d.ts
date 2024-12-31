// F => Persona fisica
// L => persona juridica o entidad
const enum PersonType {
    F = 'F',
    J = 'L',
}

type Subject = {
    // Datos del tex identification
    personType: PersonType,
    residentType
    id: string,
    // datos del individuo
    name: string,
    address: string,
    postCode: string,
    town: string,
    province: string,
    contact: string
}
