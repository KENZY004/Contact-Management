/**
 * Utility function to export contacts to CSV file
 * Converts contact data to CSV format and triggers download
 */
export const exportToCSV = (contacts) => {
    if (contacts.length === 0) {
        alert('No contacts to export');
        return;
    }

    // Define CSV headers
    const headers = ['Name', 'Email', 'Phone', 'Message', 'Date Added'];

    // Convert contacts to CSV rows
    const rows = contacts.map(contact => {
        const date = new Date(contact.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return [
            contact.name,
            contact.email,
            contact.phone,
            contact.message || '',
            date
        ];
    });

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `contacts_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
