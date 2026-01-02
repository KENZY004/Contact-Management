import express from 'express';
import { body, validationResult } from 'express-validator';
import Contact from '../models/Contact.js';

const router = express.Router();

// Validation rules
const contactValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit phone number'),
    body('message')
        .optional()
        .trim()
];

// GET /api/contacts - Fetch all contacts
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contacts',
            error: error.message
        });
    }
});

// POST /api/contacts - Create new contact
router.post('/', contactValidation, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, email, phone, message } = req.body;

        // Check if email already exists
        const existingContact = await Contact.findOne({ email: email.toLowerCase() });
        if (existingContact) {
            return res.status(400).json({
                success: false,
                message: 'A contact with this email already exists'
            });
        }

        // Create new contact
        const contact = new Contact({
            name,
            email,
            phone,
            message
        });

        await contact.save();

        res.status(201).json({
            success: true,
            message: 'Contact added successfully!',
            data: contact
        });
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create contact',
            error: error.message
        });
    }
});

// PUT /api/contacts/:id - Update contact by ID
router.put('/:id', contactValidation, async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid contact ID'
            });
        }

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, email, phone, message } = req.body;

        // Check if email already exists (excluding current contact)
        const existingContact = await Contact.findOne({
            email: email.toLowerCase(),
            _id: { $ne: id } // Exclude current contact from check
        });

        if (existingContact) {
            return res.status(400).json({
                success: false,
                message: 'A contact with this email already exists'
            });
        }

        // Update contact
        const contact = await Contact.findByIdAndUpdate(
            id,
            { name, email, phone, message },
            { new: true, runValidators: true } // Return updated doc and run validators
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            message: 'Contact updated successfully!',
            data: contact
        });
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update contact',
            error: error.message
        });
    }
});

// DELETE /api/contacts/:id - Delete contact by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid contact ID'
            });
        }

        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            message: 'Contact deleted successfully',
            data: contact
        });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete contact',
            error: error.message
        });
    }
});

export default router;
