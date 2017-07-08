var request = require('superagent');

const getAllHotels = () => {
    return new Promise( (resolve, reject) => {
        request
            .get('/api/hotels')
            .end( (err, res) => {
                if(err) {
                    return reject(err);
                }
                return resolve(res);
            });
    });
};

const getFacilitiesByHotel = (id) => {
    return new Promise( (resolve, reject) => {
        request
            .get(`/api/facilities/${id}`)
            .end( (err, res) => {
                if(err) {
                    return reject(err);
                }
                return resolve(res);
            });
    });
};

const createNewHotel = (data) => {
    return new Promise( (resolve, reject) => {
        request
            .post(`/api/hotels`)
            .send(data)
            .end( (err, res) => {
                if(err) {
                    return reject(err);
                }
                return resolve(res);
            });
    });
};

const removeHotelByID = (id) => {
    return new Promise( (resolve, reject) => {
        request
            .delete(`/api/hotels/${id}`)
            .end( (err, res) => {
                if(err) {
                    return reject(err);
                }
                return resolve(res);
            });
    });
};

const editHotelByID = (data) => {
    let { id } = data;
    return new Promise( (resolve, reject) => {
        request
            .put(`/api/hotels/${id}`)
            .send(data)
            .end( (err, res) => {
                if(err) {
                    return reject(err);
                }
                return resolve(res);
            });
    });
};

module.exports = {
    hotels: {
        getAllHotels,
        create: createNewHotel,
        remove: removeHotelByID,
        edit: editHotelByID
    },
    facilities: {
        getFacilitiesByHotel
    }
};