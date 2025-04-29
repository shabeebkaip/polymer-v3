import React from "react";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <header className="auth-header">
          <h1>Welcome to Polymer</h1>
        </header>
        <main className="auth-content">{children}</main>
        <footer className="auth-footer">
          <p>&copy; {new Date().getFullYear()} Polymer. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default AuthLayout;
