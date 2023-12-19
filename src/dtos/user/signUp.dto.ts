import z from 'zod'

export interface SignUpInputDTO {
    name: string,
    email: string,
    password: string
}

export interface SignUpOutputDTO {
    token: string
}

export const SignUpSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6)
}).transform(data => data as SignUpInputDTO)