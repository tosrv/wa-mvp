import type { GroupMetadata, WAMessage } from "@whiskeysockets/baileys";
import { getSocket } from "../whatsapp.js";

export async function broadcast(targets: GroupMetadata[], message: WAMessage) {
  const socket = getSocket();

  for (const group of targets) {
    await socket.sendMessage(group.id, {
      forward: message,
    });
  }
}
