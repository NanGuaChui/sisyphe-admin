import axios from '@/axios';

export default {
    getLargeArea(largeAreaType) {
        largeAreaType = largeAreaType || 'REGION';
        return new Promise((resolve, reject) => {
            return axios.get('/baseInfoApi/api/v1/baseInfo/largeArea/findByLargeAreaTypeForApi?largeAreaType=' + largeAreaType).then(res => {
                resolve(res.largeAreaApiReturnDTOs);
            }, reject);
        });
    },
    getCity() {
        return new Promise((resolve, reject) => {
            return axios.get('/baseInfoApi/api/v1/baseInfo/city/findAllUsableForApi').then(res => {
                resolve(res.cityReturnDTOs);
            }, reject);
        });
    },
    getStation() {
        return new Promise((resolve, reject) => {
            return axios.get('/baseInfoApi/api/v1/baseInfo/station/findAllUsableForApi').then(res => {
                resolve(res.stationApiReturnDTOs);
            }, reject);
        });
    }
};
