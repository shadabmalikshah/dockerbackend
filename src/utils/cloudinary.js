const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CLOUDINAIRE,
  api_secret: process.env.API_SECRET_CLOUDINAIRE,
  secure: true,
});

const cloudinaryUploadImgAvatar = async (fileUpload) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileUpload,
      {
        folder: "Socito-MajorProject/avatar",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id.split("/")[2],
          });
        }
      }
    );
  });
};

const cloudinaryUploadImgPost = async (fileUpload) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileUpload,
      {
        folder: "Socito-MajorProject/post",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id.split("/")[2],
          });
        }
      }
    );
  });
};

const cloudinaryUploadImgMessages = async (fileUpload) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileUpload,
      {
        folder: "Socito-MajorProject/messages",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id.split("/")[2],
          });
        }
      }
    );
  });
};

const cloudinaryDeleteImgAvatar = async (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      `Socito-MajorProject/avatar/${publicId}`,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          });
        }
      }
    );
  });
};

const cloudinaryDeleteImgPost = async (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      `Socito-MajorProject/post/${publicId}`,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          });
        }
      }
    );
  });
};

const cloudinaryDeleteImgMessages = async (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      `Socito-MajorProject/messages/${publicId}`,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          });
        }
      }
    );
  });
};

module.exports = {
  cloudinaryUploadImgAvatar,
  cloudinaryUploadImgPost,
  cloudinaryUploadImgMessages,
  cloudinaryDeleteImgAvatar,
  cloudinaryDeleteImgPost,
  cloudinaryDeleteImgMessages,
};
