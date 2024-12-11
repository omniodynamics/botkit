import * as sqlite3 from 'sqlite3';


class Sqlite3DAO<T> {
    private db: sqlite3.Database;
    private tableName: string;

    constructor(dbPath: string, tableName: string) {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error connecting to the database:', err.message);
            } else {
                console.log('Connected to the SQLite database.');
            }
        });
        this.tableName = tableName;
    }

    public all(): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM ${this.tableName}`, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    if (rows.length === 1) {
                        const result = rows[0];
                        resolve(result ? [result as T] : []);
                    } else {
                        resolve(rows as T[]);
                    }
                }
            });
        }); 
    }

    public create(data: Omit<T, 'id'>): Promise<number> {
        return new Promise((resolve, reject) => {
            // Extract keys and values from data
            const keys = Object.keys(data);
            const placeholders = keys.map(() => '?').join(', ');
            const values = keys.map(key => (data as any)[key]);

            // Construct the SQL query dynamically
            const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;

            this.db.run(sql, values, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    public update(id: number, data: Partial<T>): Promise<void> {
        const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
        const values = Object.values(data);

        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE ${this.tableName} SET ${fields} WHERE id = ?`, [...values, id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public delete(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM ${this.tableName} WHERE id = ?`, [id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public close(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Database connection closed.');
                    resolve();
                }
            });
        });
    }
}
class Model<T> {
    private db: sqlite3.Database;
    private tableName: string;

    constructor(dbPath: string, tableName: string) {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error connecting to the database:', err.message);
            } else {
                console.log('Connected to the SQLite database.');
            }
        });
        this.tableName = tableName;
    }

    public all(): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM ${this.tableName}`, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    if (rows.length === 1) {
                        const result = rows[0];
                        resolve(result ? [result as T] : []);
                    } else {
                        resolve(rows as T[]);
                    }
                }
            });
        }); 
    }

    public create(data: Omit<T, 'id'>): Promise<number> {
        return new Promise((resolve, reject) => {
            // Extract keys and values from data
            const keys = Object.keys(data);
            const placeholders = keys.map(() => '?').join(', ');
            const values = keys.map(key => (data as any)[key]);

            // Construct the SQL query dynamically
            const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;

            this.db.run(sql, values, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    public update(id: number, data: Partial<T>): Promise<void> {
        const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
        const values = Object.values(data);

        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE ${this.tableName} SET ${fields} WHERE id = ?`, [...values, id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public delete(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM ${this.tableName} WHERE id = ?`, [id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public close(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Database connection closed.');
                    resolve();
                }
            });
        });
    }
}