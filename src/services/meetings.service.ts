import { mockDelay, USE_MOCKS, request } from "./api-client";
import { mockMeetings, type MockMeeting } from "@/lib/mock/data";

export type Meeting = MockMeeting;

export const meetingsService = {
  async list(): Promise<Meeting[]> {
    if (USE_MOCKS) {
      await mockDelay();
      return mockMeetings;
    }
    return request<Meeting[]>("/api/meetings");
  },
  async get(id: string): Promise<Meeting | null> {
    if (USE_MOCKS) {
      await mockDelay();
      return mockMeetings.find((m) => m.id === id) ?? null;
    }
    return request<Meeting | null>(`/api/meetings/${id}`);
  },
  async schedule(input: Partial<Meeting>): Promise<Meeting> {
    if (USE_MOCKS) {
      await mockDelay(200, 500);
      return { ...mockMeetings[0], ...input, id: `m-${Date.now()}` } as Meeting;
    }
    return request<Meeting>("/api/meetings", { method: "POST", body: JSON.stringify(input) });
  },
};
