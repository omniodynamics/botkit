import * as sqlite3 from 'sqlite3';

// Define a generic DAO interface
interface DAO<T> {
    all(): Promise<T[]>;
    create(value: Partial<T>): void; 
}

// Define the Sqlite3Driver class implementing DAO
class Sqlite3Driver<T> implements DAO<T> {
    private db: sqlite3.Database;
    private tableName: string;

    constructor(db: sqlite3.Database, tableName: string) {
        this.db = db;
        this.tableName = tableName;
    }

    // Implement 'all' method to fetch all records from the table
    all(): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM ${this.tableName}`, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows as T[]); // Cast rows to T[]
                }
            });
        });
    }

    create(value: Partial<T>): void {
        // Prepare SQL statement
        const fields = Object.keys(value);
        const placeholders = fields.map(() => '?').join(', ');
        const sql = `INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES (${placeholders})`;
    
            // Extract values for the placeholders
        const values = Object.values(value);
        const stmt = this.db.prepare(sql, values);
        
        new Promise((resolve, reject) => {
            stmt.run(values, function(this, err) {
                console.log(this);
                resolve(this.lastID);
            });
            
        }).then((value) => {
            stmt.finalize();
            console.log(value);
        });
            
        


    }
}

async function hello(msg, callback) {
    return new Promise((resolve, reject) => {   
        console.log("Hello start")
        callback(msg);
        console.log("Hello returning...")
    });
}

function main() {
    setTimeout(() => { console.log("main starting..."); }, 1000);
    hello("Hi Ryan",  (values) => {
        setTimeout(() => {console.log("setTimeout done  ...");}, 1000);
        console.log("main done");
    }).then(() => console.log("Done hello!"));
}



// // Example usage in an async IIFE
// (async () => {
//     const db = new sqlite3.Database("data.db");
//     const userDAO = new Sqlite3Driver<{ name: string; age: number; id: number }>(db, "Users");

//     try {
//         const newUser = await userDAO.create({ name: "Joe Doe", age: 10000 });
//         console.log("New User Created:", newUser);
//     } catch (error) {
//         console.error("Failed to create user:", error);
//     } finally {
//         db.close((err) => {
//             if (err) {
//                 console.error("Error closing database:", err);
//             } else {
//                 console.log("Database connection closed.");
//             }
//         });
//     }
// })();

// function main() {
//     const db = new sqlite3.Database("data.db");
//     const userDAO = new Sqlite3Driver<{ name: string; age: number; id: number }>(db, "Users");
//     const u1 = userDAO.create({ name: "Joe Doe", age: 10000 });
//     console.log(u1);
// }

// setInterval(() => {
//     console.log("bump");
// }, 1000);

(function () {
    let context = "Hi";

    new Promise((resolve, reject) => {
        setTimeout(() => { console.log(context); console.log("setTimeout logging..."); context = "Ryan";    }, 5000);
    });

    new Promise((resolve, reject) => {
        console.log("DONE");
    });

    setTimeout(() => {
            console.log(context);
    }, 10000);

})();

console.log("EXIT")
setTimeout(() =>{}, 10000);