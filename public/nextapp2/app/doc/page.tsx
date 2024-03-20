'use client'
import React, { useState } from 'react';

const PaymentConfirmationForm: React.FC = () => {
  const [username, setUsername] = useState('user');
  const [name, setName] = useState('ee');
  const [email, setEmail] = useState('tt@gmail.com');
  const [amount, setAmount] = useState(10);
  const [description, setDescription] = useState('tt@gmail.com');
  const [doc, setDoc] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if all fields are filled
    if (!username || !name || !email || !doc || !amount ) {
      alert('All fields are mandatory!');
      return;
    }

    // Set submitting state to true
    setSubmitting(true);

    try {
      // Create form data object
      const formData = new FormData();
      formData.append('username', username);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('doc', doc);
      formData.append('amount', String( amount));
      formData.append('description', description);

      // Perform the form submission
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment-confirmation`, {
        method: 'POST',
        body: formData,
      });

      // Check if the request was successful
      if (response.ok) {
        alert('Payment confirmation submitted successfully!');
        // Reset form fields after successful submission
        setUsername('');
        setName('');
        setEmail('');
        setDoc(null);
      } else {
        alert('Failed to submit payment confirmation.');
      }
    } catch (error) {
      console.error('Error submitting payment confirmation:', error);
      alert('An error occurred while submitting payment confirmation.');
    } finally {
      // Set submitting state back to false
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Payment Confirmation Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            Document:
            <input type="file" accept="image/png, image/jpeg, application/pdf" onChange={(e) => setDoc(e.target.files?.[0] || null)} required />
          </label>
        </div>
        <button type="submit" disabled={submitting}>Submit</button>
      </form>
    </div>
  );
};

export default PaymentConfirmationForm;
