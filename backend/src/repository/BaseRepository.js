class BaseRepository {
    constructor(db, tableName) {
        if (!db || !tableName) {
            throw new Error('Database connection and table name is required for repository');
        }
        this.db = db;
        this.tableName = tableName;
    }

    async findById(id) {
        return this.db(this.tableName).where({id}).first();
    }

    async findAll() {
        return this.db(this.tableName).select('*');
    }

    async findPaginated({page = 1, pageSize = 10, filters = {}, orderBy = 'id', orderDirection = 'ASC'}) {
        return this.db(this.tableName)
            .select('*')
            .where(filters)
            .orderBy(orderBy, orderDirection)
            .offset((page - 1) * pageSize)
            .limit(pageSize);
    }

    async create(data) {
        const [result] = await this.db(this.tableName).insert(data).returning('*');
        return result;
    }

    async update(id, data) {
        const dataToUpdate = {...data};
        delete dataToUpdate.id;
        delete dataToUpdate.created_at;

        const [result] = await this.db(this.tableName)
            .where({id})
            .update({
                ...dataToUpdate,
                updatedAt: new Date()
            })
            .returning('*');

        return result;
    }

    async destroy(id) {
        return this.db(this.tableName).where({id}).delete();
    }
}

module.exports = BaseRepository;