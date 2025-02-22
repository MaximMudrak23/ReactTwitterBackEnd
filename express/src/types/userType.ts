export interface User {
    id: string;
    username: string;
    password: string;
    birthDate: string;
    fullname: string;
    avatar: string | null;
    background: string | null;
    regDate: string;
    isUserConfirmed: boolean;
    isUserTwitterCreator: boolean;
    userSubscribtions: string[];
    userSubscribers: string[];
    posts: {
        created: string[];
        liked: string[];
        saved: string[];
    }
}
