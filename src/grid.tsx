import * as React from "react";

type Props = {
  columns: number;
  children: Array<JSX.Element>;
};

export const Grid = (props: Props) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
        gridAutoRows: "minmax(100px, auto)",
        height: "99vh",
        width: "100vw",
      }}
    >
      {props.children.map((child, i) => {
        return (
          <div key={i} style={gridPosition({ columns: props.columns, i })}>
            {child}
          </div>
        );
      })}
    </div>
  );
};

export const gridPosition = ({
  columns,
  i,
}: {
  columns: number;
  i: number;
}): { gridColumn: number; gridRow: number } => ({
  gridColumn: (i % columns) + 1,
  gridRow: Math.floor(i / columns) + 1,
});
