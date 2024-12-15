
import { afterEach, beforeAll, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import '@testing-library/jest-dom/vitest';
import '@testing-library/jest-dom';

import { server } from './src/mocks/server.js';


beforeAll(() => server.listen());
afterEach(() => {
  cleanup(); 
  server.resetHandlers();
});
afterAll(() => server.close());
