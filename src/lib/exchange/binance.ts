import crypto from "crypto";
import type { TradeOrder, TradeResult, ExchangeBalance } from "@/types";

const BINANCE_BASE_URL = "https://api.binance.com";

interface BinanceCredentials {
  apiKey: string;
  apiSecret: string;
}

function sign(queryString: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(queryString).digest("hex");
}

async function binanceRequest<T>(
  method: "GET" | "POST" | "DELETE",
  path: string,
  params: Record<string, string | number | boolean>,
  credentials: BinanceCredentials
): Promise<T> {
  const timestamp = Date.now();
  const queryParams = new URLSearchParams({
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    timestamp: String(timestamp),
  });
  const signature = sign(queryParams.toString(), credentials.apiSecret);
  queryParams.set("signature", signature);

  const url =
    method === "GET"
      ? `${BINANCE_BASE_URL}${path}?${queryParams}`
      : `${BINANCE_BASE_URL}${path}`;

  const res = await fetch(url, {
    method,
    headers: {
      "X-MBX-APIKEY": credentials.apiKey,
      ...(method !== "GET" ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: method !== "GET" ? queryParams.toString() : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ msg: res.statusText }));
    throw new Error(`Binance API error ${res.status}: ${(error as { msg: string }).msg}`);
  }

  return res.json() as Promise<T>;
}

export async function placeTrade(
  order: TradeOrder,
  credentials: BinanceCredentials
): Promise<TradeResult> {
  const symbol = order.pair.replace("/", "").toUpperCase();

  interface BinanceOrderResponse {
    orderId: number;
    symbol: string;
    side: string;
    origQty: string;
    price: string;
    status: string;
    transactTime: number;
    fills?: Array<{ commission: string; commissionAsset: string }>;
  }

  const response = await binanceRequest<BinanceOrderResponse>(
    "POST",
    "/api/v3/order",
    {
      symbol,
      side: order.side.toUpperCase(),
      type: order.type.toUpperCase(),
      quantity: order.amount,
      ...(order.type === "limit" ? { price: order.price, timeInForce: "GTC" } : {}),
    },
    credentials
  );

  const fill = response.fills?.[0];
  const statusMap: Record<string, TradeResult["status"]> = {
    FILLED: "filled",
    PARTIALLY_FILLED: "open",
    NEW: "open",
    CANCELED: "cancelled",
    REJECTED: "failed",
  };

  return {
    orderId: String(response.orderId),
    exchange: "binance",
    pair: order.pair,
    side: order.side,
    amount: parseFloat(response.origQty),
    price: parseFloat(response.price) || order.price,
    status: statusMap[response.status] ?? "open",
    filledAt: response.status === "FILLED" ? new Date(response.transactTime) : undefined,
    fee: fill ? parseFloat(fill.commission) : undefined,
    feeAsset: fill?.commissionAsset,
  };
}

export async function getBalance(
  credentials: BinanceCredentials,
  assets?: string[]
): Promise<ExchangeBalance[]> {
  interface BinanceAccountResponse {
    balances: Array<{ asset: string; free: string; locked: string }>;
  }

  const response = await binanceRequest<BinanceAccountResponse>(
    "GET",
    "/api/v3/account",
    {},
    credentials
  );

  const balances = response.balances
    .filter((b) => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0)
    .filter((b) => !assets || assets.includes(b.asset));

  return balances.map((b) => ({
    asset: b.asset,
    free: parseFloat(b.free),
    locked: parseFloat(b.locked),
    usdValue: 0, // Enrich with price data in a separate call if needed
  }));
}

export async function cancelOrder(
  symbol: string,
  orderId: string,
  credentials: BinanceCredentials
): Promise<void> {
  await binanceRequest(
    "DELETE",
    "/api/v3/order",
    { symbol: symbol.replace("/", "").toUpperCase(), orderId },
    credentials
  );
}
