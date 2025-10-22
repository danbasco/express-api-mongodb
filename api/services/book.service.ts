import { Types } from "mongoose";
import Book, { IBook } from "../models/Book";

import ResponseType from "../types/response.type";


const locateBook = async(id: string = "") : Promise<IBook | null | IBook[]> => {
    try {

        if (!id) {
            const books = await Book.find();
            return books;
        }
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        const book = await Book.findById(id);
        return book;

    } catch (error: any) {

        console.error("locateBookById error:", error);
        return null;
    }
}

export const createBookService = async (data: IBook) : Promise<ResponseType> => {

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
            genre: genres

        })

        await book.save();

        return {status: 201, message: "Book created on database sucessfully.", data: {id: book._id}};

    }catch(error: any) {

        console.error("createBookService error:", error);
        return {status: 500, message: "Internal Server Error.", data: error};
    }
}

export const listBooksService = async() : Promise<ResponseType> => {
    
    try {

        const books = await locateBook();

        if (!books) {
            return {status: 404, message: "No books found."};
        }
        
        return {status: 200, message: "Books retrieved successfully.", data: books};

    } catch (error: any) {

        console.error("listBooksService error:", error);
        return {status: 500, message: "Internal Server Error.", data: error};

    }
}