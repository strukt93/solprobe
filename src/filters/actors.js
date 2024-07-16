const fileHelper = require("../helpers/files");

function description() {
    return "Lists the actors and roles that can access privileged functions."
}

function run(dir) {
    var asts = fileHelper.parseToJson(dir, []);
    var result = {};
    Object.keys(asts).forEach(key => {
        const ast = asts[key];
        ast.children.forEach(child => {
            if(child.type == "ContractDefinition") {
                result[child.name] = {};
                child.subNodes.forEach(subNode => {
                    if(subNode.type == "FunctionDefinition") {
                        if(subNode.name) {
                            subNode.modifiers.forEach(modifier => {
                                if(modifier.name != "nonReentrant"){
                                    if(result[child.name][modifier.name] === undefined) result[child.name][modifier.name] = [];
                                    var modifierName = modifier.name;
                                    if(modifier.name == "onlyRole"){
                                        modifierName = "onlyRole(" + modifier.arguments[0].name +")";
                                    }
                                    result[child.name][modifier.name].push(subNode.name + "()");
                                }
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