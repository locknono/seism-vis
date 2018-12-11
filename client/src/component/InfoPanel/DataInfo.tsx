import * as React from "react";

class DataInfo extends React.Component {
  render() {
    return (
      <div className="panel panel-info sub-infopanel">
        <div className="panel-heading info-panel-heading">Loading Data</div>
        <div className="sub-panel-body">
          Well-logging data{" "}
          <button
            type="button"
            className="btn btn-default dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            style={{ margin: `5px`, padding: `5px` }}
          >
            Dataset1 <span className="caret" />
          </button>
          <br />
          Seismic data
          <button
            type="button"
            className="btn btn-default dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            style={{
              margin: `5px`,
              padding: `5px`,
              position: `relative`,
              left: `32px`
            }}
          >
            Dataset2 <span className="caret" />
          </button>
        </div>
      </div>
    );
  }
}

export default DataInfo;
