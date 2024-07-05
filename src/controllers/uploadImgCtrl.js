const { Request, Response } = require("express");
const asyncHandler = require("express-async-handler");
const fs = require("fs");

const {
  cloudinaryDeleteImgAvatar,
  cloudinaryDeleteImgMessages,
  cloudinaryDeleteImgPost,
  cloudinaryUploadImgAvatar,
  cloudinaryUploadImgMessages,
  cloudinaryUploadImgPost,
} = require("../utils/cloudinary");

const uploadImagesAvatar = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImgAvatar(path);
    const urls = [];
    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const images = urls.map((file) => file);
    res.json(images);
  } catch (error) {
    throw new Error(error);
  }
});

const uploadImagesPost = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImgPost(path);
    const urls = [];
    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const images = urls.map((file) => file);
    res.json(images);
  } catch (error) {
    throw new Error(error);
  }
});

const uploadImagesMessages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImgMessages(path);
    const urls = [];
    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const images = urls.map((file) => file);
    res.json(images);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteImagesAvatar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImgAvatar(id);
    res.json({ public_id: id });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteImagesPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImgPost(id);
    res.json({ public_id: id });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteImagesMessages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImgMessages(id);
    res.json({ public_id: id });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  uploadImagesAvatar,
  uploadImagesPost,
  uploadImagesMessages,
  deleteImagesAvatar,
  deleteImagesPost,
  deleteImagesMessages,
};
