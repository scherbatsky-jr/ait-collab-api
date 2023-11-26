const schoolService = require('../services/schoolService')

const getAll = async (req, res) => {
    try {
        const schools = await schoolService.getAll();

        res.json(schools);
    } catch (error) {
        res.error(500);
    }
}

module.exports = {
    getAll
}
