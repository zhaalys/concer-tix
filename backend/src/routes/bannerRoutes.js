const express = require("express");
const router = express.Router();
const supabase = require("../lib/supabase");

const BANNER_SELECT =
  "id, title, message, type, link, image_url, placement, object_fit, banner_height, created_at, updated_at";

router.get("/", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select(BANNER_SELECT)
      .eq("is_active", true)
      .in("placement", ["hero", "banner"])
      .not("image_url", "is", null)
      .order("created_at", { ascending: true });

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
