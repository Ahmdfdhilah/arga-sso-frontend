/**
 * Get localized day name in Indonesian
 * @param date - Date object
 * @returns Day name in Indonesian
 */
export function getDayName(date: Date = new Date()): string {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[date.getDay()];
}

/**
 * Format date in Indonesian format
 * @param date - Date object
 * @returns Formatted date string (e.g., "11 Desember 2025")
 */
export function getFormattedDate(input: string | Date = new Date()): string {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const date = typeof input === "string" ? new Date(input) : input;

    if (isNaN(date.getTime())) {
        return "-"; 
    }

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}


/**
 * Format time in Indonesian locale (HH:MM:SS)
 * @param date - Date object
 * @returns Formatted time string
 */
export function getFormattedTime(date: Date = new Date()): string {
    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}
