import "./App.css";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import {
  ViewSearchQuery,
  AllViewIds,
  ViewRecordsQuery,
  ViewIdsInTopic,
  ViewIdsInSection,
} from "./odQueries";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import Input from "antd/es/input";
import Card from "antd/es/card";
import Button from "antd/es/button";
import Pagination from "antd/es/pagination";
import Spin from "antd/es/spin";
import Space from "antd/es/space";
import InnerImageZoom from "react-inner-image-zoom";
import * as ReactGA from "react-ga-donottrack";

import {
  BrowserRouter as Router,
  useLocation,
  useHistory,
  Route,
  Switch,
  useParams,
} from "react-router-dom";

const { Search } = Input;

function quoteIfViewId(v) {
  return v.match(/^\d?\d?[\dA]-\d/) ? `"${v}"` : v;
}

function FiducialText({ fiducials }) {
  return (
    <div>
      {fiducials.map((fid) => {
        if (fid.symbol === fid.text) {
          return (
            <span key={fid.symbol + fid.text + fid.parent_text}>
              {fid.text}:{" "}
            </span>
          );
        }
        return (
          <div key={fid.symbol + fid.text + fid.parent_text}>
            <span key="symbol">{fid.symbol}.&nbsp;</span>
            <span key="text">{fid.text}</span>
          </div>
        );
      })}
    </div>
  );
}

function ViewQueryResults({
  viewIds,
  changeSection,
  changeTopic,
  pageSize,
  skip,
}) {
  const [views, setViews] = useState([]);

  const { loading, error, data } = useQuery(ViewRecordsQuery, {
    skip: skip,
    variables: {
      ids: viewIds,
      pageSize,
    },
  });

  useEffect(() => {
    if (data && data.views && data.views.nodes) {
      const d = {};
      for(let n of data.views.nodes) {
        d[n.id] = n;
      }
      setViews(viewIds.map(x => d[x]));
    }
  }, [data, viewIds]);

  if (skip || loading) {
    return (
      <Space className="spinnerdiv">
        <Spin size="large" />
      </Space>
    );
  }
  if (error) {
    return <div>Error: failed to fetch</div>;
  }

  if (!views || views.length === 0) {
    return <div>No results</div>;
  }

  return (
    <div>
      {views.map((node) => {
        return (
          <Card
            key={node.id}
            style={{ marginBottom: "12px" }}
            className="viewcard"
          >
            <div className="view">
              <div className="section">
                <span className="content">
                  <Button
                    type="link"
                    onClick={() => changeSection(node.section.id)}
                  >
                    {node.section.name}
                  </Button>
                </span>{" "}
                /{" "}
                <span className="content">
                  <Button
                    type="link"
                    onClick={() => changeTopic(node.topic.id)}
                  >
                    {node.topic.name}
                  </Button>
                </span>
              </div>
              <div className="title">
                <span className="content">{node.label}&nbsp;</span>
                <span className="content">{node.title}</span>
              </div>
              <div className="description">
                <span className="content">{node.description}</span>
              </div>
              <div className="larger-photo"><a href={node.viewimages_h_1536_list.nodes[0].l} 
                  rel="noreferrer" target="_blank">larger</a></div>
              <div className="larger-diagram"><a href={node.viewimages_h_1536_list.nodes[0].d}  
                  rel="noreferrer" target="_blank">larger</a></div>

              <div className="photo">
                <InnerImageZoom
                  src={node.viewimages_h_512_list.nodes[0].l}
                  zoomSrc={node.viewimages_h_1024_list.nodes[0].l}
                  fullscreenOnMobile={true}
                />
              </div>
              <div className="diagram">
                <InnerImageZoom
                  src={node.viewimages_h_512_list.nodes[0].d}
                  zoomSrc={node.viewimages_h_1024_list.nodes[0].d}
                  fullscreenOnMobile={true}
                />
              </div>
              <div className="labels">
                <FiducialText fiducials={node.fiducials_list.nodes} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function buildQueryString({ q, s, t, pg }) {
  const params = new URLSearchParams();
  if (q) {
    params.set("q", q);
  }
  if (s) {
    params.set("s", s);
  }
  if (t) {
    params.set("t", t);
  }
  if (pg) {
    params.set("pg", pg);
  }
  return params.toString();
}

function viewsReducer(data) {
  if (data?.views?.nodes) {
    return data?.views?.nodes?.map((x) => x.id);
  }
  return [];
}
function viewsSearchReducer(data) {
  if (data?.views_search?.nodes) {
    return data?.views_search?.nodes?.map((x) => x.id);
  }
  return [];
}

function SearcherId({ setViewIds, setLoading }) {
  const pathParams = useParams();

  useEffect(() => {
    setViewIds(pathParams.idList.split(","));
    setLoading(false);
  }, [pathParams.idList, setViewIds, setLoading]);

  return null;
}

function Searcher({ setViewIds, sortByViewId, setLoading, setError }) {
  const pathParams = useParams();
  const queryParams = useQueryParams();

  let query, variables, reducer;
  const op = pathParams?.op;
  if (op === "section") {
    query = ViewIdsInSection;
    variables = { section_id: parseInt(pathParams.id) };
    reducer = viewsReducer;
  } else if (op === "topic") {
    query = ViewIdsInTopic;
    variables = { topic_id: pathParams.id };
    reducer = viewsReducer;
  } else if (op === "id") {
    // SKIP HERE
  } else if (queryParams && queryParams.has("q")) {
    const search = queryParams.get("q");
    query = ViewSearchQuery;
    variables = { search: search ? quoteIfViewId(search) : "QZQ" };
    reducer = viewsSearchReducer;
  } else {
    query = AllViewIds;
    variables = {};
    reducer = viewsReducer;
  }

  const { loading, error, data } = useQuery(query, { variables });
  useEffect(() => {
    if (setLoading) {
      setLoading(loading);
    }
  }, [setLoading, loading]);

  useEffect(() => {
    if (setError) {
      setError(error);
    }
  }, [setError, error]);

  if (error) {
    console.log("error", error);
  }

  useEffect(() => {
    if (data) {
      const viewIds = reducer(data);
      if (sortByViewId) {
        viewIds.sort();
      }
      setViewIds(viewIds);
    }
  }, [data, sortByViewId, setViewIds, reducer]);
  return null;
}

function breakIntoPages(arr, pageSize) {
  let ret = [];
  for (let i = 0; i < arr.length; i += pageSize) {
    ret.push(arr.slice(i, i + pageSize));
  }
  return ret;
}

function useQueryParams() {
  const [qp, setQp] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location) {
      setQp(new URLSearchParams(location.search));
    }
  }, [location]);

  return qp;
}

function useCurrentPage() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (location) {
      const params = new URLSearchParams(location.search);
      setCurrentPage(params.has("pg") ? parseInt(params.get("pg")) : 1);
    }
  }, [location, setCurrentPage]);

  return currentPage;
}

