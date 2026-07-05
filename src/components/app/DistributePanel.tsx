"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { isAddress, parseUnits, formatUnits } from "viem";
import { useZamaSDK } from "@zama-fhe/react-sdk";
import {
  useConfidentialBalance,
  useMetadata,
} from "@zama-fhe/react-sdk";
import {
  useDisperse,
  usePreflightDisperse,
  useCalculateFee,
} from "@tokenops/sdk/fhe-disperse/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  setOperator,
  ERC7984_OPERATOR_MAX_DEADLINE,
  type Encryptor,
} from "@tokenops/sdk/fhe-disperse";
import { useRegistryPairs } from "@/hooks/useRegistryPairs";
import { TokenSelect } from "@/components/app/TokenSelect";
import { TokenIcon } from "@/components/app/TokenIcon";
import { AlertMessage } from "@/components/app/AlertMessage";
import { formatWalletError } from "@/lib/errors";
import { CONFIDENTIAL_BALANCE_ABI } from "@/lib/abis";
import {
  DISPERSE_SINGLETON_SEPOLIA,
  loadDisperseCampaigns,
  saveDisperseCampaign,
  getRecipientClaimStatus,
  parseRecipientCsv,
  type DisperseCampaign,
} from "@/lib/disperse";
import type { TokenPair } from "@/lib/types";

type PanelRole = "sender" | "recipient";
type WizardStep = 1 | 2 | 3 | 4;

interface RecipientRow {
  id: string;
  address: string;
  amount: string;
}

function newRow(): RecipientRow {
  return { id: crypto.randomUUID(), address: "", amount: "" };
}

function RecipientDecryptCard({ tokenAddress }: { tokenAddress: `0x${string}` }) {
  const { address } = useAccount();
  const { data: meta } = useMetadata(tokenAddress);
  const {
    data: balance,
    isLoading,
    error,
    refetch,
  } = useConfidentialBalance({
    address: tokenAddress,
    account: address,
  });

  const decimals = meta?.decimals ?? 6;
  const symbol = meta?.symbol ?? "cTOKEN";

  return (
    <div className="emboss-card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <TokenIcon symbol={symbol} size={36} />
        <div>
          <p className="font-semibold text-[#16171C]">{symbol}</p>
          <p className="text-[11px] text-gray-400 font-mono truncate max-w-[200px]">
            {tokenAddress}
          </p>
        </div>
      </div>

      {isLoading && (
        <AlertMessage
          type="loading"
          title="Decrypting"
          message="EIP-712 signature required to reveal your confidential allocation."
        />
      )}

      {error && (
        <AlertMessage
          type="error"
          title="Decryption Failed"
          message={formatWalletError(error)}
        />
      )}

      {balance !== undefined && !error && (
        <div className="p-4 rounded-xl bg-[#F5C518]/10 border border-[#F5C518]/30">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            Your allocation
          </p>
          <p className="text-2xl font-mono font-semibold text-[#16171C]">
            {formatUnits(balance, decimals)} {symbol}
          </p>
        </div>
      )}

      <button
        onClick={() => refetch()}
        className="w-full bg-[#16171C] hover:bg-black text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-40"
      >
        Decrypt &amp; Claim
      </button>
    </div>
  );
}

