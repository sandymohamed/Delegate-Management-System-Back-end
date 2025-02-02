const db = require('../../config/db.config');

const createExpense = async (store_id, agent_id, amount, description, date) => {
    try {
        const query = `
        INSERT INTO expenses (store_id, agent_id, amount, description, date)
        VALUES (?, ?, ?, ?, ?)
    `;

        const [results] = await db.query(query, [store_id, agent_id, amount, description, date]);

        if (results.affectedRows === 0) {
            return ({ success: false, error: 'Something went wrong!' });
        }
        return results;

    } catch (error) {
        console.log("error in createExpense", error);
        return error.message;
    }

}

const getExpensesByAgent = async (agent_id, date, store_id) => {
    try {
        const query = `
        SELECT * FROM expenses
        WHERE store_id = ? AND agent_id = ? AND date = ?
    `;
        const [results] = await db.query(query, [store_id, agent_id, date]);

        if (results.affectedRows === 0) {
            return ({ success: false, error: 'Something went wrong!' });
        }
        return results;

    } catch (error) {
        console.log("error in getExpensesByAgent", error);
        return error.message;
    }

}

const getAllExpenses = async (store_id) => {
    try {
        const query = `
        SELECT * FROM expenses
        WHERE store_id = ? 
    `;
        const [results] = await db.query(query, [store_id,]);

        if (results.affectedRows === 0) {
            return ({ success: false, error: 'Something went wrong!' });
        }
        return results;

    } catch (error) {
        console.log("error in getExpensesByAgent", error);
        return error.message;
    }

}

// Update a van
const updateExpense = async (id, amount, description, store_id) => {
    try {

        const query = `
        UPDATE expenses
        SET  amount = ? , description = ?
        WHERE id = ? AND store_id = ?
    `;
        const [results] = await db.query(query, [amount, description, id, store_id]);
        if (results.affectedRows === 0) {
            return ({ success: false, error: 'Something went wrong!' });
        }
        return results;

    } catch (error) {
        console.log("error in updateExpense", error);
        return error.message;
    }

}

// Delete a van
const deleteExpense = async (id, store_id) => {
    try {
        const query = 'DELETE FROM expenses WHERE id = ? AND store_id = ?';
        const [results] = await db.query(query, [id, store_id]);

        if (results.affectedRows === 0) {
            return ({ success: false, error: 'Something went wrong!' });
        }
        return results;

    } catch (error) {
        console.log("error in deleteExpense ", error);
        return error.message;
    }
}



module.exports = {
    createExpense,
    getExpensesByAgent,
    getAllExpenses,
    updateExpense,
    deleteExpense

}