import React from "react";
import janeStreetLogo from "@/assets/jane-street-logo.png";
import citadelLogo from "@/assets/citadel-logo.png";
import jumpTradingLogo from "@/assets/jump-trading-logo.webp";
import optiverLogo from "@/assets/optiver.png";
import akunaLogo from "@/assets/akuna.png";
import drwLogo from "@/assets/drw.png";
import fiveRingsLogo from "@/assets/five-rings.png";
import gravitonLogo from "@/assets/graviton.png";
import hrtLogo from "@/assets/hrt.png";
import imcLogo from "@/assets/imc-logo.png";
import siLogo from "@/assets/si.png";
import twoSigmaLogo from "@/assets/two-sigma.png";

const CompanyLogoTicker = () => {
  const logos = [
    { src: janeStreetLogo, alt: "Jane Street" },
    { src: citadelLogo, alt: "Citadel" },
    { src: jumpTradingLogo, alt: "Jump Trading" },
    { src: optiverLogo, alt: "Optiver" },
    { src: akunaLogo, alt: "Akuna Capital" },
    { src: drwLogo, alt: "DRW" },
    { src: fiveRingsLogo, alt: "Five Rings" },
    { src: gravitonLogo, alt: "Graviton" },
    { src: hrtLogo, alt: "Hudson River Trading" },
    { src: imcLogo, alt: "IMC Trading" },
    { src: siLogo, alt: "Optiver" },
    { src: twoSigmaLogo, alt: "Two Sigma" },
  ];

  return (
    <section className="pt-2 pb-12 md:pt-3 md:pb-16 px-4 overflow-hidden bg-gradient-subtle">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12">
          Helped candidates secure roles at {' '}
          <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            top trading firms
          </span>{" "}
          worldwide.
        </h2>

        <div className="relative">
          <div className="logo-ticker-container">
            <div className="logo-ticker">
              {logos.map((logo, index) => (
                <div
                  key={index}
                  className="logo-ticker-item"
                >
                  <div className="bg-white rounded-xl px-12 py-6 flex items-center justify-center w-[320px]">
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="h-20 w-auto object-contain"
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
                  <div className="bg-white rounded-xl px-12 py-6 flex items-center justify-center w-[320px]">
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="h-20 w-auto object-contain"
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
