import { CreditCard, DollarSign } from "lucide-react";

const PaymentMethodSelector = ({
  paymentMethod,
  setPaymentMethod,
  transactionId,
  setTransactionId,
  disabled = false,
}) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium">Payment Method</label>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div
          className={`border rounded-lg p-4 flex items-center cursor-pointer ${
            disabled ? "opacity-60 cursor-not-allowed" : ""
          } ${
            paymentMethod === "online"
              ? "border-purple-600 bg-purple-50"
              : "border-gray-300"
          }`}
          onClick={() => !disabled && setPaymentMethod("online")}
        >
          <CreditCard className="h-5 w-5 mr-3 text-purple-600" />
          <div>
            <p className="font-medium">Online Payment</p>
            <p className="text-sm text-gray-500">Pay with eSewa</p>
          </div>
        </div>
        <div
          className={`border rounded-lg p-4 flex items-center cursor-pointer ${
            disabled ? "opacity-60 cursor-not-allowed" : ""
          } ${
            paymentMethod === "cash_in_hand"
              ? "border-purple-600 bg-purple-50"
              : "border-gray-300"
          }`}
          onClick={() => !disabled && setPaymentMethod("cash_in_hand")}
        >
          <DollarSign className="h-5 w-5 mr-3 text-green-600" />
          <div>
            <p className="font-medium">Cash in Hand</p>
            <p className="text-sm text-gray-500">Pay on session day</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
