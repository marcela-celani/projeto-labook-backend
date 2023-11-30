import { Request, Response } from "express"
import { PostsBusiness } from "../business/PostsBusiness"
import { ZodError } from "zod"
import { BaseError } from "../errors/BaseError"
import { CreatePostsSchema } from "../dtos/posts/createPosts.dto"


export class PostsController {
  constructor(
    private postsBusiness: PostsBusiness
  ) { }

  //endpoints requisiçao
    public createPost = async (req:Request, res: Response) => {
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
        } else if(error instanceof BaseError) {
          res.status(error.statusCode).send(error.message)
        } else {
          res.status(500).send("Erro inesperado!")
        }
      }
    }
}