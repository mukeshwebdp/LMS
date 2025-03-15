import {Router} from 'express';
import { createCourse, removeLectureFromCourse, getAllCourses, getLectureByCourseId, removeCourse, updateCourse, addLectureToCourseById } from '../controllers/course.controller.js';
import { authorizedRoles, authorizedSubscriber, isLoggedIn } from '../middlewares/auth.middleware.js';
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
router.route('/:courseId/lecture/:lectureId')
        .delete(isLoggedIn, authorizedRoles('ADMIN'), removeLectureFromCourse);

        

router.route('/:id')
        .get(isLoggedIn,authorizedSubscriber,getLectureByCourseId)
        .put(isLoggedIn,authorizedRoles('ADMIN'),updateCourse)
        .delete(isLoggedIn,authorizedRoles('ADMIN'),removeCourse)
        .post(isLoggedIn,authorizedRoles('ADMIN'),upload.single('lecture'),addLectureToCourseById);

export default router;