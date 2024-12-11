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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = __importStar(require("sqlite3"));
class Model {
    constructor(dbPath, tableName) {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error connecting to the database:', err.message);
            }
            else {
                console.log('Connected to the SQLite database.');
            }
        });
        this.tableName = tableName;
    }
    all() {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM ${this.tableName}`, [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (rows.length === 1) {
                        const result = rows[0];
                        resolve(result ? [result] : []);
                    }
                    else {
                        resolve(rows);
                    }
                }
            });
        });
    }
    create(data) {
        return new Promise((resolve, reject) => {
            // Extract keys and values from data
            const keys = Object.keys(data);
            const placeholders = keys.map(() => '?').join(', ');
            const values = keys.map(key => data[key]);
            // Construct the SQL query dynamically
            const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
            this.db.run(sql, values, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this.lastID);
                }
            });
        });
    }
    update(id, data) {
        const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
        const values = Object.values(data);
        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE ${this.tableName} SET ${fields} WHERE id = ?`, [...values, id], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    delete(id) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM ${this.tableName} WHERE id = ?`, [id], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                }
                else {
                    console.log('Database connection closed.');
                    resolve();
                }
            });
        });
    }
}
class AddressModel {
    constructor(dbPath) {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error connecting to the database:', err.message);
            }
            else {
                console.log('Connected to the SQLite database.');
            }
        });
    }
    all() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM Address", [], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    if (rows.length === 1) {
                        const result = rows[0];
                        resolve(result ? [result] : []);
                    }
                    else {
                        resolve(rows);
                    }
                }
            });
        });
    }
}
class UserDatabase {
    constructor(dbPath) {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error connecting to the database:', err.message);
            }
            else {
                console.log('Connected to the SQLite database.');
            }
        });
    }
    getAllUsers() {
        return this.executeSelect('SELECT * FROM Users', [], false);
    }
    getUserById(id) {
        return this.executeSelect('SELECT * FROM Users WHERE id = ?', [id], true);
    }
    findUsersByRegex(property, likePattern) {
        // Convert regex to LIKE pattern if possible, or use GLOB for simpler patterns
        return this.executeSelect(`SELECT * FROM Users WHERE ${property} LIKE ?`, [likePattern]);
    }
    createUser(user) {
        return new Promise((resolve, reject) => {
            this.db.run('INSERT INTO Users (name, age) VALUES (?, ?)', [user.name, user.age], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this.lastID);
                }
            });
        });
    }
    updateUser(id, user) {
        const fields = Object.keys(user).map(k => `${k} = ?`).join(', ');
        const values = Object.values(user);
        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE Users SET ${fields} WHERE id = ?`, [...values, id], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    deleteUser(id) {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM Users WHERE id = ?', [id], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    closeDbConnection() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                }
                else {
                    console.log('Database connection closed.');
                    resolve();
                }
            });
        });
    }
    executeSelect(sql_1) {
        return __awaiter(this, arguments, void 0, function* (sql, params = [], singleResult = false) {
            return new Promise((resolve, reject) => {
                this.db.all(sql, params, (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        if (singleResult) {
                            const result = rows[0];
                            resolve(result ? [result] : Array());
                        }
                        else {
                            // For multiple results, ensure we return an array of T or an empty array
                            resolve(rows);
                        }
                    }
                });
            });
        });
    }
}
// Usage example in an async context
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const userDb = new UserDatabase('./users.db');
        const addrDb = new AddressModel('./users.db');
        const db = new Model('./users.db', 'Address');
        try {
            // Example usage of new methods
            const allUsers = yield userDb.getAllUsers();
            console.log('All users:', allUsers);
            const userById = yield userDb.getUserById(1);
            console.log('User by ID:', userById);
            const usersByRegex = yield userDb.findUsersByRegex('name', 'J%');
            console.log('Users by regex:', usersByRegex);
            const newUserId = yield userDb.createUser({ name: 'New User', age: 30 });
            console.log('New user ID:', newUserId);
            yield userDb.updateUser(newUserId, { age: 31 });
            console.log('User updated');
            yield userDb.deleteUser(newUserId);
            console.log('User deleted');
            const allAddrs = yield db.all();
            console.log(allAddrs);
            const addr = {
                city: "Kentville",
                street: "B-520 Main Street",
                userId: allUsers[0].id,
            };
            const homeId = yield db.create(addr);
            console.log(homeId);
            const homeUpdated = yield db.update(homeId, { id: homeId, city: "San Francisco" });
            console.log(homeUpdated);
            yield db.delete(homeId);
        }
        catch (error) {
            console.error('Database operation failed:', error);
        }
        finally {
            yield userDb.closeDbConnection();
        }
    });
}
main();
