import janeStreetLogo from "@/assets/jane-street-logo.png";
import citadelLogo from "@/assets/citadel-logo.png";
import drivLogo from "@/assets/driv-logo.png";
import companyLogo from "@/assets/company-logo.png";

const problems = [
    {
        id: 1,
        title: "Black-Scholes Options Pricing",
        topic: "Derivatives",
        difficulty: 5,
        askedIn: [
            { name: "Jane Street", logoURL: janeStreetLogo },
            { name: "Citadel", logoURL: citadelLogo }
        ],

        question: `Varun has 4 fair coins. He flips all 4 at once and notes the parity of each. After seeing the outcomes, he may turn over (rather than flip) any pair of coins. Note that this means a heads becomes a tails and vice versa. Varun may not turn over a single coin without turning over another. He can iterate this process as many times as he would like. If Varun plays to maximize his expected number of heads, find the expected number of heads he will have.`,

        answer: "10.45",

        hint1: "Compute d1 and d2 using the Black–Scholes formula.",
        hint2: "Use N(d1) and N(d2) from the standard normal distribution.",

        solution: `Using the Black–Scholes formula:

d1 = [ ln(S/K) + (r + σ²/2)T ] / (σ√T)
d2 = d1 – σ√T

Plugging in values:
d1 = 0.35
d2 = 0.15

Call price = S·N(d1) – K·e^{-rT}·N(d2)
= 100 × 0.6368 – 100 × e^{-0.05} × 0.5596
≈ 10.45`
    },

    {
        id: 2,
        title: "Portfolio Risk Calculation",
        topic: "Risk Management",
        difficulty: 8,
        askedIn: [
            { name: "Driv", logoURL: drivLogo }
        ],

        question: `A portfolio consists of two assets:
- Asset A volatility: 20%
- Asset B volatility: 15%
- Correlation ρ = 0.3
- Weights: wA = 0.6, wB = 0.4

Compute the portfolio volatility.`,

        answer: "0.167",

        hint1: "Use: σₚ = √(wA²σA² + wB²σB² + 2wAwBσAσBρ).",
        hint2: "Be careful with percentage conversions.",

        solution: `σₚ = √(0.6²·0.2² + 0.4²·0.15² + 2·0.6·0.4·0.2·0.15·0.3)
= 0.167 (16.7%)`
    },

    {
        id: 3,
        title: "Time Series Mean Reversion",
        topic: "Statistics",
        difficulty: 2,
        askedIn: [
            { name: "Jane Street", logoURL: janeStreetLogo },
            { name: "Driv", logoURL: drivLogo }
        ],

        question: `Given an AR(1) process: Xₜ = 0.6Xₜ₋₁ + εₜ.
Is this process mean reverting?`,

        answer: "Yes",

        hint1: "Check the absolute value of the AR parameter.",
        hint2: "For mean reversion, |phi| < 1.",

        solution: `Since |0.6| < 1, the AR(1) process is mean reverting.`
    },

    {
        id: 4,
        title: "Monte Carlo Simulation of Option Payoff",
        topic: "Quantitative Methods",
        difficulty: 6,
        askedIn: [
            { name: "Citadel", logoURL: citadelLogo },
            { name: "Driv", logoURL: drivLogo }
        ],

        question: `Simulate the payoff of a European call option with:
S0 = 50, K = 50, σ = 25%, r = 5%, T = 1.
Using a single-step geometric Brownian motion simulation, what is the expected payoff expression?`,

        answer: "E[max(S_T − K, 0)]",

        hint1: "Use GBM: S_T = S0 * exp( (r − σ²/2)T + σ√T Z ).",
        hint2: "Payoff is max(S_T − K, 0).",

        solution: `Expected payoff = E[max(S_T − 50, 0)].
S_T is simulated via geometric Brownian motion:

S_T = 50 · exp( (0.05 − 0.25²/2) + 0.25Z ).`
    },

    {
        id: 5,
        title: "CAPM Beta Estimation",
        topic: "Asset Pricing",
        difficulty: 3,
        askedIn: [
            { name: "Jane Street", logoURL: janeStreetLogo },
            { name: "Citadel", logoURL: citadelLogo },
        ],

        question: `You observe the following:
- Cov(Rᵢ, Rₘ) = 0.018
- Var(Rₘ) = 0.012  
Compute the CAPM beta of the asset.`,

        answer: "1.5",

        hint1: "β = Cov / Var.",
        hint2: "Divide 0.018 by 0.012.",

        solution: `β = 0.018 / 0.012 = 1.5`
    },

    {
        id: 6,
        title: "Yield Curve Construction",
        topic: "Fixed Income",
        difficulty: 9,
        askedIn: [
            { name: "Jane Street", logoURL: janeStreetLogo },
            { name: "Driv", logoURL: drivLogo }
        ],

        question: `You are given bond yields for maturities 1Y, 2Y, and 3Y.
Describe how to build a zero-coupon yield curve using bootstrapping.`,

        answer: "Bootstrap method",

        hint1: "Start with 1Y zero rate.",
        hint2: "Solve recursively for discount factors.",

        solution: `Use bootstrapping:
1. Convert short-maturity coupon bonds into zero rates.
2. Solve discount factors D(T).
3. Compute longer zero rates from: Price = Σ coupon×D(t) + principal×D(T).`
    },

    {
        id: 7,
        title: "Stochastic Volatility Estimation",
        topic: "Derivatives",
        difficulty: 7,
        askedIn: [
            { name: "Citadel", logoURL: citadelLogo },
            { name: "Driv", logoURL: drivLogo }
        ],

        question: `In the Heston model, which parameters determine volatility mean-reversion?`,

        answer: "κ and θ",

        hint1: "κ controls speed.",
        hint2: "θ controls long-term level.",

        solution: `Mean reversion speed = κ  
Long-run variance = θ`
    },

    {
        id: 8,
        title: "PCA of Yield Curve Movements",
        topic: "Fixed Income",
        difficulty: 6,
        askedIn: [
            { name: "Jane Street", logoURL: janeStreetLogo },
            { name: "Driv", logoURL: drivLogo }
        ],

        question: `When performing PCA on yield curve changes, what do the first three components usually represent?`,

        answer: "Level, slope, curvature",

        hint1: "Think: parallel shift.",
        hint2: "Then steepening/flattening, then convexity.",

        solution: `1st PC: Level (parallel shift)  
2nd PC: Slope  
3rd PC: Curvature`
    },

    {
        id: 9,
        title: "Brownian Motion Hitting Time",
        topic: "Probability",
        difficulty: 8,
        askedIn: [
            { name: "Jane Street", logoURL: janeStreetLogo },
            { name: "Citadel", logoURL: citadelLogo },
            { name: "Driv", logoURL: drivLogo }
        ],

        question: `For standard Brownian motion Wₜ, compute the probability that it hits level +1 before level -1.`,

        answer: "0.5",

        hint1: "Symmetry.",
        hint2: "BM has no drift.",

        solution: `P(hit +1 before -1) = 0.5 by symmetry of zero-drift Brownian motion.`
    },

    {
        id: 10,
        title: "Constrained Portfolio Optimization",
        topic: "Optimization",
        difficulty: 7,
        askedIn: [
            { name: "Jane Street", logoURL: janeStreetLogo },
            { name: "Citadel", logoURL: citadelLogo },
            { name: "Driv", logoURL: drivLogo }
        ],

        question: `You want to minimize portfolio variance subject to:
- Sum of weights = 1
- No short selling (wᵢ ≥ 0)

What optimization method should be used?`,

        answer: "Quadratic programming",

        hint1: "The objective is quadratic.",
        hint2: "Constraints are linear inequalities.",

        solution: `Use quadratic programming (QP).
Minimize: wᵀΣw  
Subject to: 1ᵀw = 1, w ≥ 0.`
    }
];

export default problems;
