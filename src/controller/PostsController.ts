import { Request, Response } from "express"
import { PostsBusiness } from "../business/PostsBusiness"
import { ZodError } from "zod"
import { BaseError } from "../errors/BaseError"
import { CreatePostsSchema } from "../dtos/posts/createPosts.dto"
import { GetPostsSchema } from "../dtos/posts/getPosts.dto"
import { EditPostsSchema } from "../dtos/posts/editPosts.dto"
import { DeletePostsSchema } from "../dtos/posts/deletePosts.dto"
import { LikeOrDislikeSchema } from "../dtos/posts/likeOrDislike.dto"


export class PostsController {
  constructor(
    private postsBusiness: PostsBusiness
  ) { }

  //endpoints requisiçao
  public createPost = async (req: Request, res: Response) => {
    try {
      const input = CreatePostsSchema.parse({
        content: req.body.content,
        token: req.headers.authorization
      })

      const output = await this.postsBusiness.createPost(input)
      res.status(201).send(output)

    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado!")
      }
    }
  }

  public getPosts = async (req: Request, res: Response) => {
    try {
      const input = GetPostsSchema.parse({
        token: req.headers.authorization
      })

      const output = await this.postsBusiness.getPosts(input)
      res.status(201).send(output)

    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado!")
      }
    }
  }

  public editPost = async (req: Request, res: Response) => {
    try {
      const input = EditPostsSchema.parse({
        content: req.body.content,
        token: req.headers.authorization,
        idToEdit: req.params.id
      })

      const output = await this.postsBusiness.editPost(input)
      res.status(200).send(output)

    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado!")
      }
    }
  }

  public deletePost = async (req: Request, res: Response) => {
    try {
      const input = DeletePostsSchema.parse({
        token: req.headers.authorization,
        idToEdit: req.params.id
      })

      const output = await this.postsBusiness.deletePost(input)
      res.status(200).send(output)

    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado!")
      }
    }
  }

  public likeOrDislikePost = async (req: Request, res: Response) => {
    try {
      const input = LikeOrDislikeSchema.parse({
        like: req.body.like,
        token: req.headers.authorization,
        postId: req.params.id
      })

      const output = await this.postsBusiness.likeOrDislikePost(input)
      res.status(200).send(output)

    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado!")
      }
    }
  }
}