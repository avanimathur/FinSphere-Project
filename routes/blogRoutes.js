const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");

// CREATE BLOG
router.post("/", async (req, res) => {
  try {
    const { title, content, category, summary, author } = req.body;

    const slug = title.toLowerCase().replace(/ /g, "-");

    const readTime = Math.ceil(content.split(" ").length / 200);

    const blog = new Blog({
      title,
      slug,
      content,
      summary,
      category,
      readTime,
      author,
    });

    await blog.save();

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL BLOGS
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE BLOG
router.get("/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE BLOG (optional)
router.delete("/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ msg: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
