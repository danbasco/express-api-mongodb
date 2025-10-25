import { Types, Document} from "mongoose";
import Book, { IBook } from "../models/Book.js";

import ResponseType from "../types/response.type.js";
import { MissingParamsError, InvalidEnumError } from "../utils/errors.js";
import { STATUS } from "../types/status.type.js";
import { GENRES } from "../types/genres.type.js";
import { normalizeGenres, validateParams, validatePatchParams } from "../utils/validators.js";

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


export const createBookService = async (data: IBook, userId: string) : Promise<ResponseType> => {

    try{
    
        await validateParams(data);
        
        const genres = normalizeGenres(data.genre);

        const book = new Book({

            title: data.title,
            author: data.author, 
            description: data.description || data.title, // if case of empty description
            genre: genres,
            status: data.status,
            userId: userId, 

        })

        await book.save();

        return {status: 201, message: "Book created on database sucessfully.", data: {id: book._id}};

    }catch(error: any) {

        console.error("createBookService error:", error);
        throw error;
    }
}

export const listBooksService = async(req: any) : Promise<ResponseType> => {
    
    try {

        const { query, user }  = req;

        const filters : any = { userId: user.id }

        if (query.title) filters.title = { $regex: query.title, $options: "i" };
        if (query.author) filters.author = { $regex: query.author, $options: "i" };
        if (query.genre) filters.genre = { $regex: `^${query.genre}$`, $options: "i" };
        if (query.status) filters.status = { $regex: `^${query.status}$`, $options: "i"};

        const books = await locateBook(undefined, filters);

        if (books.length === 0) {
            return {status: 404, message: "No books found."};
        }
        
        return {status: 200, message: "Books retrieved successfully.", data: books};

    } catch (error: any) {

        console.error("listBooksService error:", error);
        throw error;

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
        throw error;
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


        console.error("updateBookService error:", error);
        throw error;
    }
}

export const patchBookService = async(req: {id: string, user: any}, data: Partial<IBook>) : Promise<ResponseType> => {
    
    try {
    const { id, user } = req;
    const filters : any = { userId: user.id };

    const book = await locateBook(id, filters);

    if (book.length === 0) {
            return {status: 404, message: "Book not found."};
        }

        if(!data || Object.keys(data).length === 0) {
            return {status: 400, message: "No data provided for update."};
        }

        const validData = await validatePatchParams(data);
        Object.assign(book[0], validData);
        await book[0].save();

        return {status: 200, message: "Book patched successfully.", data: book[0]};

    } catch (error: any) {

        console.error("patchBookService error:", error);
        throw error;
    }
}

export const deleteBookService = async(id: string, user: any) : Promise<ResponseType> => {
    try {
        const filters : any = { userId: user.id };

        const book = await locateBook(id, filters);

        if (book.length === 0) {
            return {status: 404, message: "Book not found."};
        }

        await book[0].deleteOne()

        return {status: 200, message: "Book deleted successfully."};

    } catch (error: any) {
        console.error("deleteBookService error:", error);
        throw error;
    }
}