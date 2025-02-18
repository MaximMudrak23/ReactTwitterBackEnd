export interface User {
    id: string;
    username: string;
    password: string;
    birthDate: string;
    fullname: string,
    avatar: string | null,
    background: string | null,
    isUserConfirmed: boolean,
    isUserTwitterCreator: boolean,
    posts: {
        created: string[],
        liked: string[],
        saved: string[],
    }
}
