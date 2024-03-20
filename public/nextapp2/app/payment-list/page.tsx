"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const PaymentListPage: React.FC = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Fetch the token from local storage or wherever it's stored after login
    const storedToken:any = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchPayments();
    }

  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment-detail`,
        {
            headers: {
                'Authorization': `Bearer ${token}`, // Include the token in the request headers
              }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setPayments(data.data);
      } else {
        console.error("Failed to fetch payment list:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching payment list:", error);
    }
  };

  const handleUpdateStatus = async (paymentId: number, status: string) => {
    try {
      if (!confirm("Are sure to update Payment Status")) return false;
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment-detail/update-status/${paymentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      if (response.ok) {
        toast.success("Payment status updated successfully");
        fetchPayments(); // Refresh the payment list
      } else {
        console.error("Failed to update payment status:", response.statusText);
        toast.error("Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("An error occurred while updating payment status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Payment List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Uploaded Document</th>
            <th>Status</th>
            <th>create_at</th>
            <th>update_at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.user_id}</td>
              <td>{payment.amount}</td>
              <td>{payment.description}</td>
              <td>
                {payment.doc ? (
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${payment.doc}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    doc
                  </a>
                ) : (
                  "No document uploaded"
                )}
              </td>
              <td>{payment.status}</td>
              <td>{payment.create_at}</td>
              <td>{payment.update_at}</td>
              <td>
                {payment.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(payment.id, "approved")}
                      disabled={isLoading}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(payment.id, "rejected")}
                      disabled={isLoading}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentListPage;
