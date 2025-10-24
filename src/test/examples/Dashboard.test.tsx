/**
 * Example Test File
 * Demonstrates how to test a component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent, mockUser } from '../utils';
import Dashboard from '../../pages/Dashboard';

describe('Dashboard', () => {
  it('renders dashboard correctly', () => {
    render(<Dashboard />);
    
    // Check if dashboard title is present
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  it('displays user statistics', () => {
    render(<Dashboard />);
    
    // Check if stats are displayed (modify based on actual Dashboard implementation)
    // expect(screen.getByText(/total trips/i)).toBeInTheDocument();
  });

  it('navigates to find ride when button clicked', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);
    
    // Find and click the "Find a Ride" button
    // const findRideButton = screen.getByRole('button', { name: /find.*ride/i });
    // await user.click(findRideButton);
    
    // Verify navigation occurred
    // expect(mockNavigate).toHaveBeenCalledWith('/app/find-ride');
  });
});
