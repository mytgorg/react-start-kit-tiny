
import React from 'react';

const WelcomeHeader: React.FC = () => {
  return (
    <div className="text-center space-y-4 mb-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
        WebCam Services
      </h1>
      <p className="text-muted-foreground max-w-xl mx-auto">
        Experience premium webcam services with verified profiles
      </p>
    </div>
  );
};

export default WelcomeHeader;
