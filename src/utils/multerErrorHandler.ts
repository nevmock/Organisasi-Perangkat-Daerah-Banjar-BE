import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export function handleMulterError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof multer.MulterError) {
    let message = 'Unexpected file field encountered during upload.';
    switch (err.code) {
    case 'LIMIT_FILE_SIZE':
        message = 'File size is too large. The uploaded file exceeds the maximum allowed size.';
        break;
    case 'LIMIT_FILE_COUNT':
        message = 'Too many files uploaded. The number of uploaded files exceeds the allowed limit.';
        break;
    case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected file field received. Please check the file field names in your upload form and ensure they match the expected fields.';
        break;
    default:
        message = err.message || message;
        break;
    }
    return res.status(400).json({
      message
    });
  } else if (err) {
    return res.status(500).json({
      message: 'An internal server error occurred during file upload.'
    });
  }
  next();
}
