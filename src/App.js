import logo from "./logo.svg";
import "./App.css";
import { ViewQuery } from "./odQueries";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { Input, Image, Card } from "antd";
import { useList } from "react-use";

const { Search } = Input;

function FiducialText({ fiducials }) {
  return (
    <div>
      {fiducials.map((fid) => {
        if (fid.symbol === fid.text) {
          return <span key={fid.text}>{fid.text}: </span>;
        }
        return (
          <div>
            <span>{fid.symbol}.&nbsp;</span>
            <span>{fid.text}</span>
          </div>
        );
      })}
    </div>
  );
}

function ViewQueryResults({ viewSearch, cursor, cursorStack }) {
  const vq = ViewQuery;

  const { loading, error, data } = useQuery(vq, {
    variables: {
      viewSearch,
      cursor: cursorStack[0][cursorStack[0].length - 1],
    },
  });
  if (loading) {
    return null;
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
            <Card style={{ marginBottom: "12px" }} className="viewcard">
              <div className="view">
                <div className="viewid"></div>
                <div className="section">
                  <span className="label">Section</span>
                  <span className="content">{node.section}</span>
                </div>
                <div className="title">
                  <span className="label">Title</span>
                  <span className="content">{node.title}</span>
                </div>
                <div className="subtitle">
                  <span className="content">{node.viewid}&nbsp;</span>
                  <span className="label">Subtitle</span>
                  <span className="content">{node.subtitle}</span>
                </div>
                <div className="description">
                  <span className="label">Description</span>
                  <span className="content">{node.description}</span>
                </div>
                <div className="photo">
                  <Image
                    preview={false}
                    src={node.viewimages_640_list.nodes[0].l}
                  ></Image>
                </div>
                <div className="diagram">
                  <Image
                    preview={false}
                    src={node.viewimages_640_list.nodes[0].d}
                  ></Image>
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
              onClick={(e) =>
                cursorStack[1].removeAt(cursorStack[0].length - 1)
              }
            >
              Previous
            </button>
          ) : null}
        </span>
        <span>
          {data.views.pageInfo.hasNextPage ? (
            <button
              onClick={(e) =>
                cursorStack[1].push(data.views.pageInfo.endCursor)
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

function App() {
  const [searchString, setSearchString] = useState("");
  const [cursor, setCursor] = useState("");
  const [hasPrevious, setHasPrevious] = useState(false);

  const cursorStack = useList([]);

  useEffect(() => {
    cursorStack[1].clear();
    setHasPrevious(false);
    setCursor("");
  }, [searchString]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [cursorStack[0]]);

  return (
    <div>
      <header>
        <h1>Bassett Collection of Human Anatomy</h1>
        <div className="license">
          Images courtesy Stanford Medical History Center.
          <br />
          Creative Commons Attribution-Noncommercial-Share Alike 3.0
          United States License.
        </div>
        <Search
          placeholder="Search..."
          size="large"
          onSearch={setSearchString}
          className="search"
        />
      </header>
      <ViewQueryResults
        viewSearch={searchString}
        cursor={cursor}
        cursorStack={cursorStack}
      />
    </div>
  );
}

export default App;
