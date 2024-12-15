import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Shoes from '../components/Shoes/Shoes';
import '@testing-library/jest-dom/vitest';
import '@testing-library/jest-dom';

describe('Shoes Component', () => {
  let updateSizeMock;
  let addShoeMock;
  let removeShoeMock;

  beforeEach(() => {
    updateSizeMock = vi.fn();
    addShoeMock = vi.fn();
    removeShoeMock = vi.fn();
  });

  test('Renders the heading "Shoes"', () => {
    render(<Shoes updateSize={updateSizeMock} addShoe={addShoeMock} removeShoe={removeShoeMock} shoes={[]} />);
    expect(screen.getByRole('heading', { name: /Shoes/i })).toBeInTheDocument();
  });

  test('Add a shoe by clicking the "+" button', () => {
    render(<Shoes updateSize={updateSizeMock} addShoe={addShoeMock} removeShoe={removeShoeMock} shoes={[]} />);
    const addButton = screen.getByRole('button', { name: /\+/i });
    fireEvent.click(addButton);

    
    expect(addShoeMock).toHaveBeenCalledTimes(1);
  });

  test('Displays the shoe input when there is an item in shoes', () => {
    const shoesData = [{ id: 'shoe1', size: '' }];
    render(<Shoes updateSize={updateSizeMock} addShoe={addShoeMock} removeShoe={removeShoeMock} shoes={shoesData} />);

   
    const shoeInput = screen.getByLabelText(/Shoe size \/ person 1/i);
    expect(shoeInput).toBeInTheDocument();
  });

  test('Remove a shoe by clicking the "-" button', () => {
    const shoesData = [{ id: 'shoe1', size: '' }];
    render(<Shoes updateSize={updateSizeMock} addShoe={addShoeMock} removeShoe={removeShoeMock} shoes={shoesData} />);

    const removeButton = screen.getByRole('button', { name: '-' });
    fireEvent.click(removeButton);

   
    expect(removeShoeMock).toHaveBeenCalledWith('shoe1');
  });

  test('Updates shoe size when input changes', () => {
    const shoesData = [{ id: 'shoe1', size: '' }];
    render(<Shoes updateSize={updateSizeMock} addShoe={addShoeMock} removeShoe={removeShoeMock} shoes={shoesData} />);

    const shoeInput = screen.getByLabelText(/Shoe size \/ person 1/i);
    fireEvent.change(shoeInput, { target: { value: '42' } });

    expect(updateSizeMock).toHaveBeenCalled();
    expect(updateSizeMock.mock.calls[0][0].target.value).toBe('42');
    expect(updateSizeMock.mock.calls[0][0].target.name).toBe('shoe1');
  });
});
