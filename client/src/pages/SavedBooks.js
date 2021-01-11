import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/react-hooks';
// import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { REMOVE_BOOK } from '../utils/mutations';
import { GET_ME } from '../utils/queries'

const SavedBooks = () => {

  const { queryLoading, queryError, queryData } = useQuery(GET_ME);
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  console.log(queryData);

  // const [ setQueryData] = useState({});

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    
    if (!token) {
      return false;
    }

    try {
      const { bookId } = await removeBook();
      // if (!response.ok) {
      //   throw new Error('something went wrong!');
      // }

      // const updatedUser = await response.json();
      // setQueryData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (queryLoading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {queryData.savedBooks.length
            ? `Viewing ${queryData.savedBooks.length} saved ${queryData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {queryData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                  {queryError && <div>view saved books failed</div>}
                  {error && <div>delete failed</div>}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
