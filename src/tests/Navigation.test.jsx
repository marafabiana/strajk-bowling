import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from '../components/Navigation/Navigation';
import '@testing-library/jest-dom/vitest';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const routerDom = await vi.importActual('react-router-dom');
  return {
    ...routerDom,
    useNavigate: vi.fn(),
  };
});

describe('Navigation Component', () => {
  const mockedNavigate = vi.fn();

  beforeEach(() => {
    mockedNavigate.mockClear();
    useNavigate.mockReturnValue(mockedNavigate);
  });

  test('Links are hidden initially', () => {
    render(<Navigation />);
    const bookingLink = screen.getByRole('link', { name: /booking/i });
    const confirmationLink = screen.getByRole('link', { name: /confirmation/i });

    expect(bookingLink).toHaveClass('hide');
    expect(confirmationLink).toHaveClass('hide');
  });

  test('Show links when clicking on the navigation icon', () => {
    render(<Navigation />);
    const navIcon = screen.getByRole('img');
    fireEvent.click(navIcon);

    const bookingLink = screen.getByRole('link', { name: /booking/i });
    const confirmationLink = screen.getByRole('link', { name: /confirmation/i });

    expect(bookingLink).not.toHaveClass('hide');
    expect(confirmationLink).not.toHaveClass('hide');
  });

  test('Navigate to "/" when clicking on "Booking"', () => {
    render(<Navigation />);
    const navIcon = screen.getByRole('img');
    fireEvent.click(navIcon);

    const bookingLink = screen.getByRole('link', { name: /booking/i });
    fireEvent.click(bookingLink);

    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });

  test('Navigate to "/confirmation" when clicking "Confirmation"', () => {
    render(<Navigation />);
    const navIcon = screen.getByRole('img');
    fireEvent.click(navIcon);

    const confirmationLink = screen.getByRole('link', { name: /confirmation/i });
    fireEvent.click(confirmationLink);

    expect(mockedNavigate).toHaveBeenCalledWith('/confirmation');
  });
});
