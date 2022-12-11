export type TagGroupRepresentation = {
  id: string;
  name: string;
};

export type NewTagGroupPayload = {
  name: string;
  accountId: string;
};

export type TagRepresentation = {
  id: string;
  tagGroupId: string;
  name: string;
};

export type NewTagPayload = {
  name: string;
  accountId: string;
  tagGroupId: string;
}

export type TransactionTags = {
  tagId: string;
}
