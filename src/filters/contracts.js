const fileHelper = require("../helpers/util");

function description() {
    return "Lists all contracts and their functions."
}

async function run(dir, options) {
    var parsed = await fileHelper.parseToJson(dir, [], options);
    if(parsed["error"]){
        return parsed;
    }
    var result = {};
    Object.keys(parsed).forEach(key => {
        const ast = parsed[key];
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