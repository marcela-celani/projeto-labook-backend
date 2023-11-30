import { PostsDatabase } from "../database/PostsDatabase";
import { CreatePostsInputDTO, CreatePostsOutputDTO } from "../dtos/posts/createPosts.dto";
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
}