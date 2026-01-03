import React, { useState } from 'react';
import Button from './ui/Button';
import EditContactModal from './EditContactModal';
import { exportToCSV } from '../utils/exportCSV';

/**
 * ContactList Component
 * Displays contacts in a responsive table (desktop) or card (mobile) layout
 * Features: Search/Filter, Sorting, Edit, Delete
 */
const ContactList = ({ contacts, onDelete, onUpdate, loading }) => {
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [deleteId, setDeleteId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [editContact, setEditContact] = useState(null);

    // Filter contacts based on search query
    const filteredContacts = contacts.filter(contact => {
        const query = searchQuery.toLowerCase();
        return (
            contact.name.toLowerCase().includes(query) ||
            contact.email.toLowerCase().includes(query) ||
            contact.phone.includes(query) ||
            (contact.message && contact.message.toLowerCase().includes(query))
        );
    });

    // Sort filtered contacts
    const sortedContacts = [...filteredContacts].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
            case 'email':
                comparison = a.email.localeCompare(b.email);
                break;
            case 'date':
                comparison = new Date(a.createdAt) - new Date(b.createdAt);
                break;
            default:
                comparison = 0;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
    });

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            setDeleteId(id);
            await onDelete(id);
            setDeleteId(null);
        }
    };

    const handleEdit = (contact) => {
        setEditContact(contact);
    };

    const handleContactUpdated = (updatedContact, message, type = 'success') => {
        if (updatedContact) {
            onUpdate(updatedContact, message, type);
        } else {
            onUpdate(null, message, type);
        }
        setEditContact(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const SortIcon = ({ field }) => {
        if (sortBy !== field) {
            return (
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }
        return sortOrder === 'asc' ? (
            <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
                <div className="flex items-center justify-center py-12">
                    <svg className="animate-spin h-12 w-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </div>
        );
    }

    if (contacts.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
                <div className="text-center py-12">
                    <svg className="mx-auto h-24 w-24 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">No Contacts Yet</h3>
                    <p className="text-slate-600">Start by adding your first contact using the form above.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                {/* Header with Search */}
                <div className="p-6 border-b border-slate-200">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900">Contact List</h2>
                                <p className="text-slate-600 mt-1">
                                    {filteredContacts.length === contacts.length
                                        ? `Total contacts: ${contacts.length}`
                                        : `Showing ${filteredContacts.length} of ${contacts.length} contacts`
                                    }
                                </p>
                            </div>

                            {/* Search Bar */}
                            <div className="relative w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Search contacts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
                                />
                                <svg
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Export Button */}
                        {contacts.length > 0 && (
                            <div className="flex justify-end">
                                <Button
                                    variant="secondary"
                                    onClick={() => exportToCSV(sortedContacts)}
                                    className="flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Export to CSV
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {filteredContacts.length === 0 ? (
                    <div className="p-12 text-center">
                        <svg className="mx-auto h-16 w-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">No contacts found</h3>
                        <p className="text-slate-600">Try adjusting your search query</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left">
                                            <button
                                                onClick={() => handleSort('name')}
                                                className="flex items-center gap-2 font-semibold text-slate-700 hover:text-primary-600 transition-colors"
                                            >
                                                Name
                                                <SortIcon field="name" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            <button
                                                onClick={() => handleSort('email')}
                                                className="flex items-center gap-2 font-semibold text-slate-700 hover:text-primary-600 transition-colors"
                                            >
                                                Email
                                                <SortIcon field="email" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            <span className="font-semibold text-slate-700">Phone</span>
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            <span className="font-semibold text-slate-700">Message</span>
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            <button
                                                onClick={() => handleSort('date')}
                                                className="flex items-center gap-2 font-semibold text-slate-700 hover:text-primary-600 transition-colors"
                                            >
                                                Date Added
                                                <SortIcon field="date" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-center">
                                            <span className="font-semibold text-slate-700">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {sortedContacts.map((contact) => (
                                        <tr
                                            key={contact._id}
                                            className="hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{contact.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-700">{contact.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-700">{contact.phone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-600 max-w-xs truncate">
                                                    {contact.message || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-500">
                                                    {formatDate(contact.createdAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    {/* Edit Button */}
                                                    <button
                                                        onClick={() => handleEdit(contact)}
                                                        className="text-primary-600 hover:text-primary-800 transition-colors"
                                                        title="Edit contact"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => handleDelete(contact._id)}
                                                        disabled={deleteId === contact._id}
                                                        className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                                                        title="Delete contact"
                                                    >
                                                        {deleteId === contact._id ? (
                                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-slate-200">
                            {sortedContacts.map((contact) => (
                                <div key={contact._id} className="p-6 hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-lg text-slate-900">{contact.name}</h3>
                                        <div className="flex gap-2">
                                            {/* Edit Button */}
                                            <button
                                                onClick={() => handleEdit(contact)}
                                                className="text-primary-600 hover:text-primary-800 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDelete(contact._id)}
                                                disabled={deleteId === contact._id}
                                                className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                                            >
                                                {deleteId === contact._id ? (
                                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {contact.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            {contact.phone}
                                        </div>
                                        {contact.message && (
                                            <div className="flex items-start gap-2 text-slate-600 mt-2">
                                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                </svg>
                                                <span className="flex-1">{contact.message}</span>
                                            </div>
                                        )}
                                        <div className="text-xs text-slate-500 pt-2">
                                            Added: {formatDate(contact.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Edit Contact Modal */}
            <EditContactModal
                isOpen={editContact !== null}
                onClose={() => setEditContact(null)}
                contact={editContact}
                onContactUpdated={handleContactUpdated}
            />
        </>
    );
};

export default ContactList;
