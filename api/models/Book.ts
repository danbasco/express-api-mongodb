import mongoose, { Schema, Model, model, Types } from "mongoose";
import { GENRES, Genre } from "../types/genres.type.js";


export interface IBook {
    "title": string,
    "author": string,
    "description": string,
    "genre": string[]
}

const BookSchema : Schema<IBook> = new Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String, 
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    genre: {
        type: [String],
        enum: GENRES,
        required: true
    }

})

const Book : Model<IBook> = mongoose.models.Book || model<IBook>("Book", BookSchema);

export default Book;
export type { Genre };