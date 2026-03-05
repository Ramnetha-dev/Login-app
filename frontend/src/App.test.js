import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./api', () => ({
  login: jest.fn(),
  healthCheck: jest.fn(),
}));

test('renders login title', () => {
  render(<App />);
  const title = screen.getByText(/admin login/i);
  expect(title).toBeInTheDocument();
});
