"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Html5Qrcode } from "html5-qrcode";
import { adminFetch } from "@/lib/adminApi";
import { PageHeader, PrimaryButton, GhostButton, TEXT, TEXT_MUTED, TEXT_FAINT, BORDER, GREEN, RED, AMBER } from "@/components/admin/AdminUI";
import { Loader2, ScanLine, Keyboard, ShieldCheck, CheckCircle2, XCircle, History } from "lucide-react";

interface CheckinData {
  attendee: {
    id: string;
    ticket_code: string;
    full_name: string;
    email: string;
    is_checked_in: boolean;
    checked_in_at: string | null;
  };
  order: {
    order_code: string;
    status: string;
    total_amount: number;
    paid_at: string | null;
  };
  event: {
    title: string;
    event_date: string;
    event_time: string;
    location: string;
    city: string;
  } | null;
}

interface Result {
  success: boolean;
  message: string;
  data?: CheckinData;
}

type LogStatus = "success" | "already_checked_in" | "not_found" | "not_paid" | "invalid";

interface CheckinLog {
  id: string;
  ticket_code: string;
  status: LogStatus;
  message: string;
  scanner_name: string;
  scanned_at: string;
}

interface LogsResponse {
  logs: CheckinLog[];
  total: number;
}

const STATUS_LABEL: Record<LogStatus, string> = {
  success: "Berhasil",
  already_checked_in: "Sudah check-in",
  not_found: "Tidak ditemukan",
  not_paid: "Belum lunas",
  invalid: "Kode kosong",
};

const STATUS_COLOR: Record<LogStatus, string> = {
  success: GREEN,
  already_checked_in: AMBER,
  not_found: RED,
  not_paid: RED,
  invalid: TEXT_FAINT,
};

