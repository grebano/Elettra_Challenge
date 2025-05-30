## Follow the steps below to set up and distribute the app on your system.


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

   - For Windows:
     ```bash
     npm run dist:win
     ```
   - For Linux:
     ```bash
     npm run dist:linux
     ```

   To run the application after packaging:

   - **On Windows:**  
   Open the `dist` folder and double-click the `Seaflow-win.exe` file to start the app.

   - **On Linux:**  
   Go to the `dist` folder, where you will find a `Seaflow-linux.zip` file for Linux.  
   After extracting the archive, open the extracted folder and double-click the executable file to start the app.  
