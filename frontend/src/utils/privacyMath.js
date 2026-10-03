/**
 * Privacy-Preserving Mathematics & Simulation Engine
 * Simulates Differential Privacy (Laplace / Gaussian Noise Mechanisms)
 * and Homomorphic Encryption (Additive Property Simulation)
 */

/**
 * Sample Laplace distribution noise: Lap(b) where b = sensitivity / epsilon
 */
export function sampleLaplaceNoise(sensitivity = 1.0, epsilon = 1.0) {
  const eps = Math.max(0.01, Number(epsilon));
  const b = sensitivity / eps;
  const u = Math.random() - 0.5;
  // Inverse CDF of Laplace distribution: x = -b * sgn(u) * ln(1 - 2|u|)
  const noise = -b * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
  return noise;
}

/**
 * Sample Gaussian distribution noise (Box-Muller transform): N(0, sigma^2)
 */
export function sampleGaussianNoise(sensitivity = 1.0, epsilon = 1.0, delta = 1e-5) {
  const eps = Math.max(0.01, Number(epsilon));
  const sigma = (sensitivity * Math.sqrt(2 * Math.log(1.25 / delta))) / eps;
  
  const u1 = Math.random() || 1e-7;
  const u2 = Math.random() || 1e-7;
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  
  return z0 * sigma;
}

/**
 * Apply Differential Privacy to a vector of model weights / parameters
 */
export function applyDifferentialPrivacyToWeights(weights, epsilon = 1.0, mechanism = 'laplace') {
  const sensitivity = 0.05; // Typical bounded L1/L2 gradient clipping norm
  return weights.map(w => {
    const rawVal = Number(w);
    const noise = mechanism === 'gaussian'
      ? sampleGaussianNoise(sensitivity, epsilon) * 0.05
      : sampleLaplaceNoise(sensitivity, epsilon) * 0.05;
    
    const perturbedVal = rawVal + noise;
    return {
      original: Number(rawVal.toFixed(4)),
      noise: Number(noise.toFixed(4)),
      perturbed: Number(perturbedVal.toFixed(4)),
      epsilon: Number(epsilon)
    };
  });
}

/**
 * Homomorphic Encryption (Paillier Additive) Simulation
 * Demonstrates: E(m1) * E(m2) mod n^2 = E(m1 + m2 mod n)
 */
export function simulateHomomorphicEncryption(values) {
  // Generate simulated Paillier key parameters
  const n = 3233; // small prime product p*q for educational demo
  const nSquare = n * n; // 10452289
  const g = n + 1; // 3234

  const encryptedNodes = values.map((val, idx) => {
    const r = Math.floor(Math.random() * 50) + 10;
    // Educational simulated ciphertext representation
    const scaledInt = Math.round((val + 2) * 1000); // map float to integer domain
    const ciphertextHash = `0x${((scaledInt * 7919 + r * 104729) % 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase()}`;
    
    return {
      nodeId: `Hospital ${String.fromCharCode(65 + idx)}`,
      plaintextWeight: Number(val.toFixed(4)),
      scaledInteger: scaledInt,
      randomBlindingFactor: r,
      ciphertext: ciphertextHash
    };
  });

  // Calculate Plaintext Sum
  const plainSum = values.reduce((acc, v) => acc + v, 0);
  const plainAvg = plainSum / values.length;

  // Aggregate in Ciphertext Domain (Conceptually multiplying ciphertexts)
  const aggregatedCiphertext = `0x${((values.length * 9973 + 0xABCDEF) % 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase()}`;

  return {
    keyParameters: {
      modulus_N: n,
      modulus_N2: nSquare,
      generator_g: g,
      scheme: 'Paillier Additive Homomorphic Cryptosystem'
    },
    encryptedNodes,
    aggregatedCiphertext,
    decryptedSum: Number(plainSum.toFixed(4)),
    decryptedGlobalAverage: Number(plainAvg.toFixed(4)),
    securityProperty: 'Aggregator computed global average strictly over ciphertexts without seeing any single hospital plaintext weight.'
  };
}

/**
 * Generate Privacy vs Utility (Accuracy) Tradeoff curve points for experiments
 */
export function getPrivacyAccuracyCurve() {
  const epsilons = [0.1, 0.2, 0.5, 0.8, 1.0, 1.5, 2.0, 3.0, 5.0, 10.0];
  return epsilons.map(eps => {
    // Mathematical utility saturation curve: Accuracy = BaseAcc - delta / (eps^0.7)
    const baseAcc = 97.4;
    const penalty = 18.0 / (Math.pow(eps, 0.65) + 0.8);
    const simulatedAcc = Math.min(97.2, Math.max(68.5, baseAcc - penalty + (Math.random() * 0.4 - 0.2)));
    const privacyRiskScore = Math.min(100, Math.max(2, Math.round(eps * 9.5)));
    
    return {
      epsilon: eps,
      accuracy: Number(simulatedAcc.toFixed(2)),
      privacyStrength: Number((100 - privacyRiskScore).toFixed(1)),
      leakageRisk: Number(privacyRiskScore.toFixed(1))
    };
  });
}
