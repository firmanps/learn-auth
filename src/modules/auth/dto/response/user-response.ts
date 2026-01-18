export class RegisterResponse{
    id: string
    username: string

    static fromEntity(user: {id: string, username: string}): RegisterResponse{
        return{
            id: user.id,
            username: user.username
        }
    }

}