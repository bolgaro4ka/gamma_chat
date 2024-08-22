import passport from "passport"

export const SELECT_FIELDS = {
    id: true,
    email: true,
    username: true,
    first_name: true,
    last_name: true,
    avatar: true
}

export const USER_SELECT_FIELDS = {
    ...SELECT_FIELDS,
}

export const APP_USER_FIELDS = {
    ...USER_SELECT_FIELDS,
    password: true
}