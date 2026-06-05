export default function PaymentFailedPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          Thanh toán thất bại
        </h1>

        <p className="text-gray-600">Đặt lịch chưa được xác nhận.</p>
      </div>
    </div>
  );
}
