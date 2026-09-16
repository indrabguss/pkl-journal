"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Report = {
  id: string;
  tanggal: string;
  judul: string;
  aktivitas: string;
  status: string;
  created_at: string;
};

type Profile = {
  nama?: string | null;
  email?: string | null;
  id_praktikan?: string | null;
  program_studi?: string | null;
  tempat_pkl?: string | null;
};

type ExportLaporanMingguanButtonProps = {
  reports: Report[];
  profile: Profile;
};

type WeekGroup = {
  start: Date;
  end: Date;
  reports: Report[];
};

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 21h16" />
    </svg>
  );
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
}

function formatDateShort(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(value)
    .replace(".", "");
}

function dateKey(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMonday(value: string) {
  const date = new Date(`${value}T00:00:00`);

  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);

  return date;
}

function getFriday(monday: Date) {
  const friday = new Date(monday);
  friday.setDate(friday.getDate() + 4);
  friday.setHours(23, 59, 59, 999);

  return friday;
}

function groupReportsByWeek(reports: Report[]) {
  const groups = new Map<string, WeekGroup>();

  for (const report of reports) {
    if (!report.tanggal) {
      continue;
    }

    const monday = getMonday(report.tanggal);
    const friday = getFriday(monday);
    const key = dateKey(monday);

    const existing = groups.get(key);

    if (existing) {
      existing.reports.push(report);
    } else {
      groups.set(key, {
        start: monday,
        end: friday,
        reports: [report],
      });
    }
  }

  return Array.from(groups.values()).sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );
}

function formatWeekLabel(week: WeekGroup) {
  return `${formatDate(week.start)} - ${formatDate(week.end)}`;
}

