const fs = require('fs');
const path = require("path");
const parser = require('@solidity-parser/parser');
const ethers = require("ethers");
const etherscan = require('etherscan-api');

const getSourceCodeFromEtherscan = function(address) {
    var api = etherscan.init()
}

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
            console.log(e);
        }
    });
    return asts;
}

const parseToJson = async function(target, arrayOfFiles, options) {
    var filenames;
    if(ethers.isAddress(target)){
        var api = etherscan.init();
        var files = [];
        var result = await api.contract.getsourcecode(target);
        if(result['result'][0]['ABI'] == "Contract source code not verified"){
            console.log("Contract source code not verified");
            return {};
        }
        var body = result['result'][0].SourceCode;
        var jsonBody = JSON.parse(body.substring(1, body.length - 1));
        var sources = jsonBody['sources'];
        Object.keys(sources).forEach(source => {
            if(!source.startsWith("@")) { //Ignore third-part imports
                var sourceCode = sources[source];
                var content = sourceCode['content'];
                let code = content;
                files.push({name: source, content: code});
            }
        });
        return parseFiles(files);
    }

    if(fs.statSync(target).isDirectory()){
        filenames = getAllFiles(target, arrayOfFiles);
    } else if(target.endsWith(".sol")){
        filenames = [target]
    }
    
    var files = readFiles(filenames);
    return parseFiles(files);
}

module.exports = {
    getAllFiles,
    readFiles,
    parseFiles,
    parseToJson
}