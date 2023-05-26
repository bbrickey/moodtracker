/**
 * Mood Tracker App
 * Author: Ben Brickey
 * May 2023
 * Individual Result component - displays individual result metrics
 */

import React from "react";

function round(value, decimals) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

export default function Result({ type }) {
  //format raw data for display
  let sleepNum = 0,
    alcoholNum = 0,
    coffeeNum = 0;
  let exerciseResult = "❌";
  let vitaminResult = "❌";

  //if (!isNaN(parseInt(type.sleep))) {sleepNum = parseInt(type.sleep).toFixed(1);}
  sleepNum = round(type.sleep, 2);
  /*if (!isNaN(parseInt(type.alocohol))) {alcoholNum = parseInt(type.alcohol).toFixed(1);}*/
  //alcoholNum = parseInt(type.alcohol).toFixed(1);
  alcoholNum = round(type.alcohol, 2);

  //if (!isNaN(parseInt(type.coffee))) {coffeeNum = parseInt(type.coffee).toFixed(1); }
  coffeeNum = round(type.coffee, 2);

  if (type.exercise > 0.5) {
    exerciseResult = "✅";
  }
  if (type.vitamin > 0.5) {
    vitaminResult = "✅";
  }

  return (
    <div className="resultList">
      <div className="listItem">Sleep: ~{sleepNum} hrs</div>
      <div className="listItem">Exercise: {exerciseResult}</div>
      <div className="listItem">Alcohol: ~{alcoholNum} drinks</div>
      <div className="listItem">Coffee: ~{coffeeNum} cups</div>
      <div className="listItem">Vitamin: {vitaminResult}</div>
    </div>
  );
}
