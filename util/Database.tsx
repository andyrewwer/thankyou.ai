import { Pool } from 'pg';

const connectionString = process.env.CONNECTION_STRING;

const pool = new Pool({
    connectionString,
});

export default {
    findAll: async function (tableName) {
        const result = await pool.query(`SELECT * from ${tableName}`);
        return result.rows.map(res => JSON.parse(snakeCaseToCamelCase(JSON.stringify(res))));
    },

    findById: async function (tableName, id) {
        const result = await pool.query(`SELECT * from ${tableName} where id = $1`, [id]);
        const rows = result.rows.map(res => JSON.parse(snakeCaseToCamelCase(JSON.stringify(res))));
        return rows[0];
    },

    findByField: async function (tableName, field, value) {
        field = camelToSnakeCase(field);
        const result = await pool.query(`SELECT * from ${tableName} where ${field} = $1`, [value]);
        return result.rows.map(res => JSON.parse(snakeCaseToCamelCase(JSON.stringify(res))));
    },

    save: async function (tableName, data) {
        let fields = '';
        let valuesList = '';
        let values = [];
        Object.keys(data).forEach((key, index) => {
            fields += `${camelToSnakeCase(key)}, `
            valuesList += `$${index + 1}, `
            values.push(data[key]);
        });
        fields = fields.substring(0, fields.length - 2);
        valuesList = valuesList.substring(0, valuesList.length - 2);
        await pool.query(`INSERT INTO ${tableName} (${fields}) VALUES (${valuesList})`, values)
    },

    update: async function (tableName, data, id) {
        let fields = '';
        let values = [];
        let index = 0;
        Object.keys(data).forEach(key => {
            if (key === "id") {
                return;
            }
            fields += `${camelToSnakeCase(key)} = $${++index}, `
            values.push(data[key]);
        });
        fields = fields.substring(0, fields.length - 2);
        await pool.query(`UPDATE ${tableName} SET ${fields} where id = $${index + 1}`, [...values, id])
    },

    updateField: async function (tableName, id, field, value) {
        field = camelToSnakeCase(field);
        await pool.query(`UPDATE ${tableName} SET ${field} = $1 where id = $2`, [value, id]);
    },
};

const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
const snakeCaseToCamelCase = str => str.replace(/_[a-z]/g, letter => `${letter[1].toUpperCase()}`);