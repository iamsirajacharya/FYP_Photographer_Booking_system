import React, { useState } from "react";

const PaymentMethodSelector = ({
  paymentMethod,
  setPaymentMethod,
  transactionId,
  setTransactionId,
}) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium">Payment Method</label>
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <input
            type="radio"
            id="online-payment"
            name="paymentMethod"
            value="online"
            checked={paymentMethod === "online"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-2"
          />
          <label htmlFor="online-payment">Online Payment</label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id="cash-payment"
            name="paymentMethod"
            value="cash_in_hand"
            checked={paymentMethod === "cash_in_hand"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-2"
          />
          <label htmlFor="cash-payment">Cash in Hand</label>
        </div>
      </div>

      {/* Transaction ID for online payments */}
      {/* {paymentMethod === "online" && (
        <div className="mt-4">
          <label className="block mb-2 font-medium">Transaction ID</label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Enter your payment transaction ID"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Please enter the transaction ID from your payment provider
          </p>
        </div>
      )} */}
    </div>
  );
};

export default PaymentMethodSelector;
