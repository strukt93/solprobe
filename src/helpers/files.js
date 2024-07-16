const fs = require('fs');
const path = require("path");
const parser = require('@solidity-parser/parser');

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

const parseFiles = function(files) {
    asts = {};
    files.forEach(file => {
        ast = {};
        try{
            asts[file.name] = parser.parse(file.content);
        } catch (e) {
            if (e instanceof parser.ParserError) {
                console.error(e.errors)
            }
        }
    });
    return asts;
}

const parseToJson = function(dirPath, arrayOfFiles) {
    var filenames = getAllFiles(dirPath, arrayOfFiles);
    var files = readFiles(filenames);
    return parseFiles(files);
}

module.exports = {
    getAllFiles,
    readFiles,
    parseFiles,
    parseToJson
}