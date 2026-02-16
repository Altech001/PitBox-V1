const BASE_URL = 'https://mintospay.vercel.app/v1/pay';

export interface PaymentInitializeData {
  amount: number;
  callback_url: string;
  country: string;
  description: string;
  phone_number: string;
  reference: string;
}

export interface PaymentResponse {
  status: string;
  message?: string;
  data: {
    transaction: {
      uuid: string;
      reference: string;
      status: 'processing' | 'completed' | 'failed' | 'success';
      provider_reference: string | null;
    };
    collection: {
      amount: {
        formatted: string;
        raw: string;
        currency: string;
      };
      provider: string;
      phone_number: string;
      mode?: string;
      description?: string;
    };
    timeline: {
      initiated_at?: string;
      created_at?: string;
      updated_at?: string;
      estimated_settlement?: string;
    };
    metadata: {
      response_timestamp: string;
      sandbox_mode?: boolean;
    };
  };
}

export const paymentApi = {
  initialize: async (data: PaymentInitializeData): Promise<PaymentResponse> => {
    const response = await fetch(`${BASE_URL}/initialize`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to initialize payment: ${response.status}`);
    }

    return response.json();
  },

  verify: async (uuid: string): Promise<PaymentResponse> => {
    const response = await fetch(`${BASE_URL}/verify/${uuid}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to verify payment: ${response.status}`);
    }

    return response.json();
  },
};
