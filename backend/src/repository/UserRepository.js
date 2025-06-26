const BaseRepository = require("./BaseRepository");

class UserRepository extends BaseRepository {
    constructor(db) {
        super(db, 'users');
    }
}

module.exports = UserRepository;