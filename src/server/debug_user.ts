
import db from './db';

const targetId = 'a598b436-aee7-4f54-9d00-6984aa01a7fb';

async function checkUser() {
    try {
        const user = await db('users').where('id', targetId).first();
        if (user) {
            console.log("User EXISTS:", user.first_name, user.last_name);
        } else {
            console.log("User DOES NOT EXIST:", targetId);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

checkUser();
