import {Router} from 'express';
import { createCourse, getAllCourses, getLectureByCourseId, removeCourse, updateCourse, addLectureToCourseById } from '../controllers/course.controller.js';
import { authorizedRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/')
        .get(getAllCourses)
        .post(
                isLoggedIn,
                authorizedRoles('ADMIN'),
                upload.single('thumbnail'),
                createCourse
        );
        

router.route('/:id')
        .get(isLoggedIn,getLectureByCourseId)
        .put(isLoggedIn,authorizedRoles('ADMIN'),updateCourse)
        .delete(isLoggedIn,authorizedRoles('ADMIN'),removeCourse)
        .post(isLoggedIn,authorizedRoles('ADMIN'),upload.single('lecture'),addLectureToCourseById);

export default router;