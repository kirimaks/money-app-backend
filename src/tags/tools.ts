import type { GetTagByNameOrCreate, GetTagGroupByNameOrCreate } from './tags.types';


const getTagGroupByNameOrCreate:GetTagGroupByNameOrCreate = async ({ prisma, accountId, tagGroupName }) => {
  const tagGroup = await prisma.tagGroup.findFirst({
    where: {
      name: tagGroupName,
      accountId: accountId
    }
  });

  if (tagGroup) {
    return tagGroup;
  }

  return await prisma.tagGroup.create({
    data: {
      name: tagGroupName,
      accountId: accountId
    }
  });
};


const getTagByNameOrCreate:GetTagByNameOrCreate = async ({ prisma, accountId, tagName }) => {
  console.log(`Getting tag: ${tagName}`);

  const tag = await prisma.tag.findFirst({
    where: {
      name: tagName,
      accountId: accountId
    }
  });

  console.log(tag);

  if (tag) {
    return tag;
  }

  const tagGroup = await getTagGroupByNameOrCreate({ 
    prisma, accountId, tagGroupName: 'unsorted' 
  });

  const newTag = await prisma.tag.create({
    data: {
      name: tagName,
      accountId: accountId,
      tagGroupId: tagGroup.id,
    }
  });

  return newTag;
};

export { getTagByNameOrCreate };
