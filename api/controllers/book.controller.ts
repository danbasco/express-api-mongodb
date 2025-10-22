import { Request, Response } from "express";
import { IBook } from "../models/Book.js";
import * as bookService from "../services/book.service.js"

export const createBook = async(req: Request<any, any, IBook> , res: Response) => {

    const book = await bookService.createBookService(req.body);
    return res.status(book.status).json({ message: book.message});

}

export const listBooks = async(req: Request , res: Response) => {

    const books = await bookService.listBooksService();

}

export const listBookById = async(req: Request, res: Response) => {

}

export const updateBook = async(req: Request, res: Response) => {

}

export const patchBook = async(req: Request, res: Response) => {

}

export const deleteBook = async(req: Request, res: Response) => {

}