import knex from '../src/server/db';
import { v4 as uuidv4 } from 'uuid';

async function runTest() {
    console.log('Starting HMO Authorization Workflow Test...');

    let hmoProviderId: string | null = null;
    let patientId: string | null = null;
    let userId: string | null = null;
    let preauthId: string | null = null;
    let authCode: string | null = null;

    try {
        // 1. Create Dummy HMO Provider
        const [hmoProvider] = await knex('hmo_providers').insert({
            id: uuidv4(),
            name: 'Test HMO Provider',
            code: 'TEST-HMO',
            is_active: true
        }).returning('*');
        hmoProviderId = hmoProvider.id;
        console.log('✅ Created HMO Provider:', hmoProvider.name);

        // 2. Create Dummy Patient
        const [patient] = await knex('patients').insert({
            first_name: 'Test',
            last_name: 'Patient',
            mrn: `TEST-${Date.now()}`,
            date_of_birth: '1990-01-01',
            gender: 'male',
            phone: '08012345678',
            email: 'test@example.com',
            hmo_provider_id: hmoProviderId,
            status: 'active'
        }).returning('*');
        patientId = patient.id;
        console.log('✅ Created Patient:', patient.first_name, patient.last_name);

        // 3. Create Dummy User (Admin)
        const [user] = await knex('users').insert({
            id: uuidv4(),
            email: `admin-${Date.now()}@test.com`,
            password: 'hashed_password',
            first_name: 'Test',
            last_name: 'Admin',
            role: 'admin',
            is_active: true
        }).returning('*');
        userId = user.id;
        console.log('✅ Created Admin User:', user.email);

        // 4. Create Pre-authorization
        authCode = `AUTH-TEST-${Date.now()}`;
        const [preauth] = await knex('hmo_preauthorizations').insert({
            id: uuidv4(),
            authorization_code: authCode,
            patient_id: patientId,
            hmo_provider_id: hmoProviderId,
            requested_by: userId,
            request_date: new Date().toISOString(),
            expiry_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
            status: 'approved', // Auto-approve for test
            approval_date: new Date().toISOString(),
            approved_amount: 5000,
            is_used: false
        }).returning('*');
        preauthId = preauth.id;
        console.log('✅ Created Pre-authorization:', authCode);

        // 5. Test Check Active Authorization (Before Verification)
        console.log('\n--- Test 1: Check Active Auth (Before Verification) ---');
        const activeAuthBefore = await knex('hmo_preauthorizations')
            .select('hmo_preauthorizations.*')
            .where('hmo_preauthorizations.patient_id', patientId)
            .where('hmo_preauthorizations.status', 'approved')
            .where('hmo_preauthorizations.expiry_date', '>=', new Date().toISOString().split('T')[0])
            .andWhere(function () {
                this.where('hmo_preauthorizations.is_used', false)
                    .orWhere('hmo_preauthorizations.verified_at', '>=', new Date().toISOString().split('T')[0]);
            })
            .orderBy('hmo_preauthorizations.created_at', 'desc')
            .first();

        if (activeAuthBefore) {
            console.log('✅ SUCCESS: Active authorization found (Unused)');
        } else {
            console.error('❌ FAILURE: No active authorization found (Should be found)');
        }

        // 6. Verify Authorization (Simulate /api/preauth/verify/submit)
        console.log('\n--- Simulating Verification ---');
        await knex('hmo_preauthorizations')
            .where('id', preauthId)
            .update({
                is_used: true,
                verified_at: new Date().toISOString(),
                verified_by: userId,
                service_category: 'primary',
                verification_notes: 'Test verification',
                updated_at: new Date().toISOString()
            });
        console.log('✅ Authorization verified (marked as used)');

        // 7. Test Check Active Authorization (After Verification - Same Day)
        console.log('\n--- Test 2: Check Active Auth (After Verification - Same Day) ---');
        const activeAuthAfter = await knex('hmo_preauthorizations')
            .select('hmo_preauthorizations.*')
            .where('hmo_preauthorizations.patient_id', patientId)
            .where('hmo_preauthorizations.status', 'approved')
            .where('hmo_preauthorizations.expiry_date', '>=', new Date().toISOString().split('T')[0])
            .andWhere(function () {
                this.where('hmo_preauthorizations.is_used', false)
                    .orWhere('hmo_preauthorizations.verified_at', '>=', new Date().toISOString().split('T')[0]);
            })
            .orderBy('hmo_preauthorizations.created_at', 'desc')
            .first();

        if (activeAuthAfter) {
            console.log('✅ SUCCESS: Active authorization found (Verified Today)');
        } else {
            console.error('❌ FAILURE: No active authorization found (Should be found because verified today)');
        }

        // 8. Simulate "Tomorrow" (Update verified_at to yesterday)
        console.log('\n--- Simulating "Tomorrow" (Backdating verified_at) ---');
        const yesterday = new Date(Date.now() - 86400000).toISOString();
        await knex('hmo_preauthorizations')
            .where('id', preauthId)
            .update({
                verified_at: yesterday
            });
        console.log('✅ Backdated verified_at to yesterday');

        // 9. Test Check Active Authorization (After Verification - Next Day)
        console.log('\n--- Test 3: Check Active Auth (After Verification - Next Day) ---');
        const activeAuthNextDay = await knex('hmo_preauthorizations')
            .select('hmo_preauthorizations.*')
            .where('hmo_preauthorizations.patient_id', patientId)
            .where('hmo_preauthorizations.status', 'approved')
            .where('hmo_preauthorizations.expiry_date', '>=', new Date().toISOString().split('T')[0])
            .andWhere(function () {
                this.where('hmo_preauthorizations.is_used', false)
                    .orWhere('hmo_preauthorizations.verified_at', '>=', new Date().toISOString().split('T')[0]);
            })
            .orderBy('hmo_preauthorizations.created_at', 'desc')
            .first();

        if (!activeAuthNextDay) {
            console.log('✅ SUCCESS: No active authorization found (Correctly expired/used yesterday)');
        } else {
            console.error('❌ FAILURE: Active authorization found (Should NOT be found)');
        }

    } catch (error) {
        console.error('❌ Test Failed:', error);
    } finally {
        // Cleanup
        console.log('\n--- Cleanup ---');
        if (preauthId) await knex('hmo_preauthorizations').where('id', preauthId).del();
        if (patientId) await knex('patients').where('id', patientId).del();
        if (hmoProviderId) await knex('hmo_providers').where('id', hmoProviderId).del();
        if (userId) await knex('users').where('id', userId).del();

        await knex.destroy();
        console.log('✅ Cleanup complete');
    }
}

runTest();
