const fs = require('fs');
const path = require('path');

function getDirectorySize(directoryPath) {
    return new Promise((resolve, reject) => {
        let totalSize = 0;

        function calculateSize(currentPath) {
            fs.readdir(currentPath, (err, files) => {
                if (err) {
                    return reject(err);
                }

                let pending = files.length;

                if (!pending) {
                    return resolve(totalSize);
                }

                files.forEach(file => {
                    const filePath = path.join(currentPath, file);
                    fs.stat(filePath, (err, stats) => {
                        if (err) {
                            return reject(err);
                        }

                        if (stats.isDirectory()) {
                            calculateSize(filePath);
                        } else {
                            totalSize += stats.size;
                            if (!--pending) {
                                resolve(totalSize);
                            }
                        }
                    });
                });
            });
        }

        calculateSize(directoryPath);
    });
}

module.exports = { getDirectorySize };
