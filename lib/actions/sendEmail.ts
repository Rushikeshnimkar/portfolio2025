type EmailData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function sendEmail(data: EmailData) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'Failed to send email');
    }

    return responseData;
  } catch (error) {
    console.error('Error in sendEmail:', error);
    throw error;
  }
} 