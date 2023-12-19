import { UserDatabase } from "../database/UserDatabase";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/user/login.dto";
import { SignUpInputDTO, SignUpOutputDTO } from "../dtos/user/signUp.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { TokenPayload, USER_ROLES, User } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) { }

  // regras de negocio

  public signup = async (input: SignUpInputDTO): Promise<SignUpOutputDTO> => {

    const { name, email, password } = input
    const id = this.idGenerator.generate()

    const hashedPassword = await this.hashManager.hash(password)

    const user = new User(
      id,
      name,
      email,
      hashedPassword,
      USER_ROLES.NORMAL,
      new Date().toISOString()
    )

    const userDB = user.toDBModel()
    await this.userDatabase.insertUser(userDB)

    const payload: TokenPayload = {
      id: user.getId(),
      name: user.getName(),
      role: user.getRole()
    }

    const token = this.tokenManager.createToken(payload)

    const output: SignUpOutputDTO = {
      token
    }

    return output
  }

  public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {

    const { email, password } = input

    const UserDB = await this.userDatabase.findUserByEmail(email)

    if (!UserDB) {
      throw new NotFoundError("Email não possui cadastro")
    }

    const user = new User(
      UserDB.id,
      UserDB.name,
      UserDB.email,
      UserDB.password,
      UserDB.role,
      UserDB.created_at,
    )

    const hashedPassword = user.getPassword()
    const isPasswordCorrect = await this.hashManager.compare(password, hashedPassword)

    if (!isPasswordCorrect) {
      throw new BadRequestError("Senha incorreta")
    }

    const payload: TokenPayload = {
      id: user.getId(),
      name: user.getName(),
      role: user.getRole()
    }

    const token = this.tokenManager.createToken(payload)

    const output: LoginOutputDTO = {
      token
    }

    return output
  }
}