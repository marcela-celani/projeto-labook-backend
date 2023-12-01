import z from 'zod'

export interface LikeOrDislikeInputDTO {
    token: string,
    like: boolean,
    postId: string
}

export type LikeOrDislikeOutputDTO = undefined

export const LikeOrDislikeSchema = z.object({
    token: z.string(),
    like: z.boolean(),
    postId: z.string().min(1)
}).transform(data => data as LikeOrDislikeInputDTO)