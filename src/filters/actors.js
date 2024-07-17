const fileHelper = require("../helpers/util");

function description() {
    return "Lists the actors and roles that can access privileged functions."
}

async function run(dir, options) {
    var parsed = await fileHelper.parseToJson(dir, [], options);
    var result = {};
    Object.keys(parsed).forEach(key => {
        const ast = parsed[key];
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