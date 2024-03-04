const multer = require('multer');

// const upload = () => {
  
//   const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads') // Ensure there is a trailing slash
//     },
//     filename: function (req, file, cb) {

//     }
//   });
//   return multer({ storage: storage });
// };
const upload = () => {
  const storage = multer.memoryStorage(); // Use memory storage
  return multer({ storage: storage });
};

module.exports = { upload };


