import z from 'zod'

export interface LoginInputDTO {
    email: string,
    password: string
}

export interface LoginOutputDTO {
    token: string
}

export const SignUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})