function safeFileName(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ExportLaporanMingguanButton({
  reports,
  profile,
}: ExportLaporanMingguanButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  function handleExport() {
    if (isExporting) return;

    if (reports.length === 0) {
      window.alert("Belum ada laporan yang dapat diekspor.");
      return;
    }

    setIsExporting(true);

    try {
      const weeks = groupReportsByWeek(reports);

      if (weeks.length === 0) {
        window.alert("Belum ada laporan yang dapat diekspor.");
        return;
      }

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();

      const marginLeft = 10;
      const marginRight = 10;

      // ==========================================
      // HEADER
      // ==========================================

      doc.setFont("times", "bold");
      doc.setFontSize(12);

      doc.text(
        "LAMPIRAN E. LEMBAR AKTIVITAS HARIAN",
        pageWidth / 2,
        14,
        {
          align: "center",
        }
      );

      doc.setFontSize(13);

      doc.text(
        "LEMBAR BIMBINGAN PRAKTIK KERJA LAPANGAN",
        pageWidth / 2,
        21,
        {
          align: "center",
        }
      );

      doc.setFont("times", "normal");
      doc.setFontSize(11);

      doc.text(
        "TAHUN AJARAN : 2026/2027",
        pageWidth / 2,
        28,
        {
          align: "center",
        }
      );

      // ==========================================
      // INFORMASI MAHASISWA
      // ==========================================

      let infoY = 40;

      const infoRows = [
        [
          "Nama Mahasiswa",
          profile.nama ?? "-",
        ],
        [
          "NIM",
          profile.id_praktikan ?? "-",
        ],
        [
          "Tempat PKL",
          profile.tempat_pkl ?? "-",
        ],
        [
          "Waktu PKL",
          weeks.length > 0
            ? `${formatDate(weeks[0].start)} - ${formatDate(
                weeks[weeks.length - 1].end
              )}`
            : "-",
        ],
        [
          "Dosen Pembimbing",
          "",
        ],
        [
          "NIP Pembimbing",
          "",
        ],
      ];

      for (const [label, value] of infoRows) {
        doc.setFont("times", "normal");
        doc.setFontSize(10);

        doc.text(`${label}`, marginLeft, infoY);

        doc.text(":", 54, infoY);

        doc.setFont("times", "bold");
        doc.text(String(value), 58, infoY);

        infoY += 6;
      }

      // ==========================================
      // TABLE
      // ==========================================

      const tableRows = weeks.map((week, index) => {
        const sortedReports = [...week.reports].sort((a, b) => {
          const dateComparison =
            a.tanggal.localeCompare(b.tanggal);

          if (dateComparison !== 0) {
            return dateComparison;
          }

          return a.created_at.localeCompare(b.created_at);
        });

        const descriptions = sortedReports
          .map((report) => {
            const activity = report.aktivitas?.trim();

            if (!activity) {
              return "";
            }

            return `• ${activity}`;
          })
          .filter(Boolean)
          .join("\n");

        return [
          String(index + 1),
          formatWeekLabel(week),
          descriptions || "-",
          "",
        ];
      });

      autoTable(doc, {
        startY: infoY + 4,
        margin: {
          left: marginLeft,
          right: marginRight,
        },

        head: [
          [
            "No",
            "Tanggal",
            "Deskripsi aktivitas harian",
            "Paraf pembimbing",
          ],
        ],

        body: tableRows,

        theme: "grid",

        styles: {
          font: "times",
          fontSize: 9,
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.25,
          cellPadding: 2.5,
          valign: "top",
          overflow: "linebreak",
        },

        headStyles: {
          font: "times",
          fontStyle: "bold",
          fontSize: 9,
          halign: "center",
          valign: "middle",
          textColor: [0, 0, 0],
          fillColor: [235, 235, 235],
          lineColor: [0, 0, 0],
          lineWidth: 0.25,
        },

        columnStyles: {
          0: {
            cellWidth: 10,
            halign: "center",
          },
          1: {
            cellWidth: 38,
            halign: "center",
          },
          2: {
            cellWidth: 117,
            halign: "left",
          },
          3: {
            cellWidth: 25,
            halign: "center",
          },
        },

        alternateRowStyles: {
          fillColor: [255, 255, 255],
        },

        didDrawPage: (data) => {
          const pageHeight =
            doc.internal.pageSize.getHeight();

          doc.setFont("times", "normal");
          doc.setFontSize(8);

          doc.text(
            `Halaman ${data.pageNumber}`,
            pageWidth - marginRight,
            pageHeight - 7,
            {
              align: "right",
            }
          );
        },
      });

      // ==========================================
      // SIGNATURE
      // ==========================================

      const finalY =
        (
          doc as jsPDF & {
            lastAutoTable?: {
              finalY: number;
            };
          }
        ).lastAutoTable?.finalY ?? infoY + 20;

      const signatureY = finalY + 20;

      const pageHeight =
        doc.internal.pageSize.getHeight();

      let currentSignatureY = signatureY;

      if (currentSignatureY > pageHeight - 70) {
        doc.addPage();
        currentSignatureY = 25;
      }

      doc.setFont("times", "normal");
      doc.setFontSize(10);

      doc.text(
        "Mengetahui,",
        45,
        currentSignatureY,
        {
          align: "center",
        }
      );

      doc.text(
        "................................................",
        45,
        currentSignatureY + 6,
        {
          align: "center",
        }
      );

      doc.text(
        "Pimpinan Departemen/Perusahaan",
        45,
        currentSignatureY + 36,
        {
          align: "center",
        }
      );

      doc.text(
        "(................................................)",
        45,
        currentSignatureY + 48,
        {
          align: "center",
        }
      );

      doc.text(
        "Pembimbing Lapangan,",
        155,
        currentSignatureY,
        {
          align: "center",
        }
      );

      doc.text(
        "Tanggal: ................................",
        155,
        currentSignatureY + 6,
        {
          align: "center",
        }
      );

      doc.text(
        "",
        155,
        currentSignatureY + 36,
        {
          align: "center",
        }
      );

      doc.text(
        "(................................................)",
        155,
        currentSignatureY + 48,
        {
          align: "center",
        }
      );

      // ==========================================
      // FOOTER
      // ==========================================

      const footerText =
        "PKL Journal - Lembar Aktivitas Harian";

      const totalPages = doc.getNumberOfPages();

      for (let page = 1; page <= totalPages; page++) {
        doc.setPage(page);

        doc.setFont("times", "normal");
        doc.setFontSize(8);

        doc.text(
          footerText,
          marginLeft,
          pageHeight - 7
        );
      }

      // ==========================================
      // DOWNLOAD
      // ==========================================

      const filenameName =
        safeFileName(profile.nama ?? "Mahasiswa");

      doc.save(
        `Lembar-Aktivitas-Harian-PKL-${filenameName || "Mahasiswa"}.pdf`
      );
    } catch (error) {
      console.error("Gagal membuat PDF:", error);

      window.alert(
        "Gagal membuat PDF. Silakan coba lagi."
      );
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting || reports.length === 0}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0566d9] px-5 py-3 text-sm font-semibold text-[#e6ecff] shadow-sm transition hover:bg-[#adc6ff] hover:text-[#002e6a] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <DownloadIcon />

      {isExporting
        ? "Menyiapkan PDF..."
        : "Export PDF Mingguan"}
    </button>
  );
}