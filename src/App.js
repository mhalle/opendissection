import "./App.css";
import { ViewQuery } from "./odQueries";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import Input from 'antd/es/input';
import Image from 'antd/es/image';
import Card from 'antd/es/card';
import Spin from 'antd/es/spin';
import Space from 'antd/es/space';
import { useList } from "react-use";
import { BrowserRouter as Router, Switch, useLocation, useParams, useHistory } from 'react-router-dom';
import { SimpleImg } from 'react-simple-img';

import {
  Magnifier, MOUSE_ACTIVATION, TOUCH_ACTIVATION} from "react-image-magnifiers";

const { Search } = Input;

function useQueryParams() {
  return new URLSearchParams(useLocation().search);
}

function FiducialText({ fiducials }) {
  return (
    <div>
      {fiducials.map((fid) => {
        if (fid.symbol === fid.text) {
          return <span key={fid.symbol + fid.text + fid.parent_text}>{fid.text}: </span>;
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

function ViewQueryResults({ viewSearch, cursorStack, section, setSection}) {


  const doNext = (cursor) => {
    cursorStack[1].push(cursor);
  }

  const doPrev = () => {
    if(cursorStack[0].length) {
      cursorStack[1].removeAt(cursorStack[0]                                                              .length - 1);
    }
  }

  const vq = ViewQuery;
  const [searchFilter, setSearchFilter] = useState('');

  const { loading, error, data } = useQuery(vq, {
    variables: {
      viewSearch,
      where: searchFilter,
      cursor: cursorStack[0][cursorStack[0].length - 1],
    },
  });
  if (loading) {
    return (
      <Space className="spinnerdiv">
      <Spin size="large" />
    </Space>
    )
  }
  if (error) {
    return <div>Error: failed to fetch</div>;
  }

  if (!data.views.nodes || data.views.nodes.length === 0) {
    return <div>No results</div>;
  }

  return (
    <div>
      <div className="total-count">{data.views.totalCount} matches</div>
      <div>
        {data.views.nodes.map((node) => {
          return (
            <Card key={node.id} style={{ marginBottom: "12px" }} className="viewcard">
              <div className="view">
                <div className="section">
                  <span className="content"><a>{node.section.name}</a></span> / <span className="content">{node.topic.name}</span>
                </div>
                <div className="title">
                  <span className="content">{node.label}&nbsp;</span>
                  <span className="content">{node.title}</span>
                </div>
                <div className="description">
                  <span className="content">{node.description}</span>
                </div>
                <div className="photo">
                <img  src={node.viewimages_640_list.nodes[0].l} />
                </div>
                <div className="diagram">
                <img  src={node.viewimages_640_list.nodes[0].d} />

              </div>
                <div className="labels">
                  <FiducialText fiducials={node.fiducials_list.nodes} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="pageControls">
        <span>
          {cursorStack[0].length ? (
            <button
              onClick={
                (e) => doPrev()
              }
            >
              Previous
            </button>
          ) : null}
        </span>
        <span>
          {data.views.pageInfo.hasNextPage ? (
            <button
              onClick = {
                (e) => doNext(data.views.pageInfo.endCursor)
              }
            >
              Next
            </button>
          ) : null}
        </span>
      </div>
    </div>
  );
}










function useStack(v) {
  const [list, listOps] = useList(v);

  const push = listOps.push;
  const peek = () => {
    return list[list.length - 1];
  }
  const pop = () => {
    const val = list[list.length - 1];
    listOps.removeAt(list.length-1);
    return val;
  }
  const clear = listOps.clear;
  return [list, {push, peek, pop, clear}];
}









function buildQueryString({ q, after }) {
  const params = new URLSearchParams();
  if(q) {
    params.set('q', q);
  }
  if(after){
    params.set('after', after);
  }
  return params.toString();
}








function App() {
  const history = useHistory();
  const location = useLocation();

  const [searchString, setSearchString] = useState("");
  const [searchText, setSearchText] = useState('');
  const [section, setSection] = useState('');
  const [cursorStackList, cursorStackOps] = useList([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchVal = searchParams.has('q') ? searchParams.get('q') : '';

    setSearchText(searchVal);
    setSearchString(searchVal);

    const after = searchParams.has('after') ? searchParams.get('after'): '';
    if(after) {
    }
  }, [location]);

  useEffect(() => {
    cursorStackOps.clear();
  }, [searchString, cursorStackOps]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [cursorStackList]);


  useEffect(() => {
    console.log('cursor stack list changed', cursorStackList);
  }, [cursorStackList]);

  const doSearch = (s) => {
    navigate({q: s});
  }

  const navigate = (params) => {
    const qs = buildQueryString(params);
    history.push(`/?${qs}`);
  }

  const searchChangeCallback = (e) => {
    setSearchText(e.target.value);
  }

  return (
    <>
      <div className="navBar">
        <a href="https://www.openanatomy.org"><img alt="Open Anatomy Logo"  className="oa" src="/images/favicons/favicon-96x96.png" /></a>
        <a className="oatext" href="https://www.openanatomy.org">Open Anatomy Project</a>
      </div>
      <header>
        <h1>Bassett Collection of Human Anatomy</h1>
        <Search
          placeholder="Search..."
          size="large"
          onChange={searchChangeCallback}
          onSearch={doSearch}
          className="search"
          value={searchText}
        />
      </header>
      <ViewQueryResults
        viewSearch={searchString}
        cursorStack={[cursorStackList, cursorStackOps]}
        navigate={navigate}
      />
      <footer>
        <hr />
      <div className="license">
          Images courtesy Stanford Medical History Center.
          <br />
          Creative Commons Attribution-Noncommercial-Share Alike 3.0
          United States License.
        </div>
        </footer>
    </>
  );
}

function RouterApp() {
  return <Router>
            <App />
          </Router>
}
export default RouterApp;
