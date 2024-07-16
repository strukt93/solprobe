const fileHelper = require("../helpers/files");

function description() {
    return "Lists all contracts and their functions."
}

function run(dir) {
    var asts = fileHelper.parseToJson(dir, []);
    var result = {};
    Object.keys(asts).forEach(key => {
        const ast = asts[key];
        ast.children.forEach(child => {
            if(child.type == "ContractDefinition") {
                result[child.name] = [];
                child.subNodes.forEach(subNode => {
                    if(subNode.type == "FunctionDefinition") {
                        if(subNode.name) {
                            modifiers = [];
                            subNode.modifiers.forEach(modifier => {
                                modifiers.push(modifier.name);
                            });
                            result[child.name].push({
                                name: subNode.name,
                                visibility: subNode.visibility,
                                modifiers: modifiers
                            });
                        }
                    }
                });
            }
        });
    });
    return result;
}

module.exports = {
    run: run,
    description: description
}