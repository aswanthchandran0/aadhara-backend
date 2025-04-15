import { Router } from "express";
import { processImages } from "../controller/uploadController";

const router = Router()

router.post('/',processImages)

export default router