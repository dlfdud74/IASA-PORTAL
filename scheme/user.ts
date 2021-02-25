import { Permission } from './api/auth'
import { Penalty } from './api/penalty'

export interface User {
    permission: Permission
    uid: number
    id: string
    pwHash: string
    email: string
    name: string
    penalty?: Penalty
    avatar?: string
    mail?: string[]
    unreadNotifications: number
}

export interface UserInfo {
    name: string
    uid: number
    type: Permission
}
