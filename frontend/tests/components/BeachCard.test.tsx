import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// 1. IMPORT THE REAL COMPONENT
// We step out of the /tests folder and go into the /src folder
import BeachCard from '../../src/components/BeachCard'; 
import { SettingsProvider } from '../../src/context/SettingsContext';

describe('BeachCard Component', () => {

  // 2. WRITE THE TEST
  it('displays the correct beach name', () => {
    
    // Create some fake data just for the test
    const fakeBeach = { name: "Tel Aviv Surf", city: "Tel Aviv", country: "Israel" };

    // Render the REAL component with the fake data
    render(
      <SettingsProvider>
        <BeachCard beach={fakeBeach} />
      </SettingsProvider>
    );

    // 3. CHECK THE RESULT (Assert)
    // Did the component actually put "Tel Aviv Surf" on the screen?
    expect(screen.getByText("Tel Aviv Surf")).toBeInTheDocument();
  });

});