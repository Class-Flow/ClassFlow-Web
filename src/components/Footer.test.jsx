import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer Component', () => {
    it('renders the correct copyright text and year', () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );
        const currentYear = new Date().getFullYear();
        expect(screen.getByText(new RegExp(`© ${currentYear} ClassFlow. All rights reserved.`))).toBeInTheDocument();
    });
});
