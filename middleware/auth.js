export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'You must be logged in' });
}

export function isOwnerOrAdmin(getOwnerId) {
  return async (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'You must be logged in' });

    const ownerId = await getOwnerId(req);
    if (user.role === 'admin' || (ownerId && ownerId.toString() === user._id.toString())) {
      return next();
    }

    return res.status(403).json({ error: 'Forbidden' });
  };
}

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Admin access required' });
};