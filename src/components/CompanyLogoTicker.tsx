import React from "react";
import janeStreetLogo from "@/assets/jane-street-logo.png";
import citadelLogo from "@/assets/citadel-logo.png";
import drivLogo from "@/assets/driv-logo.png";

const CompanyLogoTicker = () => {
  const logos = [
    { src: janeStreetLogo, alt: "Jane Street" },
    { src: citadelLogo, alt: "Citadel" },
    { src: drivLogo, alt: "DRW" },
    { src: janeStreetLogo, alt: "Jane Street" },
    { src: citadelLogo, alt: "Citadel" },
    { src: drivLogo, alt: "DRW" },
  ];

  return (
    <section className="pt-2 pb-12 md:pt-3 md:pb-16 px-4 overflow-hidden" style={{ backgroundColor: '#2596be' }}>
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12">
          Helped land jobs at{" "}
          <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            top trading firms
          </span>{" "}
          around the world!
        </h2>
        
        <div className="relative">
          <div className="logo-ticker-container">
            <div className="logo-ticker">
              {logos.map((logo, index) => (
              <div
                key={index}
                className="logo-ticker-item"
              >
                <div className="bg-muted/50 rounded-xl px-12 py-6 flex items-center justify-center min-w-[320px]">
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="h-20 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="logo-ticker" aria-hidden="true">
              {logos.map((logo, index) => (
              <div
                key={`duplicate-${index}`}
                className="logo-ticker-item"
              >
                <div className="bg-muted/50 rounded-xl px-12 py-6 flex items-center justify-center min-w-[320px]">
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="h-20 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyLogoTicker;