function CampaignStatusRow({
  campaign,
  recipient,
}: {
  campaign: DisperseCampaign;
  recipient: `0x${string}`;
}) {
  const publicClient = usePublicClient();
  const { data: status } = useQuery({
    queryKey: ["claim-status", campaign.token, recipient],
    queryFn: () => {
      if (!publicClient) throw new Error("No client");
      return getRecipientClaimStatus(publicClient, campaign.token, recipient);
    },
    enabled: !!publicClient,
    refetchInterval: 15_000,
  });

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="font-mono text-[12px] text-gray-600 truncate max-w-[55%]">
        {recipient}
      </span>
      <span
        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
          status === "claimed"
            ? "bg-green-50 text-green-700"
            : status === "pending"
              ? "bg-amber-50 text-amber-700"
              : "bg-gray-100 text-gray-500"
        }`}
      >
        {status === "claimed" ? "Claimed" : status === "pending" ? "Pending" : "…"}
      </span>
    </div>
  );
}

export function DistributePanel() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const zamaSDK = useZamaSDK();
  const queryClient = useQueryClient();
  const { data: pairs } = useRegistryPairs();

  const [role, setRole] = useState<PanelRole>("sender");
  const [step, setStep] = useState<WizardStep>(1);
  const [selectedToken, setSelectedToken] = useState("");
  const [rows, setRows] = useState<RecipientRow[]>([newRow(), newRow()]);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [execError, setExecError] = useState<string | null>(null);
  const [lastTxHash, setLastTxHash] = useState<`0x${string}` | null>(null);
  const [campaigns, setCampaigns] = useState<DisperseCampaign[]>([]);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);

  const selectedPair: TokenPair | undefined = pairs?.find(
    (p) => p.erc7984Address === selectedToken
  );

  const validRows = useMemo(
    () =>
      rows.filter(
        (r) => isAddress(r.address) && r.amount && Number(r.amount) > 0
      ),
    [rows]
  );

  const recipients = validRows.map((r) => r.address as `0x${string}`);
  const amounts = validRows.map((r) =>
    parseUnits(r.amount, selectedPair?.erc7984Decimals ?? 6)
  );
  const totalAmount = amounts.reduce((a, b) => a + b, 0n);

  const disperse = useDisperse({
    // Zama react-sdk relayer is structurally compatible; cast bridges v3 type drift.
    encryptor: () => zamaSDK.relayer as unknown as Encryptor,
  });

  const preflight = usePreflightDisperse({
    user: address,
    token: selectedToken as `0x${string}`,
    recipients,
    amounts,
    mode: "direct",
  });

  const fee = useCalculateFee({
    user: address,
    mode: "direct",
    recipients: recipients.length,
  });

  const { data: operatorApproved } = useQuery({
    queryKey: ["disperse-operator", address, selectedToken],
    queryFn: async () => {
      if (!publicClient || !address || !selectedToken) return false;
      return publicClient.readContract({
        address: selectedToken as `0x${string}`,
        abi: CONFIDENTIAL_BALANCE_ABI,
        functionName: "isOperator",
        args: [address, DISPERSE_SINGLETON_SEPOLIA],
      }) as Promise<boolean>;
    },
    enabled: !!publicClient && !!address && !!selectedToken,
  });

  const { data: pendingTokens } = useQuery({
    queryKey: ["recipient-pending", address, pairs?.length],
    queryFn: async () => {
      if (!publicClient || !address || !pairs) return [];
      const withBalance: TokenPair[] = [];
      for (const pair of pairs) {
        const status = await getRecipientClaimStatus(
          publicClient,
          pair.erc7984Address,
          address
        );
        if (status === "pending") withBalance.push(pair);
      }
      return withBalance;
    },
    enabled: !!publicClient && !!address && !!pairs && role === "recipient",
    refetchInterval: 20_000,
  });

  useEffect(() => {
    setCampaigns(loadDisperseCampaigns());
  }, []);

  const tokenOptions = useMemo(
    () =>
      (pairs ?? []).map((pair) => ({
        value: pair.erc7984Address,
        label: pair.erc7984Symbol,
        sublabel: `${pair.erc7984Name} · Shield first`,
        symbol: pair.erc7984Symbol,
      })),
    [pairs]
  );

  const updateRow = (id: string, patch: Partial<RecipientRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const handleCsvUpload = (file: File) => {
    setCsvError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseRecipientCsv(String(reader.result ?? ""));
      if (parsed.length === 0) {
        setCsvError("No valid rows found. Use format: address,amount per line.");
        return;
      }
      setRows(
        parsed.map((p) => ({
          id: crypto.randomUUID(),
          address: p.address,
          amount: p.amount,
        }))
      );
      setStep(1);
    };
    reader.readAsText(file);
  };

  const ensureOperator = useCallback(async () => {
    if (!publicClient || !walletClient || !address || !selectedToken) {
      throw new Error("Wallet not ready");
    }
    if (operatorApproved) return;

    await setOperator({
      publicClient,
      walletClient,
      account: address,
      token: selectedToken as `0x${string}`,
      spender: DISPERSE_SINGLETON_SEPOLIA,
      deadline: ERC7984_OPERATOR_MAX_DEADLINE,
    });

    await queryClient.invalidateQueries({
      queryKey: ["disperse-operator", address, selectedToken],
    });
  }, [
    publicClient,
    walletClient,
    address,
    selectedToken,
    operatorApproved,
    queryClient,
  ]);

  const handleDisperse = async () => {
    if (!selectedPair || !address) return;
    setExecError(null);

    try {
      await ensureOperator();

      const result = await disperse.mutateAsync({
        token: selectedPair.erc7984Address,
        mode: "direct",
        recipients,
        amounts,
      });

      setLastTxHash(result.hash);
      const campaign: DisperseCampaign = {
        id: result.hash,
        txHash: result.hash,
        token: selectedPair.erc7984Address,
        tokenSymbol: selectedPair.erc7984Symbol,
        recipients,
        sender: address,
        createdAt: Date.now(),
      };
      saveDisperseCampaign(campaign);
      setCampaigns(loadDisperseCampaigns());
      setActiveCampaignId(campaign.id);
      setStep(4);
    } catch (e) {
      setExecError(formatWalletError(e));
    }
  };

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId) ?? campaigns[0];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="emboss-card p-6 sm:p-8">
        <div className="relative z-10 space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Confidential Payroll
            </h2>
            <p className="text-[15px] text-gray-500 mt-2 leading-relaxed">
              Distribute shielded ERC-7984 salaries to your team in one transaction.
              Amounts stay encrypted on-chain — only each recipient can decrypt their pay.
            </p>
          </div>

          <div className="flex gap-1 p-1 bg-gray-100/80 rounded-full">
            <button
              onClick={() => setRole("sender")}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                role === "sender"
                  ? "bg-white shadow-sm text-[#16171C]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sender (Payroll)
            </button>
            <button
              onClick={() => setRole("recipient")}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                role === "recipient"
                  ? "bg-white shadow-sm text-[#16171C]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Recipient (Employee)
            </button>
          </div>
        </div>
      </div>

      {role === "recipient" ? (
        <div className="space-y-4">
          {pendingTokens && pendingTokens.length > 0 ? (
            <>
              <AlertMessage
                type="success"
                title="Pending confidential distribution"
                message="You have encrypted payroll allocations waiting. Decrypt below to view your pay — third parties cannot see individual amounts."
              />
              {pendingTokens.map((pair) => (
                <RecipientDecryptCard
                  key={pair.erc7984Address}
                  tokenAddress={pair.erc7984Address}
                />
              ))}
            </>
          ) : (
            <div className="emboss-card p-8 text-center">
              <p className="text-gray-500 text-sm">
                No pending confidential distributions detected for your wallet.
              </p>
              <p className="text-[11px] text-gray-400 mt-2">
                Allocations appear here after your employer runs a payroll batch on Sepolia.
              </p>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Step indicator */}
          <div className="flex items-center gap-2 px-2">
            {([1, 2, 3, 4] as WizardStep[]).map((s) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    step >= s
                      ? "bg-[#F5C518] text-[#16171C]"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-0.5 ${
                      step > s ? "bg-[#F5C518]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 text-center -mt-2">
            {step === 1 && "Select token & recipients"}
            {step === 2 && "Review payroll"}
            {step === 3 && "Execute"}
            {step === 4 && "Track claims"}
          </p>

          {step === 1 && (
            <div className="emboss-card p-6 sm:p-8 space-y-5">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shielded token (from Registry)
                </label>
                <div className="mt-2">
                  <TokenSelect
                    options={tokenOptions}
                    value={selectedToken}
                    onChange={setSelectedToken}
                    placeholder="Select wrapped ERC-7984 token..."
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                  Shield tokens in the Shield tab first — disperse pulls from your confidential balance.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipients
                  </label>
                  <label className="text-[11px] text-[#d4a600] font-semibold cursor-pointer hover:underline">
                    <input
                      type="file"
                      accept=".csv,.txt"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleCsvUpload(f);
                      }}
                    />
                    Upload CSV
                  </label>
                </div>
                {csvError && (
                  <AlertMessage type="error" title="CSV Error" message={csvError} />
                )}
                {rows.map((row) => (
                  <div key={row.id} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="0x recipient"
                      value={row.address}
                      onChange={(e) => updateRow(row.id, { address: e.target.value })}
                      className="flex-[2] liquid-glass-field rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#F5C518]/40"
                    />
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="Amount"
                      value={row.amount}
                      onChange={(e) => updateRow(row.id, { amount: e.target.value })}
                      className="flex-1 liquid-glass-field rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#F5C518]/40"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setRows((prev) => prev.filter((r) => r.id !== row.id))
                      }
                      className="px-2 text-gray-400 hover:text-red-500"
                      aria-label="Remove row"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setRows((prev) => [...prev, newRow()])}
                  className="text-sm text-gray-500 hover:text-[#16171C] font-medium"
                >
                  + Add recipient
                </button>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!selectedToken || validRows.length === 0}
                className="w-full bg-[#16171C] hover:bg-black text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-40"
              >
                Continue to Review
              </button>
            </div>
          )}

          {step === 2 && selectedPair && (
            <div className="emboss-card p-6 sm:p-8 space-y-5">
              <h3 className="font-semibold text-[#16171C]">Payroll summary</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-xl bg-white/60 border border-white/80">
                  <p className="text-gray-500 text-[11px]">Token</p>
                  <p className="font-semibold flex items-center gap-2 mt-1">
                    <TokenIcon symbol={selectedPair.erc7984Symbol} size={22} />
                    {selectedPair.erc7984Symbol}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/60 border border-white/80">
                  <p className="text-gray-500 text-[11px]">Recipients</p>
                  <p className="font-semibold mt-1">{validRows.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/60 border border-white/80 col-span-2">
                  <p className="text-gray-500 text-[11px]">Total payroll (plaintext preview — encrypted on-chain)</p>
                  <p className="font-mono font-semibold mt-1">
                    {formatUnits(totalAmount, selectedPair.erc7984Decimals)}{" "}
                    {selectedPair.erc7984Symbol}
                  </p>
                </div>
              </div>

              {preflight.data && !preflight.data.ready && (
                <AlertMessage
                  type="error"
                  title="Preflight blockers"
                  message={
                    preflight.data.blockers.join(" · ") ||
                    "Fix the issues above before dispersing."
                  }
                />
              )}

              {fee.data && (
                <p className="text-[11px] text-gray-400 text-center">
                  Network fee: {formatUnits(fee.data.ethValue, 18)} ETH (gas per recipient)
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-white/80"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={preflight.isLoading || preflight.data?.ready === false}
                  className="flex-[2] bg-[#16171C] hover:bg-black text-white font-semibold py-3 rounded-xl disabled:opacity-40"
                >
                  Confirm &amp; Execute
                </button>
              </div>
            </div>
          )}

          {step === 3 && selectedPair && (
            <div className="emboss-card p-6 sm:p-8 space-y-5">
              <h3 className="font-semibold text-[#16171C]">Execute payroll batch</h3>
              <p className="text-sm text-gray-500">
                One transaction encrypts all amounts and grants ACL to each employee.
                {!operatorApproved && " You will first approve the TokenOps singleton as operator."}
              </p>

              {execError && (
                <AlertMessage type="error" title="Disperse Failed" message={execError} />
              )}

              {disperse.isPending && (
                <AlertMessage
                  type="loading"
                  title="Broadcasting"
                  message="Encrypting amounts and submitting disperse transaction..."
                />
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  disabled={disperse.isPending}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleDisperse}
                  disabled={disperse.isPending || !preflight.data?.ready}
                  className="flex-[2] bg-[#16171C] hover:bg-black text-white font-semibold py-3 rounded-xl disabled:opacity-40"
                >
                  {disperse.isPending ? "Processing…" : "Disperse Payroll"}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="emboss-card p-6 sm:p-8 space-y-5">
              <h3 className="font-semibold text-[#16171C]">Track claim status</h3>
              {lastTxHash && (
                <AlertMessage
                  type="success"
                  title="Payroll dispersed"
                  message={
                    <>
                      Transaction confirmed.{" "}
                      <a
                        href={`https://sepolia.etherscan.io/tx/${lastTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-medium"
                      >
                        View on Etherscan
                      </a>
                    </>
                  }
                />
              )}
              <p className="text-[11px] text-gray-400">
                Status only — individual amounts stay private. Pending = employee still holds encrypted allocation.
              </p>

              {campaigns.length > 0 && (
                <select
                  value={activeCampaignId ?? campaigns[0]?.id}
                  onChange={(e) => setActiveCampaignId(e.target.value)}
                  className="w-full liquid-glass-field rounded-xl px-3 py-2 text-sm"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.tokenSymbol} · {c.recipients.length} recipients ·{" "}
                      {new Date(c.createdAt).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              )}

              {activeCampaign && (
                <div className="max-h-64 overflow-y-auto">
                  {activeCampaign.recipients.map((r) => (
                    <CampaignStatusRow
                      key={r}
                      campaign={activeCampaign}
                      recipient={r}
                    />
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  setStep(1);
                  setRows([newRow(), newRow()]);
                  setLastTxHash(null);
                }}
                className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-white/80"
              >
                New payroll batch
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
