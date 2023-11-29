import { UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
  public static TABLE_USERS = "users"

  public async findUsers(
    q: string | undefined
  ): Promise<UserDB[]> {
    let usersDB

    if (q) {
      const result: UserDB[] = await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .where("name", "LIKE", `%${q}%`)

      usersDB = result
    } else {
      const result: UserDB[] = await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)

      usersDB = result
    }

    return usersDB
  }