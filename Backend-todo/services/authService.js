const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const userRepository = require('../repositories/userRepository');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthService {
    constructor(userRepo) {
        this.userRepo = userRepo
    }
    async register({username, email, password}) {
        const existingUser = await this.userRepo.findByEmail(email)
        if (existingUser){
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await this.userRepo.create(
            {
                username,
                email,
                password: hashedPassword
            }
        )
        return user;
    }

    async login({ email , password }) {
        const user = await this.userRepo.findByEmail(email)
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        const payload = {userId: user._id}
        const token = jwt.sign(payload,process.env.JWT_SECRET, {expiresIn: '1h'})
        return token
    }

    async googleLogin({ credential }) {
        try {
            // Verify the Google credential token
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            const email = payload.email;

            // Check if the user already exists
            let user = await this.userRepo.findByEmail(email);
            if (!user) {
                // Create a new user if not found; you can generate a random password as a placeholder
                const randomPassword = Math.random().toString(36).slice(-8);
                const hashedPassword = await bcrypt.hash(randomPassword, 10);
                user = await this.userRepo.create({
                    username: payload.name,
                    email,
                    password: hashedPassword
                });
            }
            // Generate a JWT token for our app's session
            const jwtPayload = { userId: user._id };
            const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
            return { token, email: user.email };
        } catch (error) {
            throw new Error('Google login failed');
        }
    }
}
module.exports = new AuthService(userRepository);