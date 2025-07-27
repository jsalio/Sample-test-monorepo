export interface AppResponse<T> {
    success: boolean
    data: T
    message: string
    token?: string
}

export interface LoginData {
    username: string
    email: string
    createdAt: string
}

export interface UserWithoutPwd {
    username: string
    email: string
    createdAt: Date
}
