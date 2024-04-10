import React, { useEffect, useRef, useState } from "react";
import { Page, Text, Document } from "@react-pdf/renderer";
import style from "../style.module.css";
import { PDFExport } from "@progress/kendo-react-pdf";

const A = () => {
  const [rows, setRows] = useState([
    { id: 1, item: "Xyz", quantity: 2, unit: "kg", rate: 10 },
  ]);
  const pdfCompo = useRef();
  const [billDateTime, setBillDateTime] = useState("");
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    // Calculate grand total whenever rows change
    setGrandTotal(calculateGrandTotal());
  }, [rows]);

  useEffect(() => {
    // Update current date and time every second
    const intervalId = setInterval(() => {
      const now = new Date();
      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true, // Enable 12-hour format
      };
      const dateTime = now.toLocaleString(undefined, options);
      setBillDateTime(dateTime);
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const addRow = () => {
    const newRow = {
      id: rows.length + 1,
      item: "",
      quantity: 0,
      unit: "kg",
      rate: 0,
    };
    setRows([...rows, newRow]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const calculateTotal = (row) => {
    if (row.unit === "kg") {
      return row.quantity * row.rate;
    } else if (row.unit === "g") {
      return (row.quantity / 1000) * row.rate;
    }
  };

  const calculateGrandTotal = () => {
    let total = 0;
    rows.forEach((row) => {
      total += calculateTotal(row);
    });
    return total;
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior of Enter key
      addRow();
    }
  };

  const print = () => {
    pdfCompo.current.save();
  };

  return (
    <div className={style.abc}>
      <PDFExport ref={pdfCompo} paperSize="A4" landscape={true}>
        <Document>
          <Page>
            <div>
              <h2
                style={{
                  width: "100%",
                  textAlign: "center",
                }}
              >
                LKS
              </h2>
            </div>
            <br />

            <h4 style={{ position: "absolute", top: 10, right: 10 }}>
              {billDateTime}
            </h4>
            <table border={2}>
              <thead>
                <tr>
                  <th>S.no.</th>
                  <th>Items</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Rate per kg</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>
                      <input
                        type="text"
                        value={row.item}
                        onChange={(e) =>
                          handleInputChange(index, "item", e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, index)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.quantity}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "quantity",
                            parseInt(e.target.value)
                          )
                        }
                        onKeyDown={(e) => handleKeyDown(e, index)}
                      />
                    </td>
                    <td>
                      <select
                        value={row.unit}
                        onChange={(e) =>
                          handleInputChange(index, "unit", e.target.value)
                        }
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.rate}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "rate",
                            parseInt(e.target.value)
                          )
                        }
                        onKeyDown={(e) => handleKeyDown(e, index)}
                      />
                    </td>
                    <td>{calculateTotal(row)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5" align="right">
                    Grand Total:
                  </td>
                  <td>{grandTotal}</td>
                </tr>
              </tfoot>
            </table>
            <Text
              className={style.bottom}
              render={({ pageNumber, totalPage }) =>
                `${pageNumber} / ${totalPage}`
              }
            />
          </Page>
        </Document>
      </PDFExport>
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
        <button className="btn" onClick={print}>
          Download
        </button>
        <button className="btn" onClick={addRow}>
          Add Row
        </button>
      </div>
      <div tabIndex={0} onKeyDown={handleKeyDown}></div>
    </div>
  );
};

export default A;
