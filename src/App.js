import _ from "lodash";
import { useEffect, useState } from "react";
import { useInput } from "./useInput";
import "./index.css";
import { LineItem } from './LineItem';
import { toDollarAmount } from './utils';

function makeItem() {
  return Object.freeze({ cost: 0, owners: "", id: _.uniqueId() });
}

export default function App() {
  const [lineItems, setLineItems] = useState([makeItem()]);
  const { value: total, bind: bindTotal, reset: resetTotal } = useInput("");

  const prices = lineItems.map((item) => item.cost);
  const subtotal = prices.reduce((acc, cur) => acc + cur, 0);
  const taxAndTip = total - subtotal;
  const portionWeights = prices.map((x) => x / subtotal);
  const portionTotalSplits = portionWeights.map((x) => x * total);

  useEffect(() => {
    console.log({ prices, subtotal, taxAndTip });

    console.log(
      "portionWeights",
      portionWeights,
      portionWeights.reduce((acc, cur) => acc + cur, 0)
    );
  
    console.log(
      "portionTotalSplits",
      portionTotalSplits.map((x) => x.toFixed(2)),
      portionTotalSplits.reduce((acc, cur) => acc + cur, 0)
    );
  });

  const onAddItem = () => {
    setLineItems([...lineItems, makeItem()]);
  };

  const onDeleteItem = (index) => () => {
    const newItems = [...lineItems];
    _.pullAt(newItems, index);
    setLineItems(newItems);
  };

  const onUpdateItem = (item) => {
    const itemIndex = _.findIndex(lineItems, (x) => x.id === item.id);
    const newItems = [...lineItems];
    newItems[itemIndex] = item;
    setLineItems(newItems);
  };

  return (
    <div className="App">
      <form>
        <p>
          {lineItems.map((item, index) => (
            <LineItem
              key={item.id}
              item={item}
              totalSplit={portionTotalSplits[index]}
              onDelete={onDeleteItem(index)}
              onUpdate={onUpdateItem}
            />
          ))}
          <input type="button" value="Add Item" onClick={onAddItem} />
        </p>
        <p>
          Subtotal: {toDollarAmount(subtotal)}
          <br />
          Tax & Tip: {toDollarAmount(taxAndTip)}
          <br />
          <label>
            Grand Total:
            $<input type="number" {...bindTotal} />
          </label>
        </p>
      </form>
    </div>
  );
}
