import { Types } from "mongoose";
import Book, { IBook } from "../models/Book.js";

import ResponseType from "../types/response.type.js";


const locateBook = async(id?: string, filters: any = {}) : Promise<IBook[]> => {
    
    if (id) {
        const book = await Book.findById(id);
        return book ? [book] : [];
    }
    return await Book.find(filters);

}

export const createBookService = async (data: IBook, userId: string) : Promise<ResponseType> => {

    try{
    
        if(!data || !data.author || !data.genre || !data.title) {
            return {status: 400, message: "Must give Author, Genre and Title of the book."};
        }
        
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

        if (!user || !user.id) {
            console.log("User not connected.");
            return { status: 401, message: "Unauthorized" };
        }

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