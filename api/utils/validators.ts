import { IBook } from "../models/Book.js";
import { STATUS } from "../types/status.type.js";
import { GENRES, Genre } from "../types/genres.type.js";
import { MissingParamsError, InvalidEnumError } from "./errors.js";

export const normalizeGenres = (genre: any): Genre[] => {

    const arr = Array.isArray(genre)
        ? genre.map(g => String(g).trim())
        : [String(genre || "").trim()];
    return arr as Genre[];
};

export const validateParams = async (data: IBook) : Promise<any> => {
    const missingFields: string[] = [];

    if (!data.title) missingFields.push("Title");
    if (!data.author) missingFields.push("Author");
    if (!data.status) missingFields.push("Status");
    if (!data.genre || data.genre.length === 0) missingFields.push("Genre");

    if (missingFields.length > 0) {
        throw new MissingParamsError(
        `The following required fields are missing or empty: ${missingFields.join(", ")}.`
        );
    }

    if(!STATUS.includes(data.status)) {
        throw new InvalidEnumError(`Invalid status '${data.status}'. Allowed values: ${STATUS.join(", ")}.`);
    }

    const invalidGenres = (data.genre || []).filter(g => !GENRES.includes(g as Genre));
    if (invalidGenres.length > 0) {
    throw new InvalidEnumError(`Invalid genre(s): ${invalidGenres.join(", ")}. Allowed genres: ${GENRES.join(", ")}.`);

    }

};

export const validatePatchParams = async (data: Partial<IBook>) : Promise<Partial<IBook>> => {
    if (!data || Object.keys(data).length === 0) return data;

    if (data.title !== undefined) {
        data.title = String(data.title || "").trim();
        if (!data.title) throw new MissingParamsError("Title cannot be empty.");
    }

    if (data.author !== undefined) {
        data.author = String(data.author || "").trim();
        if (!data.author) throw new MissingParamsError("Author cannot be empty.");
    }

    if (data.description !== undefined) {
        data.description = String(data.description).trim();
    }

    if (data.status !== undefined) {
        if (String(data.status).trim() === "") throw new MissingParamsError("Status cannot be empty.");
        if (!STATUS.includes(data.status as any)) {
            throw new InvalidEnumError(`Invalid status '${data.status}'. Allowed values: ${STATUS.join(", ")}.`);
        }
    }

    if (data.genre !== undefined) {
        const genres = normalizeGenres(data.genre);
        if (genres.length === 0 || genres.every(g => String(g).trim() === "")) throw new MissingParamsError("Genre cannot be empty.");

        // garantir que o argumento para includes seja do tipo Genre
        const invalidGenres = genres.filter(g => !GENRES.includes(g as Genre));
        if (invalidGenres.length > 0) {
            throw new InvalidEnumError(`Invalid genre(s): ${invalidGenres.join(", ")}. Allowed genres: ${GENRES.join(", ")}.`);
        }

    data.genre = genres as IBook["genre"];
}

    return data;
};