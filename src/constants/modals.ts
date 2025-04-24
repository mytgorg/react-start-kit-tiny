export const modals = {
    whatsapp: "whatsapp",
    paynow: "paynow", 
    qr: "qr",
    none: "none"
} as const;

export type ModalType = typeof modals[keyof typeof modals];