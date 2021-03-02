import { gql } from '@apollo/client';
  
  
  export const ViewQuery = gql`
    
      query View($viewSearch: String, $cursor: String) {
      views(search: $viewSearch, first: 15, after: $cursor) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          viewid 
          section
          title
          subtitle
          description
          fiducials_list(first: 100) {
            nodes {
              symbol
              text
              parent_text
            }
          }
          viewimages_160_list {
            nodes {
              l
              d
            }
          }
          viewimages_640_list {
            nodes {
              l
              d
              t
            }
          }  
          viewimages_1280_list {
            nodes {
              l
              d
            }
          }  
        }
      }
    }    
`

export const FiducialsQuery = gql`
query Fiducials($fiducialSearch: String!) {
  fiducials(search: $fiducialSearch, first: 100) {
    totalCount
    pageInfo {
      endCursor
      hasNextPage
    }
    nodes {
      viewid {
        viewid
      }
      symbol
      text
      parent_text
    }
  }
}
`
