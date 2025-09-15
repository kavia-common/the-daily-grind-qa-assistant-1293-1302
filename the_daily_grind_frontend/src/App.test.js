import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders greeting and allows asking a question', async () => {
  render(<App />);
  expect(
    screen.getByText(/Welcome to The Daily Grind!/i)
  ).toBeInTheDocument();

  const input = screen.getByPlaceholderText(/Ask about our menu/i);
  expect(input).toBeInTheDocument();

  fireEvent.change(input, { target: { value: 'What are your hours?' } });
  fireEvent.click(screen.getByRole('button', { name: /Ask/i }));

  // Bot response appears eventually – we can check for a known phrase or loading dots
  expect(await screen.findByText(/We're open from/i, {}, { timeout: 2000 })).toBeInTheDocument();
});
