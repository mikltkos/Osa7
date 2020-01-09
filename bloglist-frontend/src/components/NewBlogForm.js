import React from 'react'
import propTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'

const NewBlogForm = ({ handleAddBlog, title, author, url }) => {

  const titleInput = { 'type': title.type, 'value': title.value, 'onChange': title.onChange }
  const authorInput = { 'type': author.type, 'value': author.value, 'onChange': author.onChange }
  const urlInput = { 'type': url.type, 'value': url.value, 'onChange': url.onChange }

  return (
    <div>
      <h3>Create new</h3>
      <Form onSubmit={handleAddBlog}>
        <Form.Group>
          <Form.Label>title</Form.Label>
          <Form.Control id='title' {...titleInput} />
          <Form.Label>author</Form.Label>
          <Form.Control id='author' {...authorInput} />
          <Form.Label>url</Form.Label>
          <Form.Control id='url' {...urlInput} />
          <Button type="submit">create</Button>
        </Form.Group>
      </Form>
    </div>
  )
}

NewBlogForm.propTypes = {
  handleAddBlog: propTypes.func.isRequired,
  title: propTypes.object.isRequired,
  author: propTypes.object.isRequired,
  url: propTypes.object.isRequired
}

export default NewBlogForm