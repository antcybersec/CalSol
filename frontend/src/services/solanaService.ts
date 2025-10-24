import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

const RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL || "https://api.devnet.solana.com";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const connection = new Connection(RPC_URL, "confirmed");

export interface TransactionDetails {
  type: "transfer" | "swap";
  amount: number;
  token?: string;
  recipient?: string;
  fromToken?: string;
  toToken?: string;
}

// Parse transaction from event title
export function parseTransaction(title: string): TransactionDetails | null {
  const sendRegex = /Send\s+([\d.]+)\s+(\w+)\s+to\s+([\w.]+)/i;
  const swapRegex = /Swap\s+([\d.]+)\s+(\w+)\s+to\s+(\w+)/i;

  let match = title.match(sendRegex);
  if (match) {
    return {
      type: "transfer",
      amount: parseFloat(match[1]),
      token: match[2],
      recipient: match[3],
    };
  }

  match = title.match(swapRegex);
  if (match) {
    return {
      type: "swap",
      amount: parseFloat(match[1]),
      fromToken: match[2],
      toToken: match[3],
    };
  }

  return null;
}

// Get wallet balance
export async function getBalance(publicKey: PublicKey): Promise<number> {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error;
  }
}

// Create transfer transaction
export async function createTransferTransaction(
  fromPublicKey: PublicKey,
  toPublicKey: PublicKey,
  amount: number
): Promise<Transaction> {
  try {
    const { blockhash } = await connection.getLatestBlockhash();

    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: fromPublicKey,
    }).add(
      SystemProgram.transfer({
        fromPubkey: fromPublicKey,
        toPubkey: toPublicKey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    return transaction;
  } catch (error) {
    console.error("Error creating transfer transaction:", error);
    throw error;
  }
}

// Execute transaction via backend
export async function executeTransaction(
  eventId: string,
  calendarId: string
): Promise<{ signature: string; transaction: TransactionDetails }> {
  try {
    const response = await fetch(`${API_URL}/api/transaction/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, calendarId }),
    });

    if (!response.ok) {
      throw new Error("Failed to execute transaction");
    }

    return await response.json();
  } catch (error) {
    console.error("Error executing transaction:", error);
    throw error;
  }
}

// Get transaction status
export async function getTransactionStatus(
  eventId: string
): Promise<{ status: string; signature: string }> {
  try {
    const response = await fetch(`${API_URL}/api/transaction/status/${eventId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch transaction status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching transaction status:", error);
    throw error;
  }
}

// Confirm transaction on chain
export async function confirmTransaction(signature: string): Promise<boolean> {
  try {
    const confirmed = await connection.confirmTransaction(signature);
    return confirmed.value.err === null;
  } catch (error) {
    console.error("Error confirming transaction:", error);
    throw error;
  }
}

// Get transaction details
export async function getTransactionDetails(signature: string) {
  try {
    const transaction = await connection.getTransaction(signature);
    return transaction;
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    throw error;
  }
}

// Verify calendar
export async function verifyCalendar(calendarId: string) {
  try {
    const response = await fetch(`${API_URL}/api/calendar/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ calendarId }),
    });

    if (!response.ok) {
      throw new Error("Failed to verify calendar");
    }

    return await response.json();
  } catch (error) {
    console.error("Error verifying calendar:", error);
    throw error;
  }
}

