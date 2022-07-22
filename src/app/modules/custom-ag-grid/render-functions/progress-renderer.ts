import {ICellRendererParams} from 'ag-grid-community';


// tslint:disable-next-line: no-unused-expression
export const ProgressCellRenderer = (props: ICellRendererParams) => {
    const progress = 50;
    return (
      `<div>
        <div
          style={{
            position: "absolute",
            width: progress * 100 + "%",
            height: "100%",
            backgroundColor: "rgba(130,210,73,${progress})"
          }}
        />
        <div style={{ position: "absolute" }}>{(progress * 100).toFixed(2)}%</div>
      </div>`
    );
  }
