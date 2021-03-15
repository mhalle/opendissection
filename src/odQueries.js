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
  query ViewRecords($ids: [String], $cursor: String, $pageSize: Int = 10) {
    views(first: $pageSize, after: $cursor, filter: { viewid: { in: $ids } }) {
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
        viewimages_h_256_list {
          nodes {
            l
            d
          }
        }
        viewimages_h_512_list {
          nodes {
            l
            d
            t
          }
        }
        viewimages_h_1024_list {
          nodes {
            l
            d
          }
        }
        viewimages_h_1536_list {
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
    views_search(first: 1650, sort: rank, filter: { fts: { eq: $search } }) {
      totalCount
      nodes {
        id: viewid
      }
    }
  }
`;

export const ViewIdsInSection = gql`
query ViewIdsInSection($section_id: Int, $count: Int=1650) {
  views(first: $count, filter: {section: {eq: $section_id}}) {
    totalCount
    nodes {
      id: viewid
    }
  }
}`

export const ViewIdsInTopic = gql`
query ViewIdsInTopic($topic_id: Int, $count: Int=1650) {
  views(first:$count, filter: {topic: {eq: $topic_id}}) {
    totalCount
    nodes {
      id: viewid
    }
  }
}`;

export const AllViewIds = gql`
query AllViewIds($count: Int = 1650) {
  views(first:$count) {
    totalCount
    nodes {
      id: viewid
    }
  }
}`;

window.ViewFragment = ViewFragment;
