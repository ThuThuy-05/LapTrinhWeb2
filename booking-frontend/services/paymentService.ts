import api from "@/lib/api";

export type PaymentMethod = "VNPAY" | "MOMO" | "CASH";

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
