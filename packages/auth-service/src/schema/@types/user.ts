import { UserSignInSchema, UsersignUpSchema } from "../user-schema";

export type UsersignUpSchemType = ReturnType<typeof UsersignUpSchema.parse>;
export type UsersignInSchemType = ReturnType<typeof UserSignInSchema.parse>;
