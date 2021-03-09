import { gql } from "@apollo/client";

export const ViewQuery = gql`
  query View($search: String, $cursor: String) {
    views(search: $search, first: 15, after: $cursor) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id: viewid
        label
        section {
          id
          name
        }
        topic {
          id
          name
        }
        title
        description
        fiducials_list(first: 200) {
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
`;

export const ViewFragment = gql`
    fragment viewContent on views {
        id
        label
        section {
          id
          name
        }
        topic {
          id
          name
        }
        title
        description
        fiducials_list(first: 200) {
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
`;

export const ViewRecordsQuery = gql`
  query ViewRecords($ids: [String]) {
    views(sort: $sort, first: 15, filter: { viewid: { in: $ids } }) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        viewid
        label
        section {
          id
          name
        }
        topic {
          id
          name
        }
        title
        description
        fiducials_list(first: 200) {
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
`;

export const FiducialsQuery = gql`
  query Fiducials($fiducialSearch: String) {
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
`;
export const ViewSearchQuery = gql`
  query ViewSearch($search: String) {
    views_search(first: 500, sort: rank, filter: { fts: { eq: $search } }) {
      totalCount
      nodes {
        viewid
      }
    }
  }
`;

window.ViewFragment = ViewFragment;
