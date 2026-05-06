import express from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import Course from "../models/Course.js";
import { s3 } from "../config/s3.js";
import { upload } from "../middleware/upload.middleware.js";
import { redisClient } from "../config/redis.js";

const router = express.Router();

const clearCourseCache = async () => {
  const keys = await redisClient.keys("courses:*");

  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};

const protectRest = async (req, res, next) => {
  try {
    const jwt = await import("jsonwebtoken");
    const User = await import("../models/User.js");

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.default.verify(token, process.env.JWT_SECRET);

    const user = await User.default
      .findById(decoded.userId)
      .select("-password");

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

router.post(
  "/courses/:courseId/thumbnail",
  protectRest,
  upload.single("file"),
  async (req, res) => {
    try {
      const { courseId } = req.params;

      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (
        course.instructor.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({ message: "Not allowed" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileKey = `skilltrack/courses/${courseId}/thumbnail-${Date.now()}-${
        req.file.originalname
      }`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      });

      await s3.send(command);

      const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

      course.thumbnailUrl = fileUrl;

      await course.save();
      await clearCourseCache();

      res.json(course);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Thumbnail upload failed" });
    }
  },
);

router.post(
  "/courses/:courseId/resources",
  protectRest,
  upload.single("file"),
  async (req, res) => {
    try {
      const { courseId } = req.params;

      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (
        course.instructor.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({ message: "Not allowed" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileKey = `skilltrack/courses/${courseId}/resources/${Date.now()}-${
        req.file.originalname
      }`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      });

      await s3.send(command);

      const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

      course.resourceFiles.push({
        fileName: req.file.originalname,
        fileUrl,
        fileType: req.file.mimetype,
      });

      await course.save();
      await clearCourseCache();

      res.json(course);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Resource upload failed" });
    }
  },
);

export default router;
