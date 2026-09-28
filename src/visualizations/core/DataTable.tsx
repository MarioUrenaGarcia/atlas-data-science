import { strings } from '../../app/strings.ts';
import styles from './VizFrame.module.css';

export interface DataTableData {
  caption: string;
  columns: readonly string[];
  rows: readonly (readonly (string | number)[])[];
}

/** Tabular alternative to the chart for screen readers and precise reading. */
export function DataTable({ data }: { data: DataTableData }) {
  return (
    <details className={styles.dataTable}>
      <summary>{strings.viz.dataTable}</summary>
      <div className={styles.tableScroll} role="region" aria-label={data.caption} tabIndex={0}>
        <table>
          <caption className="visually-hidden">{data.caption}</caption>
          <thead>
            <tr>
              {data.columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className={typeof cell === 'number' ? 'mono' : undefined}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
