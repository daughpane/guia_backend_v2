// sort an object's keys alphabetically
const sortObject = (obj) => {
    return Object.keys(obj).sort().reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}

const greaterThanZero = (value) => {
    if (value <= 0) {
        throw new Error('Value must be greater than zero');
    }
    return true;
};

const validateImagesLength = (value) => {
    if (!Array.isArray(value) || value.length < 10) {
        throw new Error('10 artwork images are required.');
    }
    return true;
};

const thumbnailInImages = (thumbnail, { req }) => {
    const images = req.body.images;
    if (!images.includes(thumbnail)) {
        throw new Error('Thumbnail must be one of the images.');
    }
    return true;
};

module.exports = {
  sortObject,
  greaterThanZero,
  validateImagesLength,
  thumbnailInImages
}