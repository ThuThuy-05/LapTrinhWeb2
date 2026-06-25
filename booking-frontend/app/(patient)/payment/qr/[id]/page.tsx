"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getPaymentByBooking } from "@/services/paymentService";

export default function QRPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const amount = searchParams.get("amount") || "0";
  const bookingId = Number(params.id);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await getPaymentByBooking(bookingId);

        if (res.status === "SUCCESS") {
          clearInterval(interval);
          router.replace("/payment-success");
        }
      } catch (err) {
        console.log(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [bookingId, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Thanh toán QR Banking
        </h1>

        <img
          src={`https://img.vietqr.io/image/MB-0339590453-compact2.png?amount=${amount}&addInfo=KHAM${bookingId}`}
          alt="QR"
          className="w-72 mx-auto"
        />

        <div className="mt-6 text-center">
          <p>
            <b>Ngân hàng:</b> MB Bank
          </p>
          <p>
            <b>Số tài khoản:</b> 0339590453
          </p>
          <p>
            <b>Nội dung:</b> KHAM{bookingId}
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Đang chờ xác nhận thanh toán...
        </p>
      </div>
    </div>
  );
}
