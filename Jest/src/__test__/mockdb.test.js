const mockDb = require('./mockDb');

describe("Mock Database Tests", () => {
    
    // beforeAll: Runs ONCE before all tests
    beforeAll(() => {
        console.log("=== beforeAll: Starting database ===");
        mockDb.activate();
    });
 
    // afterAll: Runs ONCE after all tests
    afterAll(() => {
        console.log("=== afterAll: Stopping database ===");
        mockDb.stop();
    });
 
    test("should insert a user", () => {
        const user = { username: "testuser", email: "test@example.com" };
        mockDb.insert(user);
        
        const users = mockDb.find();
        expect(users.length).toBe(1);
        expect(users[0].username).toBe("testuser");
    });
 
    test("should find all users", () => {
        mockDb.insert({ username: "user1", email: "user1@example.com" });
        mockDb.insert({ username: "user2", email: "user2@example.com" });
        
        const users = mockDb.find();
        expect(users.length).toBe(3); // 1 from previous test + 2 new
    });
});