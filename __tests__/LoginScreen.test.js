import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';

// Mock Firebase auth - qe testi te mos lidhet me serverin real
jest.mock('../firebase/config', () => ({
  auth: {},
}));

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
}));

// Mock Google auth hook - qe testi te mos varet nga OAuth
jest.mock('../hooks/useGoogleAuth', () => () => ({
  request: null,
  promptAsync: jest.fn(),
}));

const { signInWithEmailAndPassword } = require('firebase/auth');

describe('LoginScreen', () => {
  test('shfaq alert kur email/password jane bosh', () => {
    const { getByText } = render(<LoginScreen navigation={{ navigate: jest.fn() }} />);
    const loginButton = getByText('Kyçu');

    fireEvent.press(loginButton);

    // Firebase s'duhet te thirret nese fushat jane bosh
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  });

  test('therret signInWithEmailAndPassword kur fushat jane plotesuara', async () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={{ navigate: jest.fn() }} />
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Kyçu'));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        'test@example.com',
        'password123'
      );
    });
  });
});
