import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StreakTierPopup from './StreakTierPopup';

describe('StreakTierPopup', () => {
    it('renders and displays rank up correctly', () => {
        render(
            <StreakTierPopup
                isOpen={true}
                onClose={() => { }}
                oldTier={2}
                newTier={3}
                streakCount={10}
            />
        );

        expect(screen.getByText('RANK UP!')).toBeInTheDocument();
        expect(screen.getByText('Jupiter')).toBeInTheDocument();
        // Check streak text
        expect(screen.getByText(/10/)).toBeInTheDocument();
    });

    it('renders and displays rank dropped correctly', () => {
        render(
            <StreakTierPopup
                isOpen={true}
                onClose={() => { }}
                oldTier={3}
                newTier={2}
                streakCount={0}
            />
        );

        expect(screen.getByText('RANK DROPPED')).toBeInTheDocument();
        expect(screen.getByText('Saturn')).toBeInTheDocument();
        expect(screen.getByText(/0/)).toBeInTheDocument();
    });
});
