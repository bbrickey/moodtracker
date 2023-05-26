/**
 * Mood Tracker App
 * Author: Ben Brickey
 * May 2023
 * Results component - displays database summary results to user
 */

import React from "react";
import Result from "./Result";
import "./styles.css";

export default function Results({
  feelBest,
  feelWorst,
  performBest,
  performWorst,
}) {
  return (
    <div>
      <h1 className="resultHeader">Your Results</h1>
      <div className="testResults">
        <div>
          <div className="resultItem">
            <h3 className="resultItemHeader">Best Mood</h3>
            <Result type={feelBest}></Result>
          </div>
          <div className="resultItem">
            <h3 className="resultItemHeader">Worst Mood</h3>
            <Result type={feelWorst}></Result>
          </div>
        </div>
        <div>
          <div className="resultItem">
            <h3 className="resultItemHeader">Best Performance</h3>
            <Result type={performBest}></Result>
          </div>
          <div className="resultItem">
            <h3 className="resultItemHeader">Worst Performance</h3>
            <Result type={performWorst}></Result>
          </div>
        </div>
      </div>
    </div>
  );
}
