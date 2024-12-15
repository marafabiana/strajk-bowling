import React from 'react';
import { render, screen } from '@testing-library/react';
import Confirmation from '../views/Confirmation';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';


import { useLocation } from 'react-router-dom';
vi.mock('react-router-dom', async () => {
  const routerDom = await vi.importActual('react-router-dom');
  return {
    ...routerDom,
    useLocation: vi.fn(),
    useNavigate: vi.fn(),
  };
});

describe('Confirmation Component', () => {
  beforeEach(() => {
    sessionStorage.clear();
    useLocation.mockReturnValue({});
  });

  test('Displays confirmation data from state', () => {
    const mockConfirmation = {
      when: '2024-12-31T19:00',
      lanes: '2',
      people: '4',
      id: '12345',
      price: '480',
    };

    useLocation.mockReturnValue({ state: { confirmationDetails: mockConfirmation } });

    render(
      <MemoryRouter>
        <Confirmation />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/When/i)).toHaveValue('2024-12-31 19:00');
    expect(screen.getByLabelText(/Who/i)).toHaveValue('4');
    expect(screen.getByLabelText(/Lanes/i)).toHaveValue('2');
    expect(screen.getByLabelText(/Booking number/i)).toHaveValue('12345');
    expect(screen.getByText('Total:')).toBeInTheDocument();
    expect(screen.getByText('480 sek')).toBeInTheDocument();
  });

  test('Display confirmation data from sessionStorage when state does not exist', () => {
    const mockConfirmation = {
      when: '2024-12-31T20:00',
      lanes: '1',
      people: '2',
      id: '99999',
      price: '220',
    };

    sessionStorage.setItem('confirmation', JSON.stringify(mockConfirmation));

    render(
      <MemoryRouter>
        <Confirmation />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/When/i)).toHaveValue('2024-12-31 20:00');
    expect(screen.getByLabelText(/Who/i)).toHaveValue('2');
    expect(screen.getByLabelText(/Lanes/i)).toHaveValue('1');
    expect(screen.getByLabelText(/Booking number/i)).toHaveValue('99999');
    expect(screen.getByText('220 sek')).toBeInTheDocument();
  });

  test('Displays error message when there is no confirmation in state or sessionStorage', () => {
    render(
      <MemoryRouter>
        <Confirmation />
      </MemoryRouter>
    );

    expect(screen.getByText(/Inga bokning gjord!/i)).toBeInTheDocument();
  });
});
