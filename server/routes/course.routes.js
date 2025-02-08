import {Router} from 'express';
import { createCourse, getAllCourses, getLectureByCourseId } from '../controllers/course.controller.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/')
        .get(getAllCourses)
        .post(createCourse)

router.route('/:id')
        .get(isLoggedIn,getLectureByCourseId)

export default router;