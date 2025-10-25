import { Request, Response, NextFunction } from "express";
import { IBook } from "../models/Book.js";
import * as bookService from "../services/book.service.js"
import { InvalidIdError } from "../utils/errors.js";


export const createBook = async(req: Request<any, any, IBook> , res: Response, next: NextFunction) => {

    try {

        if(!req.user){
            return res.status(401).json( {message: "Unathorized."} );
        }

        const book = await bookService.createBookService(req.body, req.user.id);
        return res.status(book.status).json({ message: book.message});

    } catch (error) {
        next(error);
    }
    
}

export const listBooks = async(req: Request , res: Response, next: NextFunction) => {

    try {

        const books = await bookService.listBooksService({ query: req.query, user: req.user });
        return res.status(books.status).json({ message: books.message, data: books.data });

    } catch (error) {
        next(error);
    }

}

export const listBookById = async(req: Request, res: Response, next: NextFunction) => {

    try {

        const book = await bookService.listBookByIdService({  id: req.params.id, user: req.user });
        return res.status(book.status).json({ message: book.message, data: book.data });

    } catch (error) {
        next(error);
    }

    }

export const updateBook = async(req: Request, res: Response, next: NextFunction) => {

    try {

        const book = await bookService.updateBookService({  id: req.params.id , user: req.user }, req.body);
        return res.status(book.status).json({ message: book.message, data: book.data });

    } catch (error) {
        next(error);
    }
}

export const patchBook = async(req: Request, res: Response, next: NextFunction) => {

    try {

        const book = await bookService.patchBookService({ id: req.params.id, user: req.user }, req.body);
        return res.status(book.status).json({ message: book.message, data: book.data });
        
    } catch (error) {
        next(error);
    }
}


export const deleteBook = async(req: Request, res: Response) => {

    if(!req.params.id){
        throw new InvalidIdError("Book id is required.");
    }

    const book = await bookService.deleteBookService(req.params.id, req.user);
    return res.status(book.status).json({ message: book.message, data: book.data });

}