export const Roles = {
    ADMIN: 0,
    MEDICO: 1,
    ENFERMEIRO: 2,
    PADRAO: 3,
    RH: 4,
    PS: 5,
    TRIAGEM: 6,
} as const;

export type RolesType = typeof Roles[keyof typeof Roles];