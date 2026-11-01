import * as React from "react";

export const AppFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="h-12 border-t border-border bg-card px-6 flex items-center justify-between text-xs text-muted-foreground">
      <span>
        © {currentYear} College E-Commerce & Event Management. All rights reserved.
      </span>
      <div className="flex items-center gap-4">
        <span>Version 1.0.0</span>
        <span>•</span>
        <a
          href="http://localhost:8080/swagger-ui.html"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground hover:underline transition-colors"
        >
          API Docs
        </a>
      </div>
    </footer>
  );
};
