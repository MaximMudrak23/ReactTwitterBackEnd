export interface Post {
    id: string;
    author: string;
    text: string;
    createdAt: string;
    likes: string[];
    saves: string[];
    isPinned: boolean;
}