import { Router } from "express";
import { getGroup, getGroups } from "../cache/groups.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(getGroups());
});

router.get("/:id", (req, res) => {
  const group = getGroup(req.params.id);

  if (!group) {
    res.status(404).json({
      message: "Group not found",
    });

    return;
  }

  res.json(group);
});

export default router;
