export interface Author {
    id: number;
    name: string;
}

export interface Book {
    id: number;
    title: string;
    isbn: string;
    publisher: string;
    year: number;
    category: string;
    status: string;
    author: Author;
}
