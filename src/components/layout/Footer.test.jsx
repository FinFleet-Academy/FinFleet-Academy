import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Footer from './Footer';
import { CookieProvider } from '../../context/CookieContext';

// Simple mock for CookieContext if needed, but since we have the provider we can use it
describe('Footer Component', () => {
  it('renders brand name', () => {
    render(
      <BrowserRouter>
        <CookieProvider>
          <Footer />
        </CookieProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText(/FinFleet/i)).toBeInTheDocument();
  });

  it('contains essential links', () => {
    render(
      <BrowserRouter>
        <CookieProvider>
          <Footer />
        </CookieProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Courses/i)).toBeInTheDocument();
    expect(screen.getByText(/About Us/i)).toBeInTheDocument();
  });
});
