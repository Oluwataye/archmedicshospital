import React from 'react';
import styles from './LoadingSpinner.module.css';
import { useHospitalSettings } from '@/contexts/HospitalSettingsContext';

interface LoadingSpinnerProps {
    /**
     * If true, overlays the entire screen with a backdrop
     * @default false
     */
    fullScreen?: boolean;

    /**
     * Text to display below the spinner
     * @default "Loading"
     */
    text?: string;

    /**
     * Additional CSS classes
     */
    className?: string;

    /**
     * Path to the logo image
     * @default "/assets/logo.png" (fallback to a placeholder if not found)
     */
    logoSrc?: string;
}

/**
 * Professional Hospital Loading Spinner
 * 
 * Features:
 * - Rotating and pulsing hospital logo
 * - Animated loading dots
 * - Backdrop blur for full-screen mode
 * - Accessible (ARIA support, reduced motion)
 */
export default function LoadingSpinner({
    fullScreen = false,
    text = "Loading",
    className = '',
    logoSrc = "/vite.svg" // Using vite logo as placeholder, replace with actual hospital logo
}: LoadingSpinnerProps) {
    const { settings } = useHospitalSettings();

    // Combine classes based on props
    const containerClasses = [
        styles.spinnerContainer,
        fullScreen ? styles.fullScreen : styles.inline,
        className
    ].filter(Boolean).join(' ');

    return (
        <div
            className={containerClasses}
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <div className={styles.logoWrapper}>
                <div className={styles.brandLogo}>
                    <span className={styles.brandIcon}>+</span>
                    <div className={styles.brandText}>
                        <span className={styles.brandName}>{settings?.hospital_abbreviation || 'HMS'}</span>
                        <span className={styles.brandSuffix}>Hospital</span>
                    </div>
                </div>
            </div>

            {text && (
                <div className={styles.loadingText}>
                    {text}
                    <span className={styles.dot}>.</span>
                    <span className={styles.dot}>.</span>
                    <span className={styles.dot}>.</span>
                </div>
            )}

            {/* Screen reader only text */}
            <span className="sr-only">{text}...</span>
        </div>
    );
}
