import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GamificationPopup from './GamificationPopup';

describe('GamificationPopup', () => {
    it('renders and auto-closes after duration', async () => {
        vi.useFakeTimers();
        const onClose = vi.fn();

        render(
            <GamificationPopup
                show={true}
                onClose={onClose}
                statusType="completed"
            />
        );

        // Assert it renders
        expect(screen.getByText('Task Completed!')).toBeInTheDocument();

        // Fast forward timers to simulate auto-close
        act(() => {
            vi.advanceTimersByTime(3000); // 2500ms display + 300ms exit
        });

        expect(onClose).toHaveBeenCalled();
        vi.useRealTimers();
    });

    it('renders different configuration based on statusType', () => {
        const { rerender } = render(
            <GamificationPopup show={true} onClose={() => { }} statusType="missed" />
        );
        expect(screen.getByText('Streak Lost')).toBeInTheDocument();

        rerender(
            <GamificationPopup show={true} onClose={() => { }} statusType="milestone" />
        );
        expect(screen.getByText('Milestone Reached!')).toBeInTheDocument();
    });
});
