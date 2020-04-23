const path = require('path');
const fs = require('fs');

module.exports = (filePath) => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, (error) => {
        if(error) throw new Error('Could not delete picture at the path: ' + filePath);
    });
}