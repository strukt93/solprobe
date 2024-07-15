const fs = require('fs');
const path = require("path")

const readFiles = function(filenames) {
    var filenamesAndContents = [];
    filenames.forEach(filename => {
        var content = fs.readFileSync(filename, "utf-8");
        filenamesAndContents.push(
            {
                name: filename,
                content: content
            }
        );
    });
    return filenamesAndContents;
}

const getAllFiles = function(dirPath, arrayOfFiles) {
    dirPath = path.resolve(dirPath);
    files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || []

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
        arrayOfFiles.push(path.join(dirPath, "/", file))
        }
    });

    return arrayOfFiles;
}

module.exports = {
    getAllFiles,
    readFiles
}