// import crypto from 'crypto';
// import path from 'path';
// import { GridFsStorage } from 'multer-gridfs-storage';

// // Mongo URI
// const mongoURL = "mongodb://localhost:27017";

// const storage = new GridFsStorage({
//   url: mongoURL,
//   options: { useNewUrlParser: true, useUnifiedTopology: true },
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads'
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });

// export default storage;