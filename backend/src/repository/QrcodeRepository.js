const BaseRepository = require('./BaseRepository');

class QrcodeRepository extends BaseRepository{

    constructor(db) {
        super(db,'qrcodes');
    }

    async findByUser(userId, paginationOptions = {}) {
        const { page = 1, pageSize = 10, orderBy = 'created_at', orderDirection = 'DESC' } = paginationOptions;

        return this.findPaginated({
            page,
            pageSize,
            filters: {user_id: userId},
            orderBy,
            orderDirection,
        });
    }

    async findByValue(value) {
        return this.db(this.tableName).where({value}).first();
    }
}

module.exports = QrcodeRepository;