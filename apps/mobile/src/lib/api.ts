import { createApiClient } from '@clinic/api-client';

export const api = createApiClient(process.env.EXPO_PUBLIC_API_URL!);