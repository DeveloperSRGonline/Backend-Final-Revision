const request = require('supertest')
const app = require('../app')

describe("GET /", () => {
    it('should return 200 and Hello World message',async ()=> {
        const res = await request(app).get("/")
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty("message","Hello World")
    })
})

describe("POST /api/auth/register",()=> {
    it("should return 201 and User registered successfully message",async()=>{
        const res = await request(app).post("/api/auth/register").send({
            username:"testuser",
            email:"testuser@example.com",
            password:"password123"
        })
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message","User registered successfully");
        expect(res.body).toHaveProperty("user");
        expect(res.body.user).toHaveProperty("username","testuser");
        expect(res.body.user).toHaveProperty("email","testuser@example.com");
    })
})