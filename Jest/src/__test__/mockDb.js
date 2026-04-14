class MockDatabase{
    constructor(){
        this.users = [];
        this.isActivated = false;
    }

    // start the mock database (like starting mongodb server)
    activate(){
        this.isActivated = true;
        console.log('Mock database activated');
    }

    // Clear all data (keep database running)
    clean() {
        this.users = [];
        console.log("Mock Database cleaned");
    }

    // Insert a user (like MongoDB insert)
    insert(user) {
        if (!this.isActivated) {
            throw new Error("Database not activated");
        }
        this.users.push(user);
        return user;
    }

    // Find all users (like MongoDB find)
    find() {
        if (!this.isActivated) {
            throw new Error("Database not activated");
        }
        return this.users;
    }

    // Stop the database
    stop() {
        this.isActivated = false;
        this.users = [];
        console.log("Mock Database stopped");
    }
}

module.exports = new MockDatabase();
