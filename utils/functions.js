// sort an object's keys alphabetically
const sortObject = (obj) => {
    return Object.keys(obj).sort().reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}

module.exports = {
    sortObject,
}