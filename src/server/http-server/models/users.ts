import * as sqlite3 from 'sqlite3';

interface User {
    id: number;
    name: string;
    age: number;
}

interface Address {
    id: number;
    street: string;
    city: string;
    userId: number;
}


class AddressModel {
    private db: sqlite3.Database;

    constructor(dbPath: string) {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error connecting to the database:', err.message);
            } else {
                console.log('Connected to the SQLite database.');
            }
        });
    }

    public all(): Promise<Address[]> {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM Address", [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    if (rows.length === 1) {
                        const result = rows[0];
                        resolve(result ? [result as Address] : []);
                    } else {
                        resolve(rows as Address[]);
                    }
                }
            });
        }); 
    }
}

class UserDatabase {
    private db: sqlite3.Database;

    constructor(dbPath: string) {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error connecting to the database:', err.message);
            } else {
                console.log('Connected to the SQLite database.');
            }
        });
    }

    public getAllUsers(): Promise<User[]> {
        return this.executeSelect<User[]>('SELECT * FROM Users', [], false);
    }

    public getUserById(id: number): Promise<User[]> {
        return this.executeSelect<User>('SELECT * FROM Users WHERE id = ?', [id], true);
    }

    public findUsersByRegex(property: keyof User, likePattern: string): Promise<User[]> {
        // Convert regex to LIKE pattern if possible, or use GLOB for simpler patterns
        return this.executeSelect<User[]>(`SELECT * FROM Users WHERE ${property} LIKE ?`, [likePattern]);
    }

    public createUser(user: Omit<User, 'id'>): Promise<number> {
        return new Promise((resolve, reject) => {
            this.db.run('INSERT INTO Users (name, age) VALUES (?, ?)', 
                [user.name, user.age], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                });
        });
    }

    public updateUser(id: number, user: Partial<User>): Promise<void> {
        const fields = Object.keys(user).map(k => `${k} = ?`).join(', ');
        const values = Object.values(user);
        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE Users SET ${fields} WHERE id = ?`, [...values, id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public deleteUser(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM Users WHERE id = ?', [id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public closeDbConnection(): Promise<void> {
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

private async executeSelect<T>(sql: string, params: any[] = [], singleResult = false): Promise<User[]> {
    return new Promise((resolve, reject) => {
        this.db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                if (singleResult) {
                    const result = rows[0];
                    resolve(result ? [result as User] : Array<User>());
                } else {
                    // For multiple results, ensure we return an array of T or an empty array
                    resolve(rows as User[]);
                }
            }
        });
    });
}
}

// Usage example in an async context
async function main() {
    const userDb = new UserDatabase('./users.db');
    const addrDb = new AddressModel('./users.db');
    const db = new Model<Address>('./users.db', 'Address');
    
    try {
        // Example usage of new methods
        const allUsers = await userDb.getAllUsers();
        console.log('All users:', allUsers);

        const userById = await userDb.getUserById(1);
        console.log('User by ID:', userById);

        const usersByRegex = await userDb.findUsersByRegex('name', 'J%');
        console.log('Users by regex:', usersByRegex);

        const newUserId = await userDb.createUser({ name: 'New User', age: 30});
        console.log('New user ID:', newUserId);

        await userDb.updateUser(newUserId, { age: 31 });
        console.log('User updated');

        await userDb.deleteUser(newUserId);
        console.log('User deleted');

        const allAddrs = await db.all();
        console.log(allAddrs);

        const addr = {
            city: "Kentville",
            street: "B-520 Main Street",
            userId: allUsers[0].id,
        } as Address;

        const homeId = await db.create(addr);
        console.log(homeId);

        const homeUpdated = await db.update(homeId, {id: homeId, city: "San Francisco"} as Partial<Address>);
        console.log(homeUpdated);

        await db.delete(homeId);

    } catch (error) {
        console.error('Database operation failed:', error);
    } finally {
        await userDb.closeDbConnection();
    }
}

main();