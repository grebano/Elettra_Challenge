1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Build the app**
   ```bash
   npm run build
   ```

3. **Test Locally**
   1. Create .env file in root with `NODE_ENV=development`
   2. Run development server:
      ```bash
      npm run dev
      ```

4. **Package the app for distribution**
   ```bash
   npm run electron-build
   ```

The `dist/win-unpacked` directory contains the unpacked executable for Windows.
