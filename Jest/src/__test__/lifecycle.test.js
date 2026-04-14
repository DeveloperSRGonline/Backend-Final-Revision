const SimpleDatabase = require('./helpers/simpleDb');

describe('Database Lifecycle Practice', () => {
  let db;

  // beforeAll: Runs ONCE before all tests
  beforeAll(() => {
    console.log('\n=== beforeAll: Starting database ===');
    db = new SimpleDatabase();
    db.activate();
  });

  // beforeEach: Runs before EACH test
  beforeEach(() => {
    console.log('--- beforeEach: Cleaning database ---');
    db.clean();
  });

  // afterEach: Runs after EACH test
  afterEach(() => {
    console.log('--- afterEach: Cleanup done ---\n');
  });

  // afterAll: Runs ONCE after all tests
  afterAll(() => {
    console.log('=== afterAll: Closing database ===');
    db.close();
  });

  it('should insert and find a user', () => {
    console.log('Test 1: Inserting user');
    db.insert({ username: 'testuser', email: 'test@example.com' });
    
    const users = db.find();
    expect(users.length).toBe(1);
    expect(users[0].username).toBe('testuser');
  });

  it('should start with empty database', () => {
    console.log('Test 2: Checking database is empty');
    const users = db.find();
    expect(users.length).toBe(0);
  });

  it('should insert multiple users', () => {
    console.log('Test 3: Inserting multiple users');
    db.insert({ username: 'user1', email: 'user1@example.com' });
    db.insert({ username: 'user2', email: 'user2@example.com' });
    
    const users = db.find();
    expect(users.length).toBe(2);
  });
});
