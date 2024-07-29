const fileHelper = require("../helpers/util");

function description() {
    return "Lists the actors and roles that can access privileged functions."
}

function toHumanReadable(obj){
    var s = "";
    for(let key in obj) {
        if(Object.keys(obj[key]).length !== 0){
            s += "contract " + key + "\n";
            for(inner_key in obj[key]){
                s += "\tmodifier " + inner_key + " protects functions: " + obj[key][inner_key].join(", ") + "\n";
            }
            s += "\n";
        }
    }
    return s;
}

async function run(dir, options) {
    var parsed = await fileHelper.parseToJson(dir, [], options);
    var result = {};
    Object.keys(parsed).forEach(key => {
        const ast = parsed[key];
        ast.children.forEach(child => {
            if(child.type == "ContractDefinition" && child.kind != "interface") {
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

    if(options.out == "text"){
        return toHumanReadable(result);
    }
    return result;
}

module.exports = {
    run: run,
    description: description
}