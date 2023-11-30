import { PostsDatabase } from "../database/PostsDatabase";
import { CreatePostsInputDTO, CreatePostsOutputDTO } from "../dtos/posts/createPosts.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/posts/getPosts.dto";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostsBusiness {
    constructor(
        private postsDatabase: PostsDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    // regras de negocio
    public createPost = async (
        input: CreatePostsInputDTO
    ): Promise<CreatePostsOutputDTO> => {
        const { content, token } = input

        const payload = this.tokenManager.getPayload(token)

        if(!payload){
            throw new UnauthorizedError("Token inválido!")
        }

        const id = this.idGenerator.generate()

        const post = new Post (
            id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            payload.id,
            payload.name
        )

        const postDB = post.toDBModel()
        await this.postsDatabase.insertPost(postDB)
    }

    public getPosts = async (
        input: GetPostsInputDTO
    ): Promise<GetPostsOutputDTO> => {
        const { token } = input

        const payload = this.tokenManager.getPayload(token)

        if(!payload){
            throw new UnauthorizedError("Token inválido!")
        }

        const postsWithCreatorName = await this.postsDatabase.getPostsWithCreatorName()
        
        const posts = postsWithCreatorName
        .map((postsWithCreatorName)=>{
            const post = new Post(
                postsWithCreatorName.id,
                postsWithCreatorName.content,
                postsWithCreatorName.likes,
                postsWithCreatorName.dislikes,
                postsWithCreatorName.created_at,
                postsWithCreatorName.updated_at,
                postsWithCreatorName.creator_id,
                postsWithCreatorName.creator_name
            )

            return post.toBusinessModel()
        })

        const output:GetPostsOutputDTO = posts
        return output
    }
}