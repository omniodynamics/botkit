#!/usr/bin/env ts-node

import * as http from 'http';
import * as url from 'url';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as ejs from 'ejs';
import * as sqlite3 from 'sqlite3';

class HttpRouter {

}

class HttpServer {
  private server: http.Server;
  private hostname: string;
  private nonce: string;
  private router: HttpRouter;

  constructor(private port: number, hostname: string, router: HttpRouter) {
    this.hostname = hostname;
    this.server = http.createServer(this.handleRequest.bind(this));
    this.nonce = crypto.randomBytes(16).toString('base64');
    this.router = router;
  }
  
  private handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    console.log(req.headers);
    console.log(`http://${req.headers.host}${req.url}`);

    const data = {
      title: "Hello",
      users: [{"name":"Ryan Warren"}, {"name":"Felix Warren"}, {"name":"Charlotte Warren"}]
    };  

    fs.readFile(path.join(__dirname, "/views/index.html.ejs"), 'utf8', (err, template) => {
      let html = ejs.render(template, data);
      res.write(html)
      res.end();
    });
  }

  public start() {
    this.server.listen(this.port, this.hostname, () => {
      console.log(`Server running at http://${this.hostname}:${this.port}/`);
    });
  }
}

const port = Number(process.env.PORT) || 3000;
const hostname = process.env.HOSTNAME || 'localhost';
const router = new HttpRouter();
const server = new HttpServer(port, hostname, router);
server.start();