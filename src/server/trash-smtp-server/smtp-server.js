const net = require('net');
const fs = require('fs').promises;
const path = require('path');

const server = net.createServer((socket) => {
    socket.write('220 smtp.example.com ESMTP\r\n');
    
    let currentMail = null;

    socket.on('data', async (data) => {
        const command = data.toString().trim().split(' ')[0].toUpperCase();

        switch(command) {
            case 'HELO':
                socket.write('250 smtp.example.com Hello\r\n');
                break;
            case 'MAIL':
                currentMail = {from: data.toString().match(/FROM:(.*)/i)[1].trim()};
                socket.write('250 OK\r\n');
                break;
            case 'RCPT':
                if (!currentMail) {
                    socket.write('503 Bad sequence of commands\r\n');
                    return;
                }
                currentMail.to = data.toString().match(/TO:(.*)/i)[1].trim();
                socket.write('250 OK\r\n');
                break;
            case 'DATA':
                if (!currentMail || !currentMail.to) {
                    socket.write('503 Bad sequence of commands\r\n');
                    return;
                }
                socket.write('354 End data with <CR><LF>.<CR><LF>\r\n');
                socket.once('data', async (mailData) => {
                    currentMail.data = mailData.toString().split('\r\n.\r\n')[0];
                    socket.write('250 OK\r\n');
                    
                    // Write email to file
                    const fileName = `email_${Date.now()}_${currentMail.to.replace(/[^a-z0-9]/gi, '_')}.txt`;
                    const filePath = path.join(__dirname, 'mails', fileName);

                    try {
                        await fs.mkdir(path.dirname(filePath), { recursive: true });
                        await fs.writeFile(filePath, 
                            `From: ${currentMail.from}\r\n` +
                            `To: ${currentMail.to}\r\n` +
                            `Data:\r\n${currentMail.data}`);
                        console.log(`Mail saved to ${filePath}`);
                    } catch (error) {
                        console.error('Error saving email:', error);
                    }

                    currentMail = null;
                });
                break;
            case 'QUIT':
                socket.write('221 Bye\r\n');
                socket.end();
                break;
            default:
                socket.write('500 Command not recognized\r\n');
        }
    });

    socket.on('error', (err) => {
        console.error('SMTP server error:', err);
    });
});

server.listen(2525, () => {
    console.log('SMTP server listening on port 2525');
});