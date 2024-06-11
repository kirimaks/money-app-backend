export type TagGroupRepresentation = {
  id: string;
  name: string;
  iconName: string;
  tags: Tag[];
};

export type NewTagGroupPayload = {
  name: string;
  accountId: string;
  iconName?: string;
};

export type TagRepresentation = {
  id: string;
  tagGroupId: string;
  name: string;
  iconName: string;
};

export type NewTagPayload = {
  name: string;
  accountId: string;
  tagGroupId: string;
  iconName?: string;
};

export type TransactionTags = {
  tagId: string;
  tag: {
    id: string;
    name: string;
    tagGroupId: string;
    iconName: string;
  };
};

export type AccountTags = {
  id: string; // TODO
};

export type TagGroup = {
  groupName: string;
  iconName: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  name: string;
  tagGroupId: string;
  iconName: string;
};

export type NewTag = {
  name: string;
  iconName: string;
};

export type DefaultTagGroup = {
  groupName: string;
  iconName: string;
  tags: {
    name: string;
    iconName: string;
  }[];
};

export type DeleteTagGroupResponse = {
  status: string;
};

export type DeleteTagResponse = {
  status: string;
};
