import { pool } from '../config/db.js'


export const createPost = async (req, res, next) => {
  try {
    const { title, content, is_paid } = req.body

    // Auth check
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const authorId = req.user.id

    // Validation
    if (!title || !content) {
      return res.status(400).json({ message: 'title and content are required' })
    }

    const result = await pool.query(
      `INSERT INTO posts (title, content, is_paid, author_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, content, is_paid ?? false, authorId]
    )

    res.status(201).json({
      message: 'Post created successfully',
      post: result.rows[0],
    })
  } catch (err) {
    console.error('createPost error:', err.message)
    // Provide a clearer error to the client while avoiding full DB stack traces
    return res
      .status(500)
      .json({ message: `Error creating post: ${err.message}` })
  }
}

export const getAllPosts = async (req, res, next) => {
  try {
    const result = await pool.query(`
    SELECT id, title, content, is_paid, created_at
    FROM posts
    ORDER BY created_at DESC
  `)

    const user = req.user

    const posts = result.rows.map((post) => {
      const hasAccess =
        !post.is_paid ||
        (user && (user.role === 'admin' || user.subscription_status === 'paid' || user.subscription_status === 'premium'))

      if (!hasAccess && post.is_paid) {
        return {
          ...post,
          content: 'Contenu réservé aux abonnés payants',
        }
      }
      return post
    })

    res.status(200).json({ posts })
  } catch (err) {
    console.error('getAllPosts error:', err)
    next(err) // Pass to global handler, but wait, global handler hides message.
    // Let's send it directly for debugging:
    res.status(500).json({ message: `Debug Error: ${err.message}` })
  }
}

export const getPostById = async (req, res) => {
  const postId = req.params.id

  const result = await pool.query('SELECT * FROM posts WHERE id = $1', [postId])

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Post not found' })
  }

  const post = result.rows[0]

  // logique d'accès MVP
  const user = req.user
  const hasAccess =
    !post.is_paid ||
    (user && (user.role === 'admin' || user.subscription_status === 'paid' || user.subscription_status === 'premium'))

  if (post.is_paid && !hasAccess) {
    return res.status(403).json({
      message: 'Contenu réservé aux abonnés payants',
    })
  }

  res.status(200).json({ post })
}

export const updatePost = async (req, res) => {
  const { id } = req.params
  const { title, content, is_paid } = req.body
  const userId = req.user.id
  const userRole = req.user.role

  try {
    const checkQuery = 'SELECT author_id FROM posts WHERE id = $1'
    const checkResult = await pool.query(checkQuery, [id])

    if (checkResult.rowCount === 0) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const post = checkResult.rows[0]

    if (post.author_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const updateQuery = `
      UPDATE posts 
      SET title = COALESCE($1, title), 
          content = COALESCE($2, content), 
          is_paid = COALESCE($3, is_paid)
      WHERE id = $4
      RETURNING *
    `
    const result = await pool.query(updateQuery, [title, content, is_paid, id])

    res.json({ message: 'Post updated', post: result.rows[0] })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const deletePost = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id
  const userRole = req.user.role

  try {
    const checkResult = await pool.query('SELECT author_id FROM posts WHERE id = $1', [id])

    if (checkResult.rowCount === 0) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const post = checkResult.rows[0]

    if (post.author_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await pool.query('DELETE FROM posts WHERE id = $1', [id])

    res.json({ message: 'Post deleted' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}
