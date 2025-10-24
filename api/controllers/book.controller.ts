import { Request, Response } from "express";
import { IBook } from "../models/Book.js";
import * as bookService from "../services/book.service.js"

export const createBook = async(req: Request<any, any, IBook> , res: Response) => {
    
    if(!req.user){
        return res.status(401).json( {message: "Unathorized."} );
    }

    const book = await bookService.createBookService(req.body, req.user.id);
    return res.status(book.status).json({ message: book.message});

}

export const listBooks = async(req: Request , res: Response) => {

    const books = await bookService.listBooksService({ query: req.query, user: req.user });
    return res.status(books.status).json({ message: books.message, data: books.data });

}

export const listBookById = async(req: Request, res: Response) => {

    const book = await bookService.listBookByIdService({  id: req.params.id, user: req.user });
    return res.status(book.status).json({ message: book.message, data: book.data });

}

export const updateBook = async(req: Request, res: Response) => {

    const book = await bookService.updateBookService({  id: req.params.id , user: req.user }, req.body);
    return res.status(book.status).json({ message: book.message, data: book.data });

}

export const patchBook = async(req: Request, res: Response) => {

    const book = await bookService.patchBookService({ id: req.params.id, user: req.user }, req.body);
    return res.status(book.status).json({ message: book.message, data: book.data });

}

export const deleteBook = async(req: Request, res: Response) => {

    const book = await bookService.deleteBookService(req.params.id);
    return res.status(book.status).json({ message: book.message, data: book.data });

}