export default function AdminScannerPage() {
  const [scannerReady, setScannerReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [logs, setLogs] = useState<CheckinLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logStatus, setLogStatus] = useState<"" | LogStatus>("");
  const readerRef = useRef<HTMLDivElement | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const processingRef = useRef(false);

  const loadLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const query = logStatus ? `?limit=50&status=${logStatus}` : "?limit=50";
      const data = await adminFetch<LogsResponse>(`/checkin-logs${query}`);
      setLogs(data.logs || []);
    } catch {
      /* history is non-critical; keep previous data */
    } finally {
      setLogsLoading(false);
    }
  }, [logStatus]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;
    try {
      await scanner.stop();
      scanner.clear();
    } catch {
      /* ignore */
    }
    scannerRef.current = null;
  }, []);

  const doCheckin = useCallback(async (code: string) => {
    setProcessing(true);
    try {
      const data = await adminFetch<CheckinData>("/checkin", { method: "POST", body: JSON.stringify({ code }) });
      setResult({ success: true, message: "Check-in berhasil. Selamat menikmati acara!", data });
    } catch (e) {
      setResult({ success: false, message: e instanceof Error ? e.message : "Terjadi kesalahan saat check-in" });
    } finally {
      setProcessing(false);
      loadLogs();
    }
  }, [loadLogs]);

  const startScanner = useCallback(async () => {
    if (processingRef.current) return;
    setResult(null);
    setCameraError("");
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (!readerRef.current) return;
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;
      setScannerReady(true);
      const readerWidth = readerRef.current.offsetWidth || 320;
      const qr = Math.max(160, Math.min(250, Math.floor(readerWidth * 0.72)));
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: qr, height: qr } },
        async (decodedText) => {
          if (processingRef.current) return;
          processingRef.current = true;
          await stopScanner();
          let code = decodedText.trim();
          try {
            const parsed = JSON.parse(decodedText);
            if (parsed && typeof parsed.code === "string" && parsed.code.trim()) code = parsed.code.trim();
          } catch {
            /* raw text */
          }
          await doCheckin(code);
          processingRef.current = false;
        },
        () => {
          /* per-frame scan errors are expected while searching */
        }
      );
    } catch (e) {
      setScannerReady(false);
      setCameraError(e instanceof Error ? e.message : "Tidak dapat mengakses kamera");
    }
  }, [doCheckin, stopScanner]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled) return;
        const cameras = await Html5Qrcode.getCameras().catch(() => []);
        if (cancelled) return;
        if (cameras && cameras.length > 0) {
          await startScanner();
        } else {
          setCameraError("Kamera tidak terdeteksi. Gunakan input manual di bawah.");
        }
      } catch {
        if (!cancelled) setCameraError("Kamera tidak terdeteksi. Gunakan input manual di bawah.");
      }
    })();
    return () => {
      cancelled = true;
      stopScanner();
    };
  }, [startScanner, stopScanner]);

  const rescan = () => {
    setResult(null);
    setManualCode("");
    startScanner();
  };

  const submitManual = (e: React.FormEvent) => {
    e.preventDefault();
    const code = manualCode.trim();
    if (!code) return;
    doCheckin(code);
  };

  return (
    <div>
      <PageHeader
        title="Scan QR Check-in"
        subtitle="Pindai e-ticket pengunjung. QR palsu atau tidak terdaftar otomatis ditolak."
      />

      <div className="scan-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 16, alignItems: "start" }}>
        {/* Scanner card */}
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: TEXT }}>
              <ScanLine size={16} />
              Kamera
            </span>
            {result && (
              <GhostButton onClick={rescan}>
                Scan lagi
              </GhostButton>
            )}
          </div>

          <div style={{ padding: 16 }}>
            <div
              id="qr-reader"
              ref={readerRef}
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                maxHeight: 360,
                borderRadius: 10,
                overflow: "hidden",
                background: "#0B0E14",
                position: "relative",
                display: scannerReady ? "block" : "none",
              }}
            />
            {!scannerReady && !cameraError && (
              <div style={{ height: 260, borderRadius: 10, background: "#F5F5F4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: TEXT_FAINT, fontSize: 13.5 }}>
                <Loader2 size={22} className="admin-spin" />
                Menyalakan kamera...
              </div>
            )}
            {cameraError && (
              <div style={{ height: 200, borderRadius: 10, background: "#F5F5F4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "0 24px", textAlign: "center", color: TEXT_MUTED, fontSize: 13 }}>
                <span style={{ fontSize: 26 }}>📷</span>
                {cameraError}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 12, fontSize: 12.5, color: TEXT_FAINT }}>
              <ShieldCheck size={14} color={GREEN} />
              Keamanan: validasi dilakukan ke database, bukan dari isi QR. Kode acak/tidak dikenal langsung ditolak.
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Manual entry */}
          <form
            onSubmit={submitManual}
            style={{ border: `1px solid ${BORDER}`, borderRadius: 10, background: "#fff", padding: 16 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 14, fontWeight: 600, color: TEXT }}>
              <Keyboard size={16} />
              Input manual
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="scan-input"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Kode tiket / order (mis. AB12CD atau TIX-XXXXXX)"
                style={{
                  flex: 1,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 6,
                  padding: "11px 12px",
                  fontSize: 13.5,
                  outline: "none",
                  color: TEXT,
                  background: "#FBFBFA",
                  boxSizing: "border-box",
                }}
              />
              <PrimaryButton disabled={processing || !manualCode.trim()}>Cek</PrimaryButton>
            </div>
            <div style={{ fontSize: 12, color: TEXT_FAINT, marginTop: 8 }}>
              Berguna saat kamera tidak tersedia atau QR terlalu kecil.
            </div>
          </form>

          {/* Result */}
          {processing && (
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, background: "#fff", padding: "28px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, color: TEXT_MUTED, fontSize: 13.5 }}>
              <Loader2 size={22} className="admin-spin" />
              Memvalidasi tiket...
            </div>
          )}

          {result && !processing && (
            <div
              style={{
                border: `1px solid ${result.success ? "#B6E0C7" : "#FFBDC1"}`,
                borderRadius: 10,
                background: result.success ? "#F2FBF6" : "#FFF5F6",
                padding: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 600, color: result.success ? GREEN : RED, fontSize: 14.5 }}>
                {result.success ? <CheckCircle2 size={19} /> : <XCircle size={19} />}
                {result.success ? "Check-in berhasil" : "Check-in ditolak"}
              </div>
              <div style={{ marginTop: 6, fontSize: 13.5, color: result.success ? "#18794E" : "#CD2B31", lineHeight: 1.5 }}>{result.message}</div>

              {result.data && (
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  <ResultRow label="Nama" value={result.data.attendee.full_name || "-"} />
                  <ResultRow label="Kode tiket" value={result.data.attendee.ticket_code} mono />
                  <ResultRow label="Event" value={result.data.event ? `${result.data.event.title}` : "-"} />
                  {result.data.event && (
                    <ResultRow
                      label="Waktu"
                      value={`${result.data.event.event_date || "-"}${result.data.event.event_time ? ` • ${result.data.event.event_time}` : ""}`}
                    />
                  )}
                  {result.data.event && <ResultRow label="Lokasi" value={`${result.data.event.location || "-"}${result.data.event.city ? ` (${result.data.event.city})` : ""}`} />}
                  <ResultRow label="No. order" value={result.data.order.order_code} mono />
                  {result.data.attendee.checked_in_at && (
                    <ResultRow label="Check-in" value={new Date(result.data.attendee.checked_in_at).toLocaleString("id-ID")} />
                  )}
                </div>
              )}
            </div>
          )}

          {!result && !processing && (
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, background: "#fff", padding: 16, fontSize: 12.5, color: TEXT_FAINT, lineHeight: 1.6 }}>
              Arahkan kamera ke QR e-ticket pengunjung (di layar HP). Setelah scan, hasil akan muncul di sini. Tiket yang sudah pernah di-scan akan ditolak untuk mencegah pemakaian ganda.
            </div>
          )}
        </div>
      </div>

      {/* Scan history */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, background: "#fff", marginTop: 16, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: TEXT }}>
            <History size={16} />
            Riwayat Scan
            <span style={{ fontSize: 12, fontWeight: 500, color: TEXT_FAINT }}>({logs.length} terbaru)</span>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <select
              value={logStatus}
              onChange={(e) => setLogStatus(e.target.value as "" | LogStatus)}
              style={{
                border: `1px solid ${BORDER}`,
                borderRadius: 6,
                padding: "7px 10px",
                fontSize: 13,
                outline: "none",
                color: TEXT,
                background: "#FBFBFA",
              }}
            >
              <option value="">Semua status</option>
              {(Object.keys(STATUS_LABEL) as LogStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
            <GhostButton onClick={() => loadLogs()} disabled={logsLoading}>
              <Loader2 size={13} className={logsLoading ? "admin-spin" : ""} style={{ display: "inline" }} />
              Muat ulang
            </GhostButton>
          </div>
        </div>

        {logs.length === 0 && !logsLoading ? (
          <div style={{ padding: "28px 16px", textAlign: "center", fontSize: 13, color: TEXT_FAINT }}>
            Belum ada aktivitas scan. Setiap scan (berhasil, ditolak, maupun tiket tidak dikenal) akan tercatat di sini.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="scan-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", color: TEXT_FAINT, fontSize: 12, borderBottom: `1px solid ${BORDER}` }}>
                  <th style={{ padding: "10px 16px", fontWeight: 600 }}>Waktu</th>
                  <th style={{ padding: "10px 16px", fontWeight: 600 }}>Kode</th>
                  <th style={{ padding: "10px 16px", fontWeight: 600 }}>Status</th>
                  <th style={{ padding: "10px 16px", fontWeight: 600 }}>Keterangan</th>
                  <th style={{ padding: "10px 16px", fontWeight: 600 }}>Di-scan oleh</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ padding: "10px 16px", whiteSpace: "nowrap", color: TEXT_MUTED }}>{new Date(log.scanned_at).toLocaleString("id-ID")}</td>
                    <td style={{ padding: "10px 16px", fontFamily: "monospace", fontWeight: 500, color: TEXT }}>{log.ticket_code}</td>
                    <td style={{ padding: "10px 16px", whiteSpace: "nowrap" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          color: STATUS_COLOR[log.status],
                          fontWeight: 600,
                        }}
                      >
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLOR[log.status], flexShrink: 0 }} />
                        {STATUS_LABEL[log.status]}
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px", color: TEXT_MUTED, maxWidth: 420 }}>{log.message}</td>
                    <td style={{ padding: "10px 16px", whiteSpace: "nowrap", color: TEXT_MUTED }}>{log.scanner_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .admin-spin { animation: adminSpin 0.8s linear infinite; }
        @media (max-width: 860px) {
          .scan-grid { grid-template-columns: 1fr !important; }
          .scan-input { font-size: 16px !important; }
          .scan-table th, .scan-table td { padding: 8px 10px !important; }
          .scan-table { min-width: 620px; }
        }
      `}</style>
    </div>
  );
}

function ResultRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <span style={{ width: 82, flexShrink: 0, fontSize: 12.5, color: TEXT_FAINT }}>{label}</span>
      <span style={{ fontSize: 13, color: TEXT, fontWeight: 500, fontFamily: mono ? "monospace" : "inherit", wordBreak: "break-word" }}>{value}</span>
    </div>
  );
}
