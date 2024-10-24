import { diskStorage } from 'multer';
import { extname } from 'path';
import fs from 'fs-extra';

export const artistStorage = diskStorage({
  destination: (_req, _file, cb) => {
    const uploadPath = './public/images/artists';
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = extname(file.originalname);
    cb(null, `${uniqueSuffix}${extension}`);
  },
});

export const albumStorage = diskStorage({
  destination: (_req, _file, cb) => {
    const uploadPath = './public/images/albums';
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = extname(file.originalname);
    cb(null, `${uniqueSuffix}${extension}`);
  },
});
