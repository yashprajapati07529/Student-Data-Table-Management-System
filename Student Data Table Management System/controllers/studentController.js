
import mongoose from "mongoose";
import Student from "../models/Student.js";

// GET: All students with search, sort, filter and pagination
export const getStudents = async (req, res) => {
  try {
    const {
      search = "",
      sort = "",
      city = "",
      category = "",
      page = 1,
      limit = 5,
    } = req.query;

    const currentPage = Number(page);
    const pageLimit = Number(limit);

    if (
      !Number.isInteger(currentPage) ||
      currentPage < 1 ||
      !Number.isInteger(pageLimit) ||
      ![5, 10].includes(pageLimit)
    ) {
      return res.status(400).json({
        success: false,
        message: "Page must be positive and limit must be 5 or 10",
      });
    }

    if (!["", "asc", "desc"].includes(sort)) {
      return res.status(400).json({
        success: false,
        message: "Sort must be asc or desc",
      });
    }

    const filter = {};

    // Search by name or email
    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // Filter by city
    if (city.trim()) {
      filter.city = {
        $regex: `^${city.trim()}$`,
        $options: "i",
      };
    }

    // Filter by category
    if (category.trim()) {
      filter.category = {
        $regex: `^${category.trim()}$`,
        $options: "i",
      };
    }

    // Sort by name
    const sortOption = {};

    if (sort === "asc") {
      sortOption.name = 1;
    } else if (sort === "desc") {
      sortOption.name = -1;
    }

    const skip = (currentPage - 1) * pageLimit;

    const totalStudents = await Student.countDocuments(filter);

    const students = await Student.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(pageLimit);

    return res.status(200).json({
      success: true,
      totalStudents,
      currentPage,
      totalPages: Math.ceil(totalStudents / pageLimit),
      limit: pageLimit,
      students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET: Single student by ID
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST: Create student
export const createStudent = async (req, res) => {
  try {
    const { name, email, phone, city, category } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !city?.trim() ||
      !category?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const student = await Student.create({
      name,
      email,
      phone,
      city,
      category,
    });

    return res.status(201).json({
      success: true,
      message: "Student added successfully",
      student,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT: Update student
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const allowedFields = [
      "name",
      "email",
      "phone",
      "city",
      "category",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide fields to update",
      });
    }

    const student = await Student.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE: Delete student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
