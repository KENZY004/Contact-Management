import React, { useState, useEffect } from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import Toast from './components/ui/Toast';

function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Fetch contacts on mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/contacts');
      const data = await response.json();

      if (data.success) {
        setContacts(data.data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      showToast('Failed to load contacts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleContactAdded = (newContact, message, type = 'success') => {
    if (newContact) {
      setContacts(prev => [newContact, ...prev]);
    }
    showToast(message, type);
  };

  const handleDeleteContact = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/contacts/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setContacts(prev => prev.filter(contact => contact._id !== id));
        showToast('Contact deleted successfully', 'success');
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      showToast('Failed to delete contact', 'error');
    }
  };

  // Handle contact update
  const handleUpdateContact = (updatedContact, message, type = 'success') => {
    if (updatedContact) {
      setContacts(prev =>
        prev.map(contact =>
          contact._id === updatedContact._id ? updatedContact : contact
        )
      );
    }
    showToast(message, type);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in px-2">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg">
            Contact Management
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 drop-shadow">
            Manage your contacts efficiently with our modern interface
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Contact Form */}
          <div>
            <ContactForm onContactAdded={handleContactAdded} />
          </div>

          {/* Contact List */}
          <div className="lg:col-span-1">
            <ContactList
              contacts={contacts}
              onDelete={handleDeleteContact}
              onUpdate={handleUpdateContact}
              loading={loading}
            />
          </div>
        </div>

      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </div>
  );
}

export default App;
