const School = require('../models/school')

const getAll = async () => {
    try {
      const schools = await School.find();

      return schools;
    } catch (error) {
      throw new Error('An error occurred while fetching schools.');
    }
}

module.exports = {
    getAll
}
