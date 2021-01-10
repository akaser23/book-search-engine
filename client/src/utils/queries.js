import gql from 'graphql-tag';

export const GET_ME = gql`
{
    GET_ME {
        _id
        username
        email
        savedBooks {
            authors
            description
            bookId
            image
            link
            title
        }
    }
}
`;