function setPage(history, n) {
  const location = history.location;
  const params = new URLSearchParams(location.search);
  if (n === 1) {
    params.delete("pg");
  } else {
    params.set("pg", n);
  }
  history.push({ ...location, search: params.toString() });
}

function App() {
  const history = useHistory();
  const [searchText, setSearchText] = useState("");
  const [viewIds, setViewIds] = useState([]);
  const [sortByViewId, setSortByViewId] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState(null);
  // const [currentPage, setCurrentPage] = useState(0);
  const [skip, setSkip] = useState(true);
  const currentPage = useCurrentPage();
  const location = useLocation();
  const queryParams = useQueryParams();

  useEffect(() => {
    // console.log("error here", error);
  }, [error]);

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  useEffect(() => {
    if (queryParams && queryParams.has("q")) {
      setSearchText(queryParams.get("q"));
    }
  }, [queryParams]);

  const doSearch = (s) => {
    navigate({ q: s });
  };

  const changeSection = (s) => {
    navigate({}, ["section", s]);
  };

  const changeTopic = (t) => {
    navigate({}, ["topic", t]);
  };

  const navigate = (params, oi = null) => {
    const path = oi !== null ? `/${oi[0]}/${oi[1]}` : "";
    const qs = buildQueryString(params);
    history.push(`${path}/?${qs}`);
    window.scrollTo(0, 0);
  };

  const searchChangeCallback = (e) => {
    setSearchText(e.target.value);
  };

  const paginatedViewIds = breakIntoPages(viewIds, pageSize);
  const currentPageViewIds = paginatedViewIds.length
    ? paginatedViewIds[currentPage - 1]
    : [];

  return (
    <>
      <Switch>
        <Route path="/ids/:idList">
          <SearcherId
            setViewIds={setViewIds}
            setLoading={setSkip}
            sortByViewId={sortByViewId}
          />
        </Route>
        <Route path="/:op(section|topic)/:id">
          <Searcher
            setViewIds={setViewIds}
            sortByViewId={sortByViewId}
            setLoading={setSkip}
            setError={setError}
          />
        </Route>
        <Route path="/">
          <Searcher
            setViewIds={setViewIds}
            sortByViewId={sortByViewId}
            setLoading={setSkip}
            setError={setError}
          />
        </Route>
      </Switch>
      <div className="navBar">
        <a href="https://www.openanatomy.org">
          <img
            alt="Open Anatomy Logo"
            className="oa"
            src="/images/favicons/favicon-96x96.png"
          />
        </a>
        <a className="oatext" href="https://www.openanatomy.org">
          Open Anatomy Project
        </a>
      </div>
      <header>
        <h1>Bassett Collection of Human Anatomy</h1>
        <div>
          <Search
            placeholder="Search..."
            size="large"
            onChange={searchChangeCallback}
            onSearch={doSearch}
            className="search"
            value={searchText}
          />
          {!skip ? <div className="search-count">
            {viewIds.length} Match{viewIds.length === 1 ? "" : "es"}
          </div> : ''}
        </div>
      </header>
      <div>{error}</div>
      <ViewQueryResults
        viewIds={currentPageViewIds}
        changeSection={changeSection}
        changeTopic={changeTopic}
        pageSize={pageSize}
        skip={skip}
      />
      <div className="pageControls">
        <Pagination
          showLessItems={false}
          current={currentPage}
          pageSize={pageSize}
          onChange={(x) => setPage(history, x)}
          total={viewIds.length}
          showSizeChanger={false}
          hideOnSinglePage={true}
        />
      </div>
      <footer>
        <hr />
        <div className="license">
          <div>
            This viewer developed by the{" "}
            <a href="https://www.openanatomy.org">Open Anatomy Project</a>. For
            more information, please contact{" "}
            <a href="mailto:info@openanatomy.org">info@openanatomy.org</a>.
          </div>
          <div>
            Images courtesy{" "}
            <a href="https://lane.stanford.edu/med-history/">
              Stanford Medical History Center
            </a>
            , under a Creative Commons Attribution-Noncommercial-Share Alike 3.0
            United States License.
          </div>
        </div>
      </footer>
    </>
  );
}

function RouterApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
export default RouterApp;
