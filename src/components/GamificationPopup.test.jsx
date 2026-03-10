import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GamificationPopup from './GamificationPopup';

describe('GamificationPopup', () => {
    it('renders and auto-closes after duration', async () => {
        vi.useFakeTimers();
        const onClose = vi.fn();

        render(
            <GamificationPopup
                isOpen={true}
                onClose={onClose}
                statusType="completed"
            />
        );

        // Assert it renders
        expect(screen.getByText('LOCKED IN!')).toBeInTheDocument();

        // Fast forward timers to simulate auto-close
        act(() => {
            vi.advanceTimersByTime(5000); // 4000ms display + 400ms exit + margin
        });

        expect(onClose).toHaveBeenCalled();
        vi.useRealTimers();
    });

    it('renders different configuration based on statusType', () => {
        const { rerender } = render(
            <GamificationPopup isOpen={true} onClose={() => { }} statusType="missed" />
        );
        expect(screen.getByText('MISSED')).toBeInTheDocument();

        rerender(
            <GamificationPopup isOpen={true} onClose={() => { }} statusType="milestone" />
        );
        expect(screen.getByText('MARKED')).toBeInTheDocument();
    });
});
