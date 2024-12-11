const net = require('net');
const mails = []; // Storing mails in memory for simplicity

const server = net.createServer((socket) => {
    socket.write('+OK POP3 server ready\r\n');
    
    let loggedIn = false;
    let user = null;

    socket.on('data', (data) => {
        const command = data.toString().trim().split(' ')[0].toUpperCase();
        const params = data.toString().trim().split(' ').slice(1);

        switch(command) {
            case 'USER':
                user = params[0];
                socket.write('+OK\r\n');
                break;
            case 'PASS':
                if (user) { // Basic authentication check
                    loggedIn = true;
                    socket.write('+OK maildrop locked and ready\r\n');
                } else {
                    socket.write('-ERR Authentication failed\r\n');
                }
                break;
            case 'LIST':
                if (!loggedIn) {
                    socket.write('-ERR Authentication required\r\n');
                    return;
                }
                socket.write('+OK\r\n');
                mails.forEach((mail, index) => {
                    socket.write(`${index+1} ${mail.length}\r\n`);
                });
                socket.write('.\r\n');
                break;
            case 'RETR':
                if (!loggedIn) {
                    socket.write('-ERR Authentication required\r\n');
                    return;
                }
                const index = parseInt(params[0], 10) - 1;
                if (mails[index]) {
                    socket.write('+OK\r\n');
                    socket.write(mails[index]);
                    socket.write('\r\n.\r\n');
                } else {
                    socket.write('-ERR no such message\r\n');
                }
                break;
            case 'QUIT':
                socket.write('+OK POP3 server signing off\r\n');
                socket.end();
                break;
            default:
                socket.write('-ERR Unknown command\r\n');
        }
    });

    socket.on('error', (err) => {
        console.error('POP3 server error:', err);
    });
});

server.listen(1100, () => {
    console.log('POP3 server listening on port 1100');
});