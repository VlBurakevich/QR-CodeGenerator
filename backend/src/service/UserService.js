const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'my-super-secret-key';
const JWT_EXPIRES_IN = '365d';

class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async createAnonymousSession() {
        try {
            const newUser = await this.userRepository.create({});

            const payload = {id: newUser.id};

            const token = jwt.sign(payload, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN,
            });

            return {token, userId: newUser.id};
        } catch (error) {
            console.error('Error creating anonymous user', error);
            throw new Error('Could not create session.');
        }
    }
}

module.exports = UserService;