let typeIdentifier = (data) => {
    let types = [];
    data.values.forEach(element => {
        types.push(typeof element);
    });
    return types;
};

let sqlBuilder = (operation, table, body) => {
    let sentence = '';
    body.types = typeIdentifier(body);
    switch (operation) {
        case 'select':
        case 'SELECT':
            sentence += operation;
            break;
        case 'INSERT':
        case 'insert':
            sentence += operation + ' into ' + table + ' ';
            sentence += '(' + body.keys.join(',') + ')';
            sentence += ' values (';
            let aux = [];
            for (let i = 0; i < body.keys.length; i++) {
                let currentType = body.types[i];
                switch (currentType) {
                    case 'number':
                        aux.push(`${body.values[i]}`);
                        break;
                    case 'string':
                        aux.push(`"${body.values[i]}"`);
                        break;
                    case 'object':
                        aux.push(`"${JSON.stringify(body.values[i]).replace(/"/g, '\'')}"`);
                        break;
                    case 'boolean':
                        aux.push(`${body.values[i]? 1: 0}`);
                        break;
                }
            }
            sentence += aux.join(',');
            sentence += ');';
            break;
        case 'delete':
        case 'DELETE':

            break;
        case 'update':
        case 'UPDATE':

            break;
        default:
            return sentence;
            break;
    }
    return sentence;
};


module.exports = {
    sqlBuilder
}