
import { UserProfile } from "@/types/auth";

export type ProfileUpdateData = Partial<UserProfile>;

export interface InviteUserResult {
  success: boolean;
  error?: any;
}

export interface ProfileActionResult {
  success: boolean;
  error?: any;
  url?: string;
}
