/**
 * Formats a date string into "YYYY D-MonthName" format with Uzbek month names.
 * Example: "2026 13-iyun"
 * 
 * @param {string|Date} dateString 
 * @returns {string}
 */
export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const day = date.getDate();
    const monthIndex = date.getMonth();

    const monthsUz = [
        'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
        'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
    ];

    const monthName = monthsUz[monthIndex] || '';

    // Format: 2026 13-iyun
    return `${year} ${day}-${monthName}`;
};

/**
 * Formats a date for input type="date" (YYYY-MM-DD)
 * 
 * @param {string|Date} dateString 
 * @returns {string}
 */
export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
    } catch (e) {
        return '';
    }
};
