import type { GroupMetadata } from "@whiskeysockets/baileys";

const groups = new Map<string, GroupMetadata>();

export function setGroups(data: Record<string, GroupMetadata>): void {
  groups.clear();

  for (const [id, metadata] of Object.entries(data)) {
    groups.set(id, metadata);
  }
}

export function getGroups(): GroupMetadata[] {
  return [...groups.values()];
}

export function getGroup(id: string): GroupMetadata | undefined {
  return groups.get(id);
}

export function isAnnouncementGroup(id: string): boolean {
  const group = groups.get(id);

  return group?.isCommunityAnnounce === true;
}

export function getChildGroups(parentId: string): GroupMetadata[] {
  return getGroups().filter(
    (group) =>
      group.linkedParent === parentId &&
      !group.isCommunityAnnounce &&
      !group.announce,
  );
}

export function getGroupCount(): number {
  return groups.size;
}
