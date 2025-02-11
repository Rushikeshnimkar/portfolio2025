interface VerificationResponse {
  isValid: boolean;
  error?: string;
}

export async function verifyEmail(email: string): Promise<VerificationResponse> {
  try {
    // Basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        error: "Invalid email address"
      };
    }

    const response = await fetch('/api/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Email verification error:', error);
    return {
      isValid: false,
      error: "Invalid email address"
    };
  }
}