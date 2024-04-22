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

const isDatetimePassed = (datetime) => {
  const givenDatetime = new Date(datetime);

  // Get the current datetime
  const currentDatetime = new Date();

  // Calculate the datetime 5 minutes ago
  const fiveMinutesBefore = new Date(givenDatetime.getTime() - 5 * 60 * 1000);

  // Compare the given datetime with the current datetime and 5 minutes ago

  return currentDatetime >= fiveMinutesBefore || givenDatetime < currentDatetime;
}

const visitType = (value) => {
  if (value !== 'manual' && value !== 'scan') {
      throw new Error('Type must be either "manual" or "scan"');
    }
    // Return true if the value is valid
    return true;
}

module.exports = {
  sortObject,
  greaterThanZero,
  validateImagesLength,
  thumbnailInImages,
  isDatetimePassed,
  visitType
}