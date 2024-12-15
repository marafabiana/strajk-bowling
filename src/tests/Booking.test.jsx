
import React from 'react';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import Booking from '../views/Booking';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../mocks/server';
import { rest } from 'msw';
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

const mockedNavigate = vi.fn();
useNavigate.mockReturnValue(mockedNavigate);


describe('Booking Component', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('Displays error if required fields are not filled in', async () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /strIIIIIike!/i });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/Alla fälten måste vara ifyllda/i)
    ).toBeInTheDocument();
  });

  test('Makes a successful reservation when all fields are filled in correctly', async () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

   
    const dateInput = screen.getByLabelText(/Date/i);
    fireEvent.change(dateInput, { target: { value: '2024-12-31' } });


    const timeInput = screen.getByLabelText(/Time/i);
    fireEvent.change(timeInput, { target: { value: '19:00' } });

    
    const peopleInput = screen.getByLabelText(/Number of awesome bowlers/i);
    fireEvent.change(peopleInput, { target: { value: '2' } });

  
    const lanesInput = screen.getByLabelText(/Number of lanes/i);
    fireEvent.change(lanesInput, { target: { value: '1' } });

   
    const addShoeButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(addShoeButton); 
    fireEvent.click(addShoeButton); 

   
    const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/i);
   
    expect(shoeInputs).toHaveLength(2);
    fireEvent.change(shoeInputs[0], { target: { value: '42' } });
    fireEvent.change(shoeInputs[1], { target: { value: '38' } });


    const submitBtn = screen.getByRole('button', { name: /strIIIIIike!/i });
    fireEvent.click(submitBtn);

    
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledTimes(1);
      expect(mockedNavigate).toHaveBeenCalledWith('/confirmation', expect.any(Object));
    });
  });

  test('Displays error if number of shoes does not match number of players', async () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    const dateInput = screen.getByLabelText(/Date/i);
    fireEvent.change(dateInput, { target: { value: '2024-12-31' } });

    const timeInput = screen.getByLabelText(/Time/i);
    fireEvent.change(timeInput, { target: { value: '19:00' } });

    const peopleInput = screen.getByLabelText(/Number of awesome bowlers/i);
    fireEvent.change(peopleInput, { target: { value: '2' } });

    const lanesInput = screen.getByLabelText(/Number of lanes/i);
    fireEvent.change(lanesInput, { target: { value: '1' } });

    
    const addShoeButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(addShoeButton); 


    const shoeInput = screen.getByLabelText(/Shoe size \/ person/i);
    fireEvent.change(shoeInput, { target: { value: '42' } });

    const submitBtn = screen.getByRole('button', { name: /strIIIIIike!/i });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/Antalet skor måste stämma överens med antal spelare/i)
    ).toBeInTheDocument();
  });

  test('Displays error if more than 4 players per lane are added', async () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    const dateInput = screen.getByLabelText(/Date/i);
    fireEvent.change(dateInput, { target: { value: '2024-12-31' } });

    const timeInput = screen.getByLabelText(/Time/i);
    fireEvent.change(timeInput, { target: { value: '19:00' } });

    
    const peopleInput = screen.getByLabelText(/Number of awesome bowlers/i);
    fireEvent.change(peopleInput, { target: { value: '5' } });

    const lanesInput = screen.getByLabelText(/Number of lanes/i);
    fireEvent.change(lanesInput, { target: { value: '1' } });

 
    const addShoeButton = screen.getByRole('button', { name: '+' });
    for (let i = 0; i < 5; i++) {
      fireEvent.click(addShoeButton);
    }

    const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/i);
    expect(shoeInputs).toHaveLength(5);
    shoeInputs.forEach((input, idx) => {
      fireEvent.change(input, { target: { value: '40' } });
    });

    const submitBtn = screen.getByRole('button', { name: /strIIIIIike!/i });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/Det får max vara 4 spelare per bana/i)
    ).toBeInTheDocument();
  });
});
