import { PostDB, PostDBWithCreatorName } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostsDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts"
  public static TABLE_LIKES_DISLIKES = "likes_dislikes"
  // metodos database


  public insertPost = async (postDB: PostDB): Promise<void> => {
    await BaseDatabase
    .connection(PostsDatabase.TABLE_POSTS)
    .insert(postDB)
  }

  public getPostsWithCreatorName = async (): Promise<PostDBWithCreatorName[]> => {
    const postsDB = await BaseDatabase
    .connection(PostsDatabase.TABLE_POSTS)
    .select(
      `${PostsDatabase.TABLE_POSTS}.id`,
      `${PostsDatabase.TABLE_POSTS}.creator_id`,
      `${PostsDatabase.TABLE_POSTS}.content`,
      `${PostsDatabase.TABLE_POSTS}.likes`,
      `${PostsDatabase.TABLE_POSTS}.dislikes`,
      `${PostsDatabase.TABLE_POSTS}.created_at`,
      `${PostsDatabase.TABLE_POSTS}.updated_at`,
      `${UserDatabase.TABLE_USERS}.name as creator_name`
    ).join(
    `${UserDatabase.TABLE_USERS}`, 
    `${PostsDatabase.TABLE_POSTS}.creator_id`, 
    "=",
    `${UserDatabase.TABLE_USERS}.id`)
    
    return postsDB as PostDBWithCreatorName[]
  }

  public findPostById = async (id: string): Promise<PostDB | undefined> => {
    const [result] = await BaseDatabase
    .connection(PostsDatabase.TABLE_POSTS)
    .select()
    .where({ id })

    return result as PostDB | undefined
  }

  public updatePost = async (postDB:PostDB) => {
    await BaseDatabase
    .connection(PostsDatabase.TABLE_POSTS)
    .update(postDB)
    .where({ id: postDB.id })
  }

  public deletePostById =async (id:string): Promise<void> => {
    await BaseDatabase
    .connection(PostsDatabase.TABLE_POSTS)
    .delete()
    .where({ id })
  }
}