const authService = require('../services/authService');
const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock the dependencies
jest.mock('../repositories/userRepository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
    describe('register', () => {
        it('should throw an error if user already exists', async () => {
            // Arrange: simulate that a user is found in the DB
            userRepository.findByEmail.mockResolvedValue({email: 'test@example.com'})

            await expect(
                authService.register({ username: 'test', email: 'test@example.com', password: 'password' })
            ).rejects.toThrow('User already exists')
        });
        it('should create a new user if no user exists', async () => {
            userRepository.findByEmail.mockResolvedValue(null)
            bcrypt.hash.mockResolvedValue('hashedpassword')
            userRepository.create.mockResolvedValue({
                _id: 'user123',
                username: 'test',
                email: 'test@example.com',
                password: 'hashedpassword'
            })
            const user = await authService.register({
                username: 'test',
                email: 'test@example.com',
                password: 'password'
            })

            // Assert
            expect(user).toHaveProperty('_id', 'user123')
            expect(user.password).toBe('hashedpassword')
        });
    });
    describe('login', () => {
        it('should throw an error if user is not found', async () => {
            // Arrange: simulate no user found
            userRepository.findByEmail.mockResolvedValue(null)

            await expect(
                authService.login({ email: 'notfound@example.com', password: 'password' })
            ).rejects.toThrow('Invalid credentials')
        });
        it('should return a JWT token on successful login', async () => {
            // Arrange: simulate successful login
            userRepository.findByEmail.mockResolvedValue({ _id: 'user123', password: 'hashedpassword' })
            bcrypt.compare.mockResolvedValue(true)
            jwt.sign.mockReturnValue('jwt-token')

            // Act
            const token = await authService.login({ email: 'test@example.com', password: 'password' })

            // Assert
            expect(token).toBe('jwt-token')
        });
    });
});