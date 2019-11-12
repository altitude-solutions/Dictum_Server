let body = {
    user: 'Javier',
    pass: '1234',
    permisos: [
        '1-a',
        '2-b'
    ],
    token: 'r7812ijhu812h877h'
}


console.log(body);

body = Object.entries(body);

body.forEach(element => {
    console.log(element);
});