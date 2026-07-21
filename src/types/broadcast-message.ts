import type { AnyMessageContent } from "@whiskeysockets/baileys";

export type BroadcastMessageType =
  | "text"
  | "image"
  | "video"
  | "document"
  | "audio"
  | "sticker";

export interface BroadcastMessage {
  type: BroadcastMessageType;
  content: AnyMessageContent;
}
