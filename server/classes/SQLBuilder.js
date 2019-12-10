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
            sentence += operation + ' ';
            if (body.keys.includes('fields')) {
                let i = body.keys.indexOf('fields');
                sentence += body.values[i].join(',');
            } else {
                sentence += '*'
            }
            sentence += ' from ' + table;
            if (body.keys.includes('searchParams')) {
                sentence += ` where `;
                let i = body.keys.indexOf('searchParams');
                let arg = [];
                for (let index = 0; index < body.values[i].length; index++) {
                    switch (typeof body.values[i][index][1]) {
                        case 'object':
                            arg.push(`${body.values[i][index][0]} regexp "${JSON.stringify(body.values[i][index][1]).replace(/"/g, '\'')}"`);
                            break;
                        case 'string':
                            arg.push(`${body.values[i][index][0]} regexp "${body.values[i][index][1]}"`);
                            break;
                        case 'number':
                            arg.push(`${body.values[i][index][0]} regexp ${body.values[i][index][1]}`);
                            break;
                        case 'boolean':
                            arg.push(`${body.values[i][index][0]} regexp ${body.values[i][index][1]? 1:0}`);
                            break;
                    }
                }
                sentence += arg.join(' and ');
            }
            if (body.keys.includes('bounds')) {
                let i = body.keys.indexOf('bounds');
                sentence += ` limit ${body.values[i][0]}, ${body.values[i][1]}`;
            }
            sentence += ';';
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
            sentence += operation + ' from ' + table + ' where ';
            let ind = body.keys.indexOf('searchParams');

            let arg2 = [];
            for (let index = 0; index < body.values[ind].length; index++) {
                switch (typeof body.values[ind][index][1]) {
                    case 'object':
                        arg2.push(`${body.values[ind][index][0]}="${JSON.stringify(body.values[ind][index][1]).replace(/"/g, '\'')}"`);
                        break;
                    case 'string':
                        arg2.push(`${body.values[ind][index][0]}="${body.values[ind][index][1]}"`);
                        break;
                    case 'number':
                        arg2.push(`${body.values[ind][index][0]}=${body.values[ind][index][1]}`);
                        break;
                    case 'boolean':
                        arg2.push(`${body.values[ind][index][0]}=${body.values[ind][index][1]? 1:0}`);
                        break;
                }
            }
            sentence += arg2.join(' and ');
            sentence += ';';
            break;
        case 'update':
        case 'UPDATE':
            let searchParamsIndex = body.keys.indexOf('searchParams');
            sentence += 'update ' + table + ' set ';
            let i = body.keys.indexOf('fields');
            let arg = Object.entries(body.values[i]);
            let updateString = [];
            arg.forEach(element => {
                switch (typeof element[1]) {
                    case 'number':
                        updateString.push(`${element[0]}=${element[1]}`);
                        break;
                    case 'boolean':
                        updateString.push(`${element[0]}=${element[1]?1:0}`);
                        break;
                    case 'string':
                        updateString.push(`${element[0]}=\"${element[1]}\"`);
                        break;
                    case 'object':
                        updateString.push(`${element[0]}=${JSON.stringify(element[1]).replace(/"/g, '\'')}`);
                        break;
                }
            });
            sentence += updateString.join(',');
            sentence += ' where ' + body.values[searchParamsIndex][0][0] + '="' + body.values[searchParamsIndex][0][1] + '";';
            break;
    }
    return sentence;
};


module.exports = {
    sqlBuilder
}