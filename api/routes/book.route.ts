import {Request, Response, Router } from 'express';
import * as bookController from "../controllers/book.controller.js";
import verifyJWT from '../middlewares/jwt.token.middleware.js';

const router = Router();

router.post("/", verifyJWT, bookController.createBook);
router.get("/", verifyJWT, bookController.listBooks);

router.get("/:id", verifyJWT, bookController.listBookById);
router.put("/:id", verifyJWT, bookController.updateBook);
router.patch("/:id", verifyJWT, bookController.patchBook);

router.delete("/:id", verifyJWT, bookController.deleteBook);



export default router;