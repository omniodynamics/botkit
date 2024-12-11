const net = require('net');

// POP3 client
const pop3Client = new net.Socket();

pop3Client.connect(1100, 'localhost', () => {
    console.log('Connected to POP3 server');
    
    // Wait for server greeting
    pop3Client.once('data', (greeting) => {
        console.log('Server greeting:', greeting.toString());
        
        // USER command
        pop3Client.write('USER testuser\r\n');
        pop3Client.once('data', (userResponse) => {
            console.log('USER response:', userResponse.toString());
            
            // PASS command
            pop3Client.write('PASS testpassword\r\n');
            pop3Client.once('data', (passResponse) => {
                console.log('PASS response:', passResponse.toString());
                
                // LIST command
                pop3Client.write('LIST\r\n');
                pop3Client.once('data', (listResponse) => {
                    console.log('LIST response:', listResponse.toString());
                    
                    // Check if there is at least one message
                    if (listResponse.toString().includes('+OK')) {
                        // RETR command for first message
                        pop3Client.write('RETR 1\r\n');
                        pop3Client.once('data', (retrResponse) => {
                            console.log('RETR response:', retrResponse.toString());
                            // Wait for the end of the message (marked by a dot on a new line)
                            pop3Client.once('data', (messageEnd) => {
                                console.log('End of message:', messageEnd.toString());
                                
                                // QUIT command
                                pop3Client.write('QUIT\r\n');
                                pop3Client.once('data', (quitResponse) => {
                                    console.log('QUIT response:', quitResponse.toString());
                                    pop3Client.end();
                                });
                            });
                        });
                    } else {
                        console.log('No messages to retrieve.');
                        pop3Client.write('QUIT\r\n');
                        pop3Client.once('data', (quitResponse) => {
                            console.log('QUIT response:', quitResponse.toString());
                            pop3Client.end();
                        });
                    }
                });
            });
        });
    });
});

pop3Client.on('data', (data) => {
    console.log('Additional data from POP3 Server:', data.toString());
});

pop3Client.on('close', () => console.log('POP3 connection closed'));

pop3Client.on('error', (err) => {
    console.error('POP3 client error:', err);
});