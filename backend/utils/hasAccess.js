const hasAcces = (userId,doc) =>
{
    const isOwner = doc.owner.toString() === userId;
    const isCollaborator = doc.collaborators.map(id => id.toString()).includes(userId);

    return isOwner || isCollaborator;
}

module.exports = hasAcces;