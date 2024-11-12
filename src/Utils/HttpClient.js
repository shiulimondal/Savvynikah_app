import AuthService from '../Services/Auth';
import MainStorage from '../Utils/MainStorage';
import { MAIN_BASE_URL } from './EnvVariables';

const BASE_URL = `https://savvynikah.acuitysoftware.co.in/api`;
const MAINIMAGEURL = "https://savvynikah.acuitysoftware.co.in/api";

function get(endpoint, params) {
    return request(endpoint, params);
}

function post(endpoint, params) {
    return request(endpoint, params, "POST");
}

function put(endpoint, params) {
    return request(endpoint, params, "PUT");
}

function Delete(endpoint, params) {
    return request(endpoint, params, "DELETE");
}

async function request(endpoint, params = null, method = 'GET') {
    let token = await AuthService.getToken();
    let url = BASE_URL + endpoint;

    console.log('Usertoken:====================================>>>>>>>', token);
    console.log('URL:==========================>>>>>>>>>>', url);

    return new Promise((resolve, reject) => {
        var xmlRequest = new XMLHttpRequest();
        xmlRequest.open(method, url, true);

        xmlRequest.setRequestHeader('Accept', '*/*');
        xmlRequest.setRequestHeader('Content-Type', 'application/json');
        xmlRequest.setRequestHeader('Authorization', `Bearer ${token}`);

        if (method === 'GET') {
            xmlRequest.send();
        } else {
            xmlRequest.send(JSON.stringify(params));
        }

        xmlRequest.onreadystatechange = function () {
            if (xmlRequest.readyState === XMLHttpRequest.DONE) {
                const responseText = xmlRequest.responseText;
                if (xmlRequest.status === 200) {
                    try {
                        resolve(JSON.parse(responseText));
                    } catch (err) {
                        console.error('JSON Parse Error:', err);
                        reject({ error: 'Invalid JSON response from server.', actError: err });
                    }
                } else {
                    try {
                        reject(JSON.parse(responseText));
                    } catch (err) {
                        console.error('Error Response:', responseText);
                        reject({ error: 'Server Error. Please try again later.', actError: err });
                    }
                }
            }
        };
    });
}

async function upload(endpoint, files, additionalData = {}, tokenCustom = null) {
    if (!files || !Array.isArray(files) || files.length === 0) {
        console.error('No files provided or invalid file array:', files);
        throw new Error('Invalid file array provided for upload.');
    }

    let token = tokenCustom || await AuthService.getToken();
    let apiUrl = MAINIMAGEURL + endpoint;

    const data = new FormData();

    // Loop through each file and append it to the FormData under `images[]`
    files.forEach((file, index) => {
        if (!file.uri || !file.type || !file.name) {
            console.error('Invalid file object properties:', file);
            throw new Error(`Invalid file object at index ${index}`);
        }
        data.append(`images[${index}][fileName]`, file.name);
        data.append(`images[${index}][fileSize]`, file.fileSize);
        data.append(`images[${index}][height]`, file.height);
        data.append(`images[${index}][originalPath]`, file.originalPath);
        data.append(`images[${index}][type]`, file.type);
        data.append(`images[${index}][uri]`, file.uri);
        data.append(`images[${index}][width]`, file.width);
    });

    // Add any additional data to FormData
    Object.keys(additionalData).forEach(key => {
        data.append(key, additionalData[key]);
    });

    return fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        },
        method: 'POST',
        body: data,
    })
        .then(response => response.json())
        .then(response => {
            return response;
        })
        .catch(error => {
            console.error('Upload Error:', error);
            throw error;
        });
}

async function uploadFile(endpoint, files, additionalData = {}, tokenCustom = null) {

    if (!Array.isArray(files) || files.some(file => !file.uri || !file.type || !file.fileName)) {
        console.error('Invalid file object properties:', files);
        throw new Error('Invalid file object provided for upload.');
    }

    const token = tokenCustom || await AuthService.getToken();
    const apiUrl = `${MAINIMAGEURL}${endpoint}`;

    const data = new FormData();
    files.forEach(file => {
        data.append('images[]', {
            uri: file.uri,
            type: file.type,
            name: file.fileName, 
        });
    });

    Object.keys(additionalData).forEach(key => {
        data.append(key, additionalData[key]);
    });

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            method: 'POST',
            body: data,
        });

        const jsonResponse = await response.json();
        return jsonResponse;
    } catch (error) {
        console.error('Upload Error:', error);
        throw error;
    }
}







const HttpClient = {
    get,
    post,
    put,
    Delete,
    upload,
    uploadFile
};

export default HttpClient;
