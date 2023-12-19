import { PostsDatabase } from "../database/PostsDatabase";
import { CreatePostsInputDTO, CreatePostsOutputDTO } from "../dtos/posts/createPosts.dto";
import { DeletePostsInputDTO, DeletePostsOutputDTO } from "../dtos/posts/deletePosts.dto";
import { EditPostsInputDTO, EditPostsOutputDTO } from "../dtos/posts/editPosts.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/posts/getPosts.dto";
import { LikeOrDislikeInputDTO, LikeOrDislikeOutputDTO } from "../dtos/posts/likeOrDislike.dto";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { LikeDislikeDB, POST_LIKES, Post } from "../models/Post";
import { USER_ROLES } from "../models/User";
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

        if (!payload) {
            throw new UnauthorizedError("Token inválido!")
        }

        const id = this.idGenerator.generate()

        const post = new Post(
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

        if (!payload) {
            throw new UnauthorizedError("Token inválido!")
        }

        const postsWithCreatorName = await this.postsDatabase.getPostsWithCreatorName()

        const posts = postsWithCreatorName
            .map((postsWithCreatorName) => {
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

        const output: GetPostsOutputDTO = posts
        return output
    }

    public editPost = async (
        input: EditPostsInputDTO
    ): Promise<EditPostsOutputDTO> => {
        const { content, token, idToEdit } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError("Token inválido!")
        }

        const postDB = await this.postsDatabase.findPostById(idToEdit)

        if (!postDB) {
            throw new NotFoundError("Post com esta id não existe")
        }

        if (payload.id !== postDB.creator_id) {
            throw new ForbiddenError("Somente o criador do post pode editá-lo")
        }

        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at,
            payload.id,
            payload.name
        )

        post.setContent(content)

        const updatedPostDB = post.toDBModel()
        await this.postsDatabase.updatePost(updatedPostDB)

        const output: EditPostsOutputDTO = undefined
        return output
    }

    public deletePost = async (
        input: DeletePostsInputDTO
    ): Promise<DeletePostsOutputDTO> => {
        const { token, idToEdit } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError("Token inválido!")
        }

        const postDB = await this.postsDatabase.findPostById(idToEdit)

        if (!postDB) {
            throw new NotFoundError("Post com esta id não existe")
        }

        if (payload.role !== USER_ROLES.ADMIN) {

            if (payload.id !== postDB.creator_id) {
                throw new ForbiddenError("Somente o criador do post pode deletá-lo")
            }
        }

        await this.postsDatabase.deletePostById(idToEdit)

        const output: EditPostsOutputDTO = undefined
        return output
    }

    public likeOrDislikePost = async (
        input: LikeOrDislikeInputDTO
    ): Promise<LikeOrDislikeOutputDTO> => {
        const { token, postId, like } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError("Token inválido!")
        }

        const postsWithCreatorName = await this.postsDatabase.findPostWithCreatorNameById(postId)

        if(!postsWithCreatorName){
            throw new NotFoundError("Post com esta 'id' não existe")
        }

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

        const likeSqlite = like ? 1 : 0

        const likeDislikeDB: LikeDislikeDB = {
            user_id: payload.id,
            post_id: postId,
            like: likeSqlite
        }

        const likeDislikeExists = await this.postsDatabase.findLikeDislike(likeDislikeDB)

        if(likeDislikeExists === POST_LIKES.LIKED){
            if(like === true){
                await this.postsDatabase.removeLikeDislike(likeDislikeDB)
                post.removeLike()
            } else {
                await this.postsDatabase.updateLikeDislike(likeDislikeDB)
                post.removeLike()
                post.addDislike()
            }
        } else if (likeDislikeExists === POST_LIKES.DISLIKED) {
            if(like === false){
                await this.postsDatabase.removeLikeDislike(likeDislikeDB)
                post.removeDislike()
            } else {
                await this.postsDatabase.updateLikeDislike(likeDislikeDB)
                post.removeDislike()
                post.addLike()
            }
        } else {
            await this.postsDatabase.insertLikeDislike(likeDislikeDB)
            like ? post.addLike() : post.addDislike()
        }

        const updatedPostDB = post.toDBModel()
        await this.postsDatabase.updatePost(updatedPostDB)

        const output: LikeOrDislikeOutputDTO = undefined
        return output
    }
}