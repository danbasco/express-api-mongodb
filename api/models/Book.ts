import mongoose, { Schema, Model, model, Types } from "mongoose";
import { GENRES, Genre } from "../types/genres.type.js";
import { STATUS, Status } from "../types/status.type.js";


export interface IBook {
    "title": string,
    "author": string,
    "description": string,
    "genre": Genre[],
    "status": Status,
    "userId": Types.ObjectId
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
    },
    status: {
        type: String,
        enum: STATUS,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }

})

const Book : Model<IBook> = mongoose.models.Book || model<IBook>("Book", BookSchema);

export default Book;
export type { Genre };
export type { Status };