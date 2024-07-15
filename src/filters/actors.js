const parser = require('@solidity-parser/parser');
const fileHelper = require("../helpers/files");

function getActors(dir) {
    var filenames = fileHelper.getAllFiles(dir, []);
    var files = fileHelper.readFiles(filenames);
    files.forEach(file => {
        try {
            const ast = parser.parse(file.content)
            ast.children.forEach(child => {
                if(child.type == "ContractDefinition") {
                    child.subNodes.forEach(subNode => {
                        if(subNode.type == "FunctionDefinition") {
                            if(subNode.name) {
                                subNode.modifiers.forEach(modifier => {
                                    if(modifier.name != "nonReentrant"){
                                        var modifierName = modifier.name;
                                        if(modifier.name == "onlyRole"){
                                            modifierName = "onlyRole(" + modifier.arguments[0].name +")";
                                        }
                                        console.log("- " + child.name + "." + subNode.name + "() is protected by " + modifierName);
                                    }
                                });
                            }
                        }
                    });
                }
            });
            } catch (e) {
            if (e instanceof parser.ParserError) {
                console.error(e.errors)
            }
            }
    });
}

module.exports = {
    getActors: getActors
}