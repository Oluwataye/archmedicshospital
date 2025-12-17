import type { Knex } from 'knex';

interface HospitalSettings {
    id: number;
    hospital_name: string;
    hospital_abbreviation: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    logo_url: string | null;
}

/**
 * Get hospital settings from database
 */
export async function getHospitalSettings(db: Knex): Promise<HospitalSettings> {
    const settings = await db('hospital_settings').first();

    if (!settings) {
        throw new Error('Hospital settings not found. Please run migrations.');
    }

    return settings;
}

/**
 * Generate patient ID in format: XXX-NNNNNN-YY
 * - XXX: Hospital abbreviation (3 characters)
 * - NNNNNN: Sequential number (6 digits, padded with zeros)
 * - YY: Registration year (2 digits)
 * 
 * Example: ARC-000001-24, CCH-000123-25
 */
export async function generatePatientId(db: Knex): Promise<string> {
    // Get hospital settings for abbreviation
    const settings = await getHospitalSettings(db);

    // Get current year (last 2 digits)
    const currentYear = new Date().getFullYear() % 100;

    // Atomic sequence increment using transaction
    const sequence = await db.transaction(async (trx) => {
        // Try to get existing record for this year
        const record = await trx('patient_id_sequence')
            .where('year', currentYear)
            .first();

        if (!record) {
            // First patient of the year
            await trx('patient_id_sequence').insert({
                year: currentYear,
                last_sequence: 1,
                updated_at: new Date()
            });
            return 1;
        }

        // Increment sequence
        const newSequence = record.last_sequence + 1;
        await trx('patient_id_sequence')
            .where('year', currentYear)
            .update({
                last_sequence: newSequence,
                updated_at: new Date()
            });

        return newSequence;
    });

    // Format: XXX-NNNNNN-YY
    const paddedSequence = String(sequence).padStart(6, '0');
    const paddedYear = String(currentYear).padStart(2, '0');

    return `${settings.hospital_abbreviation}-${paddedSequence}-${paddedYear}`;
}

/**
 * Generate hospital abbreviation from hospital name
 * Takes first 3 consonants/letters, uppercase
 * 
 * Examples:
 * - "Archmedics Hospital" -> "ARC"
 * - "Central City Hospital" -> "CCH"
 * - "St. Mary's Medical Center" -> "SMM"
 */
export function generateAbbreviation(hospitalName: string): string {
    // Remove special characters and split into words
    const words = hospitalName
        .toUpperCase()
        .replace(/[^A-Z\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 0);

    // Try to get first letter of first 3 words
    if (words.length >= 3) {
        return words.slice(0, 3).map(w => w[0]).join('');
    }

    // If less than 3 words, get first 3 consonants from all words combined
    const allLetters = words.join('');
    const consonants = allLetters.replace(/[AEIOU]/g, '');

    if (consonants.length >= 3) {
        return consonants.substring(0, 3);
    }

    // Fallback: just take first 3 letters
    return allLetters.substring(0, 3).padEnd(3, 'X');
}
