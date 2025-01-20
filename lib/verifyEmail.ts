interface VerificationResponse {
  isValid: boolean;
  error?: string;
}

export async function verifyEmail(email: string): Promise<VerificationResponse> {
  try {
    const response = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.NEXT_PUBLIC_ABSTRACT_API_KEY}&email=${email}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    
    // Check if the email is valid based on Abstract API response
    const isValid = data.is_valid_format.value && 
                   data.deliverability === "DELIVERABLE" && 
                   !data.is_disposable_email.value;

    return {
      isValid,
      error: isValid ? undefined : "Please enter a valid email address"
    };
  } catch (error) {
    console.error('Email verification error:', error);
    return {
      isValid: false,
      error: "Unable to verify email at this time"
    };
  }
}