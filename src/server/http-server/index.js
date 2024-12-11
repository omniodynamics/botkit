#!/usr/bin/env ts-node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const ejs = __importStar(require("ejs"));
class HttpRouter {
}
class HttpServer {
    constructor(port, hostname, router) {
        this.port = port;
        this.hostname = hostname;
        this.server = http.createServer(this.handleRequest.bind(this));
        this.nonce = crypto.randomBytes(16).toString('base64');
        this.router = router;
    }
    handleRequest(req, res) {
        console.log(req.headers);
        console.log(`http://${req.headers.host}${req.url}`);
        const data = {
            title: "Hello",
            users: [{ "name": "Ryan Warren" }, { "name": "Felix Warren" }, { "name": "Charlotte Warren" }]
        };
        fs.readFile(path.join(__dirname, "/views/index.html.ejs"), 'utf8', (err, template) => {
            let html = ejs.render(template, data);
            res.write(html);
            res.end();
        });
    }
    start() {
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
