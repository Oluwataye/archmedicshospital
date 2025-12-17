import db from '../src/config/database';

async function checkLogoUrl() {
    try {
        const settings = await db('hospital_settings').first();
        console.log('Hospital Settings:');
        console.log('==================');
        console.log('Hospital Name:', settings.hospital_name);
        console.log('Logo URL:', settings.logo_url);
        console.log('Full settings:', JSON.stringify(settings, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkLogoUrl();
