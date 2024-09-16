const fs = require('fs');
const path = require('path');

function getDirectorySize(directoryPath) {
    return new Promise((resolve, reject) => {
        let totalSize = 0;

        function calculateSize(currentPath) {
            fs.readdir(currentPath, (err, files) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }

                let pending = files.length;

                if (!pending) {
                    console.log('Total size:', totalSize);
                    return resolve(totalSize);
                }

                files.forEach(file => {
                    const filePath = path.join(currentPath, file);
                    fs.stat(filePath, (err, stats) => {
                        if (err) {
                            console.log(err);
                            return reject(err);
                        }

                        if (stats.isDirectory()) {
                            calculateSize(filePath);
                        } else {
                            totalSize += stats.size;
                            console.log(`Added size of ${file}: ${stats.size} bytes`);

                            if (!--pending) {
                                console.log('Final total size:', totalSize);
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

// Call the function with a test directory
const testDirectory = path.join(__dirname, '..'); // Adjust the path to a valid directory
getDirectorySize(testDirectory)
    .then(size => console.log(`Directory size: ${size} bytes`))
    .catch(err => console.error('Error calculating directory size:', err));

module.exports = { getDirectorySize };
