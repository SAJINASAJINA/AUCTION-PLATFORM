export const sendEmail = async ({ email, subject, message }) => {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Auction Platform <onboarding@resend.dev>",
        to: [email],
        subject: subject,
        text: message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("RESEND EMAIL ERROR:", data);
      throw new Error(data.message || "Failed to send email.");
    }

    console.log("EMAIL SENT SUCCESSFULLY:", data);
  } catch (error) {
    console.error("EMAIL SENDING FAILED:", error.message);
    throw error;
  }
};
