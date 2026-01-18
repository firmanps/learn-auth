import { Request } from "express";

export function cookieJwtExtractor(req: Request): string | null{
    const token = req?.cookies?.token
    // console.log(token)
    return token ?? null
}