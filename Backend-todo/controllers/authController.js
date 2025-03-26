class AuthController{
    constructor(authService) {
        this.authService = authService
    }

    register = async (req, res, next) => {
        try {
            const user = await this.authService.register(req.body)
            res.status(201).json({ message: 'User registered successfully', userId: user._id })
        } catch (error) {
            next(error)
        }
    };

    login = async (req, res, next) => {
        try {
            const token = await this.authService.login(req.body)
            res.json( {token })
        } catch (error) {
            next(error)
        }
    }

    googleLogin = async (req, res, next) => {
        try {
            const { credential } = req.body;
            if (!credential) {
                return res.status(400).json({ message: 'Credential is required' });
            }
            const { token, email } = await this.authService.googleLogin({ credential });
            res.json({ token, email });
        } catch (error) {
            next(error);
        }
    };
}
module.exports = AuthController;