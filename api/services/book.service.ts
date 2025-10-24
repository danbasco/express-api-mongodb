import { Types, Document, } from "mongoose";
import Book, { IBook } from "../models/Book.js";

import ResponseType from "../types/response.type.js";


const locateBook = async(id?: string, filters: any = {}) : Promise<(IBook & Document)[]> => {
    
    if (id) {

        if (!Types.ObjectId.isValid(id)) {
            return [];
        }

        const book = await Book.findById(id);
        return book ? [book] : [];
    }
    return await Book.find(filters);

}


class MissingParamsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MissingParamsError";
    }
}

const validateParams = async (data: IBook) : Promise<any> => {
    const missingFields: string[] = [];

    if (!data.title) missingFields.push("Title");
    if (!data.author) missingFields.push("Author");
    if (!data.genre || data.genre.length === 0) missingFields.push("Genre");

    if (missingFields.length > 0) {
        throw new MissingParamsError(
        `The following required fields are missing or empty: ${missingFields.join(", ")}.`
        );
    }
}


export const createBookService = async (data: IBook, userId: string) : Promise<ResponseType> => {

    try{
    
        await validateParams(data);
        
        const genres = Array.isArray(data.genre)
          ? data.genre.map(g => String(g).trim())
          : [String(data.genre).trim()];

        const book = new Book({

            title: data.title,
            author: data.author, 
            description: data.description || data.title, // if case of empty description
            genre: genres,
            userId: userId, 

        })

        await book.save();

        return {status: 201, message: "Book created on database sucessfully.", data: {id: book._id}};

    }catch(error: any) {

        console.error("createBookService error:", error);
        return {status: 500, message: "Internal Server Error.", data: error};
    }
}

export const listBooksService = async(req: any) : Promise<ResponseType> => {
    
    try {

        const { query, user }  = req;

        const filters : any = { userId: user.id }

        if (query.title) filters.title = { $regex: query.title, $options: "i" };
        if (query.author) filters.author = { $regex: query.author, $options: "i" };
        if (query.genre) filters.genre = { $regex: `^${query.genre}$`, $options: "i" };

        const books = await locateBook(undefined, filters);

        if (books.length === 0) {
            return {status: 404, message: "No books found."};
        }
        
        return {status: 200, message: "Books retrieved successfully.", data: books};

    } catch (error: any) {

        console.error("listBooksService error:", error);
        return {status: 500, message: "Internal Server Error.", data: error};

    }
}

export const listBookByIdService = async(req: {id: string, user: any}) : Promise<ResponseType> => {

    try {

        const { id, user } = req;
        const filters : any = { userId: user.id };  

        const books = await locateBook(id, filters);
        if (books.length === 0) {
            return {status: 404, message: "Book not found."};
        }

        return {status: 200, message: "Book retrieved successfully.", data: books[0]};

    } catch (error: any) {
        console.error("listBookByIdService error:", error);
        return {status: 500, message: "Internal Server Error.", data: error};
    }

}

export const updateBookService = async(req: {id: string, user: any}, data: IBook) : Promise<ResponseType> => {
    
    try {

        const { id, user } = req;
        const filters : any = { userId: user.id };  

        const book = await locateBook(id, filters);
        if (book.length === 0) {
            return {status: 404, message: "Book not found."};
        }

        await validateParams(data);

        Object.assign(book[0], data);
        await book[0].save();

        return {status: 200, message: "Book updated successfully.", data: book[0]};
    } catch (error: any) {

        if(error instanceof MissingParamsError) {
            return {status: 400, message: error.message};
        }

        console.error("updateBookService error:", error);
        return {status: 500, message: "Internal Server Error.", data: error};
    }
}

export const patchBookService = async(req: {id: string, user: any}, data: Partial<IBook>) : Promise<ResponseType> => {
    // To be implemented
    return {status: 501, message: "Not Implemented."};
}

export const deleteBookService = async(id: string) : Promise<ResponseType> => {
    // To be implemented
    return {status: 501, message: "Not Implemented."};
}