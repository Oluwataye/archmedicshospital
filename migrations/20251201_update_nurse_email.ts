export async function up(knex: any): Promise<void> {
    await knex('users')
        .where('role', 'nurse')
        .update({ email: 'nurse@archmedics.com' });
}

export async function down(knex: any): Promise<void> {
    await knex('users')
        .where('role', 'nurse')
        .update({ email: 'nurse.williams@archmedics.com' });
}

