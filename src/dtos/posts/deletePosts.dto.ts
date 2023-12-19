import z from 'zod'

export interface DeletePostsInputDTO {
    token: string,
    idToEdit: string
}

export type DeletePostsOutputDTO = undefined

export const DeletePostsSchema = z.object({
    token: z.string(),
    idToEdit: z.string().min(1)
})