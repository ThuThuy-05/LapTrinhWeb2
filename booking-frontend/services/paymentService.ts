import api from "@/lib/api";

export type PaymentMethod = "VNPAY" | "MOMO" | "CASH" | "BANK_QR";

export interface CreatePaymentRequest {
  bookingId: number;
  amount: number;
  method: PaymentMethod;
}

export interface CreatePaymentResponse {
  paymentUrl: string;
}

export const createPayment = async (
  data: CreatePaymentRequest,
): Promise<CreatePaymentResponse> => {
  const response = await api.post("/payments/create", data);

  console.log("PAYMENT RESPONSE:", response.data);

  return response.data;
};

export const getPaymentByBooking = async (bookingId: number) => {
  const response = await api.get(`/payments/booking/${bookingId}`);

  return response.data;
};

// THÊM HÀM NÀY
export const confirmBankTransfer = async (bookingId: number) => {
  const response = await api.post(
    `/payments/confirm-bank-transfer/${bookingId}`,
  );

  return response.data;
};
