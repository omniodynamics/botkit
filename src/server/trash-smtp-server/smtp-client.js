const net = require('net');

// SMTP client
const smtpClient = new net.Socket();

smtpClient.connect(2525, 'localhost', () => {
    console.log('Connected to SMTP server');
    // Wait for the server's 220 greeting before proceeding
    smtpClient.once('data', (greeting) => {
        console.log('Server greeting:', greeting.toString());
        
        smtpClient.write('HELO client\r\n');
        smtpClient.once('data', (heloResponse) => {
            console.log('HELO response:', heloResponse.toString());
            smtpClient.write('MAIL FROM:<sender@odinet.sh>\r\n');
            smtpClient.once('data', (mailFromResponse) => {
                console.log('MAIL FROM response:', mailFromResponse.toString());
                smtpClient.write('RCPT TO:<receiver@odinet.sh>\r\n');
                smtpClient.once('data', (rcptToResponse) => {
                    console.log('RCPT TO response:', rcptToResponse.toString());
                    smtpClient.write('DATA\r\n');
                    smtpClient.once('data', (dataResponse) => {
                        console.log('DATA response:', dataResponse.toString());
                        smtpClient.write('Subject: Test\r\n\r\nThis is a test email.\r\n.\r\n');
                        smtpClient.once('data', (dataEndResponse) => {
                            console.log('DATA end response:', dataEndResponse.toString());
                            smtpClient.write('QUIT\r\n');
                            smtpClient.once('data', (quitResponse) => {
                                console.log('QUIT response:', quitResponse.toString());
                                smtpClient.end();
                            });
                        });
                    });
                });
            });
        });
    });
});

smtpClient.on('data', (data) => {
    // This will log all data received from the server, but we use 'once' events above for specific responses
    console.log('Additional data from SMTP Server:', data.toString());
});

smtpClient.on('close', () => console.log('SMTP connection closed'));

smtpClient.on('error', (err) => {
    console.error('SMTP client error:', err);
});