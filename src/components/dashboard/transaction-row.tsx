"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { WhaleTransaction } from "@/types";

const CHAIN_COLORS: Record<string, string> = {
  ethereum: "bg-blue-500/20 text-blue-400",
  bitcoin: "bg-orange-500/20 text-orange-400",
  solana: "bg-purple-500/20 text-purple-400",
  polygon: "bg-violet-500/20 text-violet-400",
  arbitrum: "bg-sky-500/20 text-sky-400",
  base: "bg-indigo-500/20 text-indigo-400",
};

function truncateAddress(addr: string): string {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatUSD(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function getUsdValueColor(usdValue: number): string {
  if (usdValue >= 1_000_000) return "text-red-400 font-semibold";
  if (usdValue >= 500_000) return "text-amber-400 font-semibold";
  if (usdValue >= 100_000) return "text-yellow-400";
  return "text-zinc-200";
}

interface TransactionRowProps {
  transaction: WhaleTransaction;
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const chainColor = CHAIN_COLORS[transaction.chain] ?? "bg-zinc-700 text-zinc-300";

  return (
    <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
      <TableCell>
        <span className={cn("px-2 py-0.5 rounded text-xs font-medium capitalize", chainColor)}>
          {transaction.chain === "ethereum"
            ? "ETH"
            : transaction.chain === "bitcoin"
            ? "BTC"
            : transaction.chain === "solana"
            ? "SOL"
            : transaction.chain === "polygon"
            ? "MATIC"
            : transaction.chain === "arbitrum"
            ? "ARB"
            : "BASE"}
        </span>
      </TableCell>
      <TableCell className="font-mono text-xs text-zinc-300">
        {transaction.fromLabel ? (
          <span className="text-blue-400">{transaction.fromLabel}</span>
        ) : (
          truncateAddress(transaction.fromAddress)
        )}
      </TableCell>
      <TableCell className="font-mono text-xs text-zinc-300">
        {transaction.toLabel ? (
          <span className="text-blue-400">{transaction.toLabel}</span>
        ) : (
          truncateAddress(transaction.toAddress)
        )}
      </TableCell>
      <TableCell className="text-zinc-200 font-medium">{transaction.token}</TableCell>
      <TableCell className="text-zinc-300">
        {transaction.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </TableCell>
      <TableCell className={getUsdValueColor(transaction.usdValue)}>
        {formatUSD(transaction.usdValue)}
      </TableCell>
      <TableCell className="text-zinc-500 text-xs">
        {timeAgo(transaction.timestamp)}
      </TableCell>
    </TableRow>
  );
}
