import Course from "../models/course.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

const getAllCourses = async function (req, res, next) {
  try {
    const courses = await Course.find({}).select("-lectures");

    res.status(200).json({
      success: true,
      message: "All courses",
      courses,
    });
  } catch (e) {
    return next(new AppError(`All courses get: ${e.message}`, 500));
  }
};

const createCourse = async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;

  if (!title || !description || !category || !createdBy) {
    return next(new AppError("All fields are required", 400));
  }
  const course = await Course.create({
    title,
    description,
    category,
    createdBy,
    thumbnail: {
      public_id: "Dummy",
      secure_url: "Dummy",
    },
  });

  if (!course) {
    return next(new AppError("Could not created, please try again", 500));
  }

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
      });

      if (result) {
        course.thumbnail.public_id = result.public_id;
        course.thumbnail.secure_url = result.secure_url;
      }

      fs.rm(`uploads/${req.file.filename}`);
    } catch (e) {
      return next(new AppError(`Thumbnail image issue : ${e.message}`, 500));
    }
  }

  await course.save();

  res.status(200).json({
    success: true,
    message: "Course created successfully..",
    course,
  });
};

const removeLectureFromCourse = async(req,res,next) =>{
  const {courseId,lectureId} = req.params;

  console.log('course id',courseId);
  console.log('lecture id',lectureId)

  if(!courseId){
    return next(new AppError('Course ID is required', 400));
  }
  if(!lectureId){
    return next(new AppError('lecture ID is required', 400));
  }

  const course = await Course.findById(courseId);

  if(!course){
    return next(new AppError('Invalid ID or Course does not exist.', 404));
  }

  // find the index of lecture using the lectureID.

  const lectureIndex =  course.lectures.findIndex(
    (lecture)=> lecture._id.toString() === lectureId.toString()
  );

 // If returned index is -1 then send error as mentioned below
 if (lectureIndex === -1) {
  return next(new AppError('Lecture does not exist.', 404));
}

// Delete the lecture from cloudinary
  await cloudinary.v2.uploader.destroy(
    course.lectures[lectureIndex].lecture.public_id,
    {
      resource_type: "video",
    }
  )

  // Remove the lecture from the array
  course.lectures.splice(lectureIndex, 1);

  course.numberOfLectures = course.lectures.length;

  await course.save()

  res.status(200).json({
    success: true,
    message: 'Course lecture removed successfully',
  });
}
const getLectureByCourseId = async function (req, res, next) {
  try {
    const { id } = req.params;
    console.log(id);
    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError("Invalid  curse id", 400));
    }
    res.status(200).json({
      success: true,
      message: "Course lecture fetched successfully",
      lectures: course,
    });
  } catch (e) {
    return next(new AppError(`courses not get : ${e.message}`, 500));
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { runValidators: true }
    );

    if (!course) {
      return next(new AppError(`Course with given id does not exist`, 400));
    }

    res.status(200).json({
      success: true,
      message: "Course update successfully!",
      course,
    });
  } catch (e) {
    return next(new AppError(`update course issue: ${e.message}`, 500));
  }
};
const removeCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return next(new AppError(`Course with given id does not exist`, 400));
    }
    await Course.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (e) {
    return next(
      new AppError(`Course remove related issues :${e.message}`, 500)
    );
  }
};

const addLectureToCourseById = async (req, res, next) => {
  const { title, description } = req.body;
  const { id } = req.params;

  if (!title || !description) {
    return next(new AppError("All fields are required", 400));
  }

  const course = await Course.findById(id);

  if (!course) {
    return next(new AppError(`Course with given id does not exist`, 400));
  }

  const lectureData = {
    title,
    description,
    lecture: {}
  };

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
      });

      if (result) {
        lectureData.lecture.public_id = result.public_id;
        lectureData.lecture.secure_url = result.secure_url;
      }

      fs.rm(`uploads/${req.file.filename}`);
    } catch (e) {
      return next(new AppError(`Thumbnail image issue : ${e.message}`, 500));
    }
  }

  course.lectures.push(lectureData);
  course.numberOfLectures = course.lectures.length;

  await course.save()

  res.status(200).json({
    success: true,
    message: 'Lecture successfully added to the course',
    course
  })
};
export {
  getAllCourses,
  getLectureByCourseId,
  createCourse,
  removeLectureFromCourse,
  updateCourse,
  removeCourse,
  addLectureToCourseById,
};
