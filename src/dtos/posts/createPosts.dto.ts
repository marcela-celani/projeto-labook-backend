import z from 'zod'


export interface CreatePostsInputDTO {
    content: string
    token: string
}

export type CreatePostsOutputDTO = undefined

export const CreatePostsSchema = z.object({
    content: z.string().min(1).max(280),
    token: z.string()
}).transform(data => data as CreatePostsInputDTO)
