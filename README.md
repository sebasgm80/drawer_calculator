# Drawer Calculator

## Overview

**Drawer Calculator** is a responsive web application designed to help users calculate the dimensions and components required for building drawers. The application allows users to input various measurements and configurations, and it calculates the necessary parts including side panels, bottom panels, and drawer runners. Future plans include expanding this application to a mobile platform.

## Features

- **Responsive Design**: Adapts seamlessly to different screen sizes, including mobile devices.
- **Dynamic Calculations**: Provides accurate dimensions for drawer components based on user inputs.
- **User Authentication**: Simple login and registration system to save user projects.
- **Project Management**: Save, rename, and delete drawer projects.
- **Modern UI**: Clean, modern user interface with easy navigation.

## Security Considerations

Passwords are hashed before being stored in localStorage for demonstration purposes. For production use, move authentication to a secure backend or external service.

## Technologies Used

- **Frontend**: React, JavaScript, HTML5, CSS3
- **Routing**: React Router DOM
- **State Management**: Context API
- **Styling**: Custom CSS with responsive design
- **Build Tool**: Vite

## Installation

To run this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/drawer_calculator.git
   cd drawer_calculator

   Install dependencies:

bash
Copiar código
npm install
Run the application:

bash
Copiar código
npm run dev
Open your browser and navigate to http://localhost:5173.

Usage
Login or Register: Start by creating an account or logging in.
Create a New Project: Enter the dimensions and configurations for your drawer.
Calculate: Click on the "Calculate" button to get the dimensions of the drawer components.
Save Your Project: Save your calculations for future reference. You can rename or delete saved projects.
File Structure
plaintext
Copiar código
drawer_calculator/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── ...
│   ├── context/
│   │   ├── UserContext.jsx
│   ├── hooks/
│   │   ├── useUserContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── CalculatorPage.jsx
│   │   ├── ListPage.jsx
│   │   └── ...
│   ├── App.jsx
│   ├── index.jsx
│   ├── routes/
│   │   ├── Routes.jsx
│   ├── styles/
│   │   ├── Header.css
│   │   ├── ...
│   └── ...
├── .gitignore
├── package.json
├── README.md
└── ...
Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature-name).
Commit your changes (git commit -m 'Add some feature').
Push to the branch (git push origin feature/your-feature-name).
Open a pull request.
License
This project is licensed under the MIT License. See the LICENSE file for details.
