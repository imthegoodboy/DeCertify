import { ethers } from "ethers";

// Polygon Amoy Testnet configuration
export const POLYGON_AMOY_CONFIG = {
  chainId: "0x13882", // 80002 in hex
  chainName: "Polygon Amoy Testnet",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: ["https://rpc-amoy.polygon.technology/"],
  blockExplorerUrls: ["https://amoy.polygonscan.com/"],
};

// Mock certificate data for testing
export const CERTIFICATE_ABI = [];
export const CERTIFICATE_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"; // Mock address

export const connectWallet = async (): Promise<string> => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error("MetaMask is not installed. Please install MetaMask extension to continue.");
  }

  try {
    console.log("Requesting account access...");
    
    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found. Please unlock MetaMask.");
    }

    console.log("Account connected:", accounts[0]);

    // Check if we're on the right network
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    console.log("Current chain ID:", chainId);
    
    if (chainId !== POLYGON_AMOY_CONFIG.chainId) {
      console.log("Switching to Polygon Amoy Testnet...");
      // Try to switch to Polygon Amoy
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: POLYGON_AMOY_CONFIG.chainId }],
        });
        console.log("Switched to Polygon Amoy successfully");
      } catch (switchError: any) {
        console.log("Switch error:", switchError);
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          console.log("Adding Polygon Amoy network to MetaMask...");
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [POLYGON_AMOY_CONFIG],
          });
          console.log("Polygon Amoy network added successfully");
        } else {
          throw new Error(`Failed to switch network: ${switchError.message}`);
        }
      }
    }

    return accounts[0];
  } catch (error: any) {
    console.error("Error connecting wallet:", error);
    
    // Provide more specific error messages
    if (error.code === 4001) {
      throw new Error("Connection rejected. Please approve the connection in MetaMask.");
    } else if (error.code === -32002) {
      throw new Error("Connection request already pending. Please check MetaMask.");
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to connect wallet. Please try again.");
    }
  }
};

export const getCertificateContract = (signer?: ethers.Signer) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  
  if (signer) {
    return new ethers.Contract(CERTIFICATE_CONTRACT_ADDRESS, CERTIFICATE_ABI, signer);
  }
  
  return new ethers.Contract(CERTIFICATE_CONTRACT_ADDRESS, CERTIFICATE_ABI, provider);
};

export const issueCertificateOnChain = async (certificateHash: string, recipientAddress: string): Promise<string> => {
  // For testing, return a mock transaction hash without blockchain interaction
  return "0x" + Array(64).fill("0").map(() => Math.floor(Math.random() * 16).toString(16)).join("");